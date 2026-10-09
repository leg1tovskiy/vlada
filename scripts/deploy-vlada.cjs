const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Packaging dist directory into dist.tar.gz...');
execSync('tar -czf dist.tar.gz -C dist .', { cwd: path.join(__dirname, '..') });
const archivePath = path.join(__dirname, '..', 'dist.tar.gz');
const archiveSize = fs.statSync(archivePath).size;
console.log(`Archive created: ${(archiveSize / 1024 / 1024).toFixed(2)} MB`);

const config = {
  host: '64.188.66.194',
  port: 22,
  username: 'root',
  password: 'N2PIpAQ8PpKgtBDu9h',
  readyTimeout: 30000,
};

const conn = new Client();

function execCommand(conn, cmd) {
  return new Promise((resolve, reject) => {
    console.log(`>>> VPS: ${cmd}`);
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let stdout = '';
      let stderr = '';
      stream.on('close', (code) => {
        resolve({ code, stdout, stderr });
      });
      stream.on('data', (data) => {
        stdout += data.toString();
        process.stdout.write(data.toString());
      });
      stream.stderr.on('data', (data) => {
        stderr += data.toString();
        process.stderr.write(data.toString());
      });
    });
  });
}

function uploadFile(conn, localPath, remotePath) {
  return new Promise((resolve, reject) => {
    console.log(`>>> UPLOADING ${localPath} -> ${remotePath}...`);
    conn.sftp((err, sftp) => {
      if (err) return reject(err);
      const readStream = fs.createReadStream(localPath);
      const writeStream = sftp.createWriteStream(remotePath);
      let totalBytes = fs.statSync(localPath).size;
      let uploadedBytes = 0;
      let lastReport = 0;

      readStream.on('data', (chunk) => {
        uploadedBytes += chunk.length;
        const percent = Math.floor((uploadedBytes / totalBytes) * 100);
        if (percent >= lastReport + 25 || uploadedBytes === totalBytes) {
          console.log(`Uploaded ${percent}% (${(uploadedBytes / 1024 / 1024).toFixed(1)}MB / ${(totalBytes / 1024 / 1024).toFixed(1)}MB)`);
          lastReport = percent;
        }
      });

      writeStream.on('close', () => {
        console.log('Upload finished.');
        resolve();
      });

      writeStream.on('error', (err) => reject(err));
      readStream.on('error', (err) => reject(err));
      readStream.pipe(writeStream);
    });
  });
}

conn.on('ready', async () => {
  try {
    console.log('SSH connection established.');
    await uploadFile(conn, archivePath, '/tmp/dist.tar.gz');
    await execCommand(conn, 'mkdir -p /var/www/vlada/dist && rm -rf /var/www/vlada/dist/* && tar -xzf /tmp/dist.tar.gz -C /var/www/vlada/dist && rm -f /tmp/dist.tar.gz && chown -R caddy:caddy /var/www/vlada/dist && chmod -R 755 /var/www/vlada/dist');
    console.log('Deploy completed successfully!');
    if (fs.existsSync(archivePath)) {
      fs.unlinkSync(archivePath);
    }
    conn.end();
    process.exit(0);
  } catch (err) {
    console.error('Deploy error:', err);
    conn.end();
    process.exit(1);
  }
});

conn.on('error', (err) => {
  console.error('SSH error:', err);
  process.exit(1);
});

conn.connect(config);
