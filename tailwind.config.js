/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0c0d10',
        surface: '#15171c',
        elevated: '#1c1f26',
        fg: '#eef0f4',
        muted: '#8b909a',
        subtle: '#5c616b',
        border: 'rgba(238, 240, 244, 0.1)',
        accent: '#ff8a3d',
      },
      fontFamily: {
        minecraft: ['Minecraft', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
