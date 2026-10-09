import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { VLADA_INTRO, VLADA_WISHES, type VladaWishItem } from "@/data/vlada-wishes";

/**
 * Аутентичные звуки перелистывания страниц из Minecraft (item.book.page_turn 1, 2, 3).
 * Воспроизводит официальные сэмплы из ванильной игры со случайным питчем и чередованием вариаций.
 */
class PageTurnAudio {
  private audioFiles = [
    "/sounds/page_flip1.ogg",
    "/sounds/page_flip2.ogg",
    "/sounds/page_flip3.ogg",
  ];

  play() {
    try {
      if (typeof window === "undefined") return;
      const index = Math.floor(Math.random() * this.audioFiles.length);
      const audio = new Audio(this.audioFiles[index]);
      audio.volume = 0.95;
      audio.playbackRate = 0.95 + Math.random() * 0.1;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const fallback = new Audio(`/page_flip${index + 1}.ogg`);
          fallback.volume = 0.95;
          void fallback.play().catch(() => {});
        });
      }
    } catch {
      // Игнорируем ограничения автовоспроизведения
    }
  }
}

const pageAudio = new PageTurnAudio();

export interface BookPageData {
  wishId?: number;
  headerTitle: string;
  date?: string;
  text: string;
  authorSignature?: string;
}

export interface BookSpreadData {
  spreadIndex: number;
  isIntro?: boolean;
  leftPage: BookPageData | null;
  rightPage: BookPageData | null;
}

/**
 * Интеллектуальное разбиение текста поздравления на страницы книги:
 * - Текст не обрезается и не скроллится — он плавно переносится на следующие страницы.
 * - Подпись автора ставится строго на последней странице, где заканчивается текст пожелания.
 */
export function paginateWish(text: string, maxCharsPerPage = 380): string[] {
  const trimmed = text.trim();
  if (trimmed.length <= maxCharsPerPage) {
    const lines = trimmed.split("\n");
    if (lines.length <= 10) return [trimmed];
  }

  const paragraphs = trimmed.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean);
  const pages: string[] = [];
  let curPageText = "";

  for (const para of paragraphs) {
    const rawLines = para.split("\n").map((l) => l.trim()).filter(Boolean);
    const isProse = rawLines.every((l) => l.length > 45) || rawLines.length <= 2;
    const cleanPara = isProse ? rawLines.join(" ") : rawLines.join("\n");

    let chunks: string[] = [];
    if (cleanPara.length > 250) {
      const sents = cleanPara.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [cleanPara];
      for (const s of sents) {
        const sTrim = s.trim();
        if (sTrim.length > 250) {
          const clauses = sTrim.match(/[^,;]+[,;]+(?:\s+|$)|[^,;]+$/g) || [sTrim];
          let buf = "";
          for (const c of clauses) {
            const cTrim = c.trim();
            if ((buf + " " + cTrim).trim().length > 220 && buf.length > 0) {
              chunks.push(buf.trim());
              buf = cTrim;
            } else {
              buf = (buf + " " + cTrim).trim();
            }
          }
          if (buf.length > 0) chunks.push(buf.trim());
        } else if (sTrim.length > 0) {
          chunks.push(sTrim);
        }
      }
    } else {
      chunks = [cleanPara];
    }

    for (let ci = 0; ci < chunks.length; ci++) {
      const chunk = chunks[ci];
      const sep = curPageText.length === 0 ? "" : ci === 0 ? "\n\n" : " ";
      const testText = curPageText + sep + chunk;

      if (curPageText.length > 0 && testText.length > maxCharsPerPage) {
        pages.push(curPageText);
        curPageText = chunk;
      } else {
        curPageText = testText;
      }
    }
  }

  if (curPageText.length > 0) {
    pages.push(curPageText);
  }

  return pages.length > 0 ? pages : [trimmed];
}

/**
 * Генерация всех разворотов книги (разворот 1 — Intro, развороты 2..N — поздравления).
 * Каждое поздравление начинается на левой странице нового разворота и переходит на правые
 * и последующие развороты до полного завершения с подписью.
 */
export function buildAllSpreads(wishesList: VladaWishItem[]): BookSpreadData[] {
  const spreads: BookSpreadData[] = [];

  // Разворот 1: Вступительный лист
  spreads.push({
    spreadIndex: 1,
    isIntro: true,
    leftPage: null,
    rightPage: null,
  });

  for (const wish of wishesList) {
    const pages = paginateWish(wish.text, 380);
    const numSpreads = Math.ceil(pages.length / 2);

    for (let s = 0; s < numSpreads; s++) {
      const pLeftIdx = s * 2;
      const pRightIdx = s * 2 + 1;

      const isFirstSpreadOfWish = s === 0;
      const isLeftLast = pLeftIdx === pages.length - 1;
      const isRightLast = pRightIdx === pages.length - 1;

      const leftPage: BookPageData = {
        wishId: wish.id,
        headerTitle: isFirstSpreadOfWish
          ? `Поздравление #${wish.id}`
          : `Поздравление #${wish.id} (продолжение)`,
        date: wish.date,
        text: pages[pLeftIdx],
        authorSignature: isLeftLast ? wish.author : undefined,
      };

      let rightPage: BookPageData | null = null;
      if (pRightIdx < pages.length) {
        rightPage = {
          wishId: wish.id,
          headerTitle: "(продолжение)",
          date: undefined,
          text: pages[pRightIdx],
          authorSignature: isRightLast ? wish.author : undefined,
        };
      }

      spreads.push({
        spreadIndex: spreads.length + 1,
        isIntro: false,
        leftPage,
        rightPage,
      });
    }
  }

  return spreads;
}

/**
 * Внутренний контент вступительной страницы
 */
function IntroPageContent() {
  return (
    <div className="flex h-full flex-col justify-between text-black font-minecraft leading-[1.4]">
      <div>
        <div className="text-center pb-2 border-b-2 border-black/15">
          <h3
            className="font-bold text-black"
            style={{ fontSize: "clamp(15px, 2.4vw, 21px)" }}
          >
            {VLADA_INTRO.title}
          </h3>
          <p
            className="text-black/70 mt-0.5"
            style={{ fontSize: "clamp(10px, 1.6vw, 13px)" }}
          >
            {VLADA_INTRO.subtitle}
          </p>
        </div>

        <div className="mt-3">
          {VLADA_INTRO.paragraphs.length > 0 && (
            <p
              className="font-bold text-black pb-1.5 leading-snug"
              style={{ fontSize: "clamp(13px, 2vw, 17px)" }}
            >
              {VLADA_INTRO.paragraphs[0]}
            </p>
          )}

          <div
            className="space-y-2 text-black/95 font-normal"
            style={{ fontSize: "clamp(11.5px, 1.7vw, 14.5px)", lineHeight: "1.4" }}
          >
            {VLADA_INTRO.paragraphs.slice(1).map((p, i) => (
              <p key={i} className="leading-snug">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>

      {VLADA_INTRO.signature ? (
        <div className="pt-2 text-right pr-2 text-black font-bold">
          <p
            className="italic opacity-90 inline-flex items-center justify-end gap-1.5"
            style={{ fontSize: "clamp(11px, 1.6vw, 14px)" }}
          >
            {/[❤️❤💗]/.test(VLADA_INTRO.signature) ? (
              <>
                <span>{VLADA_INTRO.signature.replace(/[❤️❤💗]/g, "").trim()}</span>
                <span className="not-italic inline-block font-sans text-[1.15em] leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                  {VLADA_INTRO.signature.includes("💗") ? "💗" : "❤️"}
                </span>
              </>
            ) : (
              VLADA_INTRO.signature
            )}
          </p>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Внутренний контент страницы поздравления (без внутренних полос прокрутки!)
 */
function PageContent({ page }: { page: BookPageData | null }) {
  if (!page) {
    return <div className="size-full" />;
  }

  return (
    <div className="flex h-full flex-col justify-between text-black font-minecraft leading-[1.42]">
      <div className="flex-1 min-h-0 overflow-hidden select-text">
        {page.headerTitle ? (
          <div className="flex items-center justify-between pb-1.5 border-b border-black/10">
            <span
              className="font-bold text-black/80 flex items-center gap-1"
              style={{ fontSize: "clamp(11px, 1.7vw, 14px)" }}
            >
              <span>{page.headerTitle}</span>
            </span>
            {page.date ? (
              <span
                className="text-black/50"
                style={{ fontSize: "clamp(9px, 1.4vw, 11px)" }}
              >
                {page.date}
              </span>
            ) : null}
          </div>
        ) : null}

        <div
          className="mt-2 text-black font-normal whitespace-pre-wrap leading-relaxed"
          style={{ fontSize: "clamp(11px, 1.55vw, 13px)", lineHeight: "1.42" }}
        >
          {page.text}
        </div>
      </div>

      {page.authorSignature ? (
        <div className="pt-1.5 text-right pr-2 shrink-0">
          <p
            className="font-bold text-black"
            style={{ fontSize: "clamp(11.5px, 1.7vw, 14.5px)" }}
          >
            — {page.authorSignature}
          </p>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Полный вид левой половины разворота книги (текстура, паутинка, номер страницы, текст)
 */
function LeftPageView({
  spread,
  totalSpreads,
  isOpening,
}: {
  spread: BookSpreadData;
  totalSpreads: number;
  isOpening?: boolean;
}) {
  return (
    <div className="absolute inset-0 size-full overflow-hidden select-none">
      {/* Текстура левой половины книги: симметрично отражена (-scale-x-100), красный шов у корешка */}
      <img
        src="/book-bg-4x.png"
        alt="Minecraft Book Left Page"
        draggable={false}
        className="absolute inset-0 size-full object-fill pixelated pointer-events-none -scale-x-100"
      />

      {/* Паутинка в левом верхнем углу пергамента */}
      <img
        src="/cobweb.png"
        alt=""
        draggable={false}
        className="absolute z-15 pointer-events-none select-none pixelated opacity-25"
        style={{
          top: "6.2%",
          left: "9.6%",
          width: "clamp(28px, 6.5%, 44px)",
          aspectRatio: "1/1",
        }}
      />

      {/* Номер страницы / заголовок слева вверху (Page X of Y) */}
      <div
        className={`absolute z-20 pointer-events-none text-black font-minecraft text-left font-normal ${
          isOpening ? "book-content-reveal" : ""
        }`}
        style={{
          top: "7.9%",
          left: "12%",
          fontSize: "clamp(11px, 1.8vw, 15px)",
          lineHeight: 1,
        }}
      >
        Page {spread.spreadIndex} of {totalSpreads}
      </div>

      {/* Содержимое левой страницы */}
      <div
        className={`absolute z-15 flex flex-col justify-between overflow-hidden ${
          isOpening ? "book-content-reveal" : ""
        }`}
        style={{
          top: "14%",
          left: "12%",
          right: "14%",
          bottom: "14%",
        }}
      >
        {spread.isIntro ? <IntroPageContent /> : <PageContent page={spread.leftPage} />}
      </div>
    </div>
  );
}

/**
 * Полный вид правой половины разворота книги (текстура, паутинка, заголовок, текст)
 */
function RightPageView({
  spread,
  isOpening,
}: {
  spread: BookSpreadData;
  isOpening?: boolean;
}) {
  return (
    <div className="absolute inset-0 size-full overflow-hidden select-none">
      {/* Текстура правой половины книги: стандартное положение, красный шов у корешка слева */}
      <img
        src="/book-bg-4x.png"
        alt="Minecraft Book Right Page"
        draggable={false}
        className="absolute inset-0 size-full object-fill pixelated pointer-events-none"
      />

      {/* Паутинка в нижнем правом углу пергамента */}
      <img
        src="/cobweb.png"
        alt=""
        draggable={false}
        className="absolute z-15 pointer-events-none select-none pixelated opacity-20 -scale-x-100 -scale-y-100"
        style={{
          bottom: "9.8%",
          right: "8.6%",
          width: "clamp(24px, 5.5%, 36px)",
          aspectRatio: "1/1",
        }}
      />

      {/* Заголовок правой страницы: отображается ТОЛЬКО если на 2 странице есть контент */}
      {spread.rightPage ? (
        <div
          className={`absolute z-20 pointer-events-none text-black font-minecraft text-right font-normal ${
            isOpening ? "book-content-reveal" : ""
          }`}
          style={{
            top: "7.9%",
            right: "12%",
            fontSize: "clamp(11px, 1.8vw, 15px)",
            lineHeight: 1,
          }}
        >
          Page {spread.spreadIndex}
        </div>
      ) : null}

      {/* Содержимое правой страницы */}
      <div
        className={`absolute z-15 flex flex-col justify-between overflow-hidden ${
          isOpening ? "book-content-reveal" : ""
        }`}
        style={{
          top: "14%",
          left: "14%",
          right: "12%",
          bottom: "14%",
        }}
      >
        <PageContent page={spread.rightPage} />
      </div>
    </div>
  );
}

type FlipState = {
  id: number;
  fromSpread: number;
  targetSpread: number;
  direction: "forward" | "backward";
};

export function MinecraftBook() {
  const allSpreads = useMemo(() => buildAllSpreads(VLADA_WISHES), []);
  const totalSpreads = allSpreads.length;
  const [currentSpread, setCurrentSpread] = useState(1);
  const spreadRef = useRef(1);

  const getSpread = useCallback(
    (idx: number) => allSpreads[Math.max(0, Math.min(allSpreads.length - 1, idx - 1))],
    [allSpreads]
  );

  // Анимация раскрытия книги при первом заходе (~1.7 сек, плавно без рывков)
  const [isOpening, setIsOpening] = useState(true);

  const flipIdRef = useRef(0);
  const [flipState, setFlipState] = useState<FlipState | null>(null);
  const flipTimerRef = useRef<number | null>(null);

  const [nextHover, setNextHover] = useState(false);
  const [prevHover, setPrevHover] = useState(false);
  const bookContainerRef = useRef<HTMLDivElement>(null);

  // Запуск плавной анимации раскрытия книги и звука при входе
  useEffect(() => {
    pageAudio.play();
    const openTimer = setTimeout(() => {
      setIsOpening(false);
    }, 1400);

    return () => {
      clearTimeout(openTimer);
    };
  }, []);

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (flipTimerRef.current !== null) {
        clearTimeout(flipTimerRef.current);
      }
    };
  }, []);

  const flipTo = useCallback(
    (spread: number) => {
      if (isOpening || flipTimerRef.current !== null) return;
      const target = Math.max(1, Math.min(totalSpreads, spread));
      const fromSpread = spreadRef.current;
      if (target === fromSpread) return;

      // Звук перелистывания страниц всегда включен
      pageAudio.play();

      const direction: "forward" | "backward" = target >= fromSpread ? "forward" : "backward";

      spreadRef.current = target;

      flipIdRef.current += 1;
      setFlipState({
        id: flipIdRef.current,
        fromSpread,
        targetSpread: target,
        direction,
      });

      flipTimerRef.current = window.setTimeout(() => {
        setCurrentSpread(target);
        setFlipState(null);
        flipTimerRef.current = null;
      }, 500);
    },
    [isOpening, totalSpreads],
  );

  const nextSpread = useCallback(() => {
    const cur = spreadRef.current;
    if (cur < totalSpreads) flipTo(cur + 1);
  }, [flipTo, totalSpreads]);

  const prevSpread = useCallback(() => {
    const cur = spreadRef.current;
    if (cur > 1) flipTo(cur - 1);
  }, [flipTo]);

  // Навигация стрелками на клавиатуре
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        nextSpread();
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        prevSpread();
      } else if (e.key === "Home") {
        flipTo(1);
      } else if (e.key === "End") {
        flipTo(totalSpreads);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [flipTo, nextSpread, prevSpread, totalSpreads]);

  // Во время анимации перелистывания базовые развороты показывают неподвижные страницы
  const baseLeftSpread = flipState
    ? (flipState.direction === "forward" ? flipState.fromSpread : flipState.targetSpread)
    : currentSpread;

  const baseRightSpread = flipState
    ? (flipState.direction === "forward" ? flipState.targetSpread : flipState.fromSpread)
    : currentSpread;

  return (
    <div
      ref={bookContainerRef}
      className="relative flex flex-col items-center justify-center p-2 transition-all select-none w-full max-h-full"
    >
      {/* ── Атмосферный фон Minecraft: Хэллоуинское мистическое свечение и угольки ──── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-radial from-transparent via-black/45 to-black/90" />
        <div className="absolute top-1/4 -left-12 size-80 rounded-full bg-purple-700/10 blur-[100px]" />
        <div className="absolute top-1/3 -right-12 size-80 rounded-full bg-orange-600/12 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/3 size-72 rounded-full bg-amber-500/8 blur-[90px]" />

        {/* Парящие хэллоуинские искорки / угольки */}
        <div
          className="halloween-ember absolute top-1/3 left-1/4 size-1.5 rounded-full bg-amber-400/60 shadow-[0_0_8px_#f59e0b]"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="halloween-ember absolute bottom-1/3 right-1/4 size-2 rounded-full bg-orange-400/50 shadow-[0_0_10px_#ea580c]"
          style={{ animationDelay: "2.2s" }}
        />
        <div
          className="halloween-ember absolute top-2/3 left-1/3 size-1.5 rounded-full bg-purple-400/50 shadow-[0_0_8px_#c084fc]"
          style={{ animationDelay: "3.7s" }}
        />
      </div>

      {/* ── САМА ДВУХСТРАНИЧНАЯ КНИГА MINECRAFT (РАЗВОРОТ НА 2 СТРАНИЦЫ) ────── */}
      <div className="relative z-10 flex items-center justify-center w-full">
        <div
          className="relative aspect-[292/180] w-[min(94vw,880px)] max-h-[min(520px,68vh)] select-none shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]"
          style={{
            imageRendering: "pixelated",
          }}
        >
          {/* ── 3D-СЦЕНА СТРАНИЦ КНИГИ (ИЗОЛИРОВАННЫЙ 3D КОНТЕКСТ) ── */}
          <div
            className="absolute inset-0 size-full"
            style={{
              perspective: "1600px",
              transformStyle: "preserve-3d",
            }}
          >
            {/* ── СВЕТОВОЙ ЭФФЕКТ ИЗГИБА КОРЕШКА ВО ВРЕМЯ РАСКРЫТИЯ КНИГИ ────── */}
            {isOpening && (
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-16 pointer-events-none z-35 book-spine-glow bg-radial from-amber-400/90 via-orange-500/40 to-transparent" />
            )}

          {/* ── ЛЕВАЯ СТРАНИЦА РАЗВОРОТА (СТРАНИЦА 1) ────────────────────────── */}
          <div
            className={`absolute top-0 bottom-0 left-0 w-1/2 overflow-hidden select-none ${
              isOpening ? "book-spread-open-left" : ""
            }`}
            style={{ zIndex: 10 }}
          >
            <LeftPageView
              spread={getSpread(baseLeftSpread)}
              totalSpreads={totalSpreads}
              isOpening={isOpening}
            />

            {/* Кнопка перехода к предыдущему развороту (на левой странице) */}
            {!flipState && currentSpread > 1 ? (
              <button
                type="button"
                onClick={prevSpread}
                onMouseEnter={() => setPrevHover(true)}
                onMouseLeave={() => setPrevHover(false)}
                className="absolute z-30 cursor-pointer outline-none transition-transform active:scale-95 pixelated"
                style={{
                  bottom: "7.2%",
                  left: "11%",
                  width: "15.75%",
                  aspectRatio: "23/13",
                }}
                aria-label="Предыдущая страница"
              >
                <img
                  src={prevHover ? "/book-btn-prev-hover.png" : "/book-btn-prev.png"}
                  alt="Previous Page"
                  draggable={false}
                  className="size-full object-fill pixelated"
                />
              </button>
            ) : null}
          </div>

          {/* ── ЦЕНТРАЛЬНЫЙ СГИБ КОРЕШКА (РЕАЛИСТИЧНЫЙ ОБЪЕМНЫЙ ШОВ) ──────────── */}
          <div
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 pointer-events-none z-20"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(20,10,5,0.28) 35%, rgba(10,5,2,0.6) 50%, rgba(20,10,5,0.28) 65%, rgba(0,0,0,0) 100%)",
            }}
          />

          {/* ── ПРАВАЯ СТРАНИЦА РАЗВОРОТА (СТРАНИЦА 2) ────────────────────────── */}
          <div
            className={`absolute top-0 bottom-0 right-0 w-1/2 overflow-hidden select-none ${
              isOpening ? "book-spread-open-right" : ""
            }`}
            style={{ zIndex: 10 }}
          >
            <RightPageView
              spread={getSpread(baseRightSpread)}
              isOpening={isOpening}
            />

            {/* Кнопка перехода к следующему развороту (на правой странице) */}
            {!flipState && currentSpread < totalSpreads ? (
              <button
                type="button"
                onClick={nextSpread}
                onMouseEnter={() => setNextHover(true)}
                onMouseLeave={() => setNextHover(false)}
                className="absolute z-30 cursor-pointer outline-none transition-transform active:scale-95 pixelated"
                style={{
                  bottom: "7.2%",
                  right: "11%",
                  width: "15.75%",
                  aspectRatio: "23/13",
                }}
                aria-label="Следующая страница"
              >
                <img
                  src={nextHover ? "/book-btn-next-hover.png" : "/book-btn-next.png"}
                  alt="Next Page"
                  draggable={false}
                  className="size-full object-fill pixelated"
                />
              </button>
            ) : null}
          </div>

          {/* ── АУТЕНТИЧНЫЙ 3D-ЛИСТ ПЕРЕЛИСТЫВАНИЯ СТРАНИЦ (ПЕРЕКИДЫВАЕТСЯ ЧЕРЕЗ КОРЕШОК) ── */}
          {/* ВПЕРЁД: Лист перелистывается справа налево (с 0° до -180°) */}
          {flipState && flipState.direction === "forward" && (
            <div
              key={`leaf-forward-${flipState.id}`}
              className="absolute top-0 bottom-0 pointer-events-none select-none flip-leaf-forward z-30"
              style={{
                left: "50%",
                width: "50%",
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Лицевая сторона: уходящая правая страница (видна при 0°..-90°) */}
              <div className="absolute inset-0 size-full overflow-hidden flip-face-front">
                <RightPageView spread={getSpread(flipState.fromSpread)} />
                <div className="absolute inset-0 size-full pointer-events-none flip-shadow-front" />
              </div>

              {/* Оборотная сторона: приходящая левая страница (видна при -90°..-180°) */}
              <div className="absolute inset-0 size-full overflow-hidden flip-face-back">
                <LeftPageView
                  spread={getSpread(flipState.targetSpread)}
                  totalSpreads={totalSpreads}
                />
                <div className="absolute inset-0 size-full pointer-events-none flip-shadow-back" />
              </div>
            </div>
          )}

          {/* НАЗАД: Лист перелистывается слева направо (с 0° до 180°) */}
          {flipState && flipState.direction === "backward" && (
            <div
              key={`leaf-backward-${flipState.id}`}
              className="absolute top-0 bottom-0 pointer-events-none select-none flip-leaf-backward z-30"
              style={{
                left: 0,
                width: "50%",
                transformOrigin: "right center",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Лицевая сторона: уходящая левая страница (видна при 0°..90°) */}
              <div className="absolute inset-0 size-full overflow-hidden flip-face-front">
                <LeftPageView
                  spread={getSpread(flipState.fromSpread)}
                  totalSpreads={totalSpreads}
                />
                <div className="absolute inset-0 size-full pointer-events-none flip-shadow-front" />
              </div>

              {/* Оборотная сторона: приходящая правая страница (видна при 90°..180°) */}
              <div className="absolute inset-0 size-full overflow-hidden flip-face-back">
                <RightPageView spread={getSpread(flipState.targetSpread)} />
                <div className="absolute inset-0 size-full pointer-events-none flip-shadow-back" />
              </div>
            </div>
          )}
          </div>

          {/* ── ПРАЗДНИЧНЫЕ ДЕКОРАЦИИ КНИГИ (ВСЕГДА СТРОГО ПОВЕРХ ВСЕХ 3D-СТРАНИЦ И ПЕРЕЛИСТЫВАНИЯ) ── */}
          <div className="absolute inset-0 size-full pointer-events-none z-50">
            {/* ── Праздник: 3-этажный торт на верхнем левом углу книги ── */}
            <div
              className={`absolute z-50 pointer-events-auto select-none group ${
                isOpening ? "book-decor-reveal" : ""
              }`}
              style={{
                top: "clamp(-36px, -4.5vw, -24px)",
                left: "clamp(-14px, -1.8vw, -8px)",
              }}
            >
              {/* Надпись над тортом (появляется ТОЛЬКО при наведении) */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/90 px-2.5 py-0.5 text-[10px] text-pink-300 font-minecraft border border-pink-500/50 shadow-[0_0_14px_rgba(236,72,153,0.45)] pointer-events-none select-none z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Поздравляем с днем рождения! 🎂
              </div>

              {/* Сам 3-этажный пиксельный торт со свечами */}
              <div className="relative candle-glow transition-transform duration-300 ease-out group-hover:scale-105 cursor-pointer filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                <img
                  src="/cake-3tier.svg"
                  alt="3-Tier Birthday Cake"
                  draggable={false}
                  className="h-auto object-contain pixelated pointer-events-none"
                  style={{
                    imageRendering: "pixelated",
                    width: "clamp(46px, 6.8vw, 68px)",
                    maxWidth: "68px",
                  }}
                />
              </div>
            </div>

            {/* ── Хэллоуин: Пиксельная тыквочка на верхнем правом углу книги ── */}
            <div
              className={`absolute z-50 pointer-events-auto select-none group ${
                isOpening ? "book-decor-reveal" : ""
              }`}
              style={{
                top: "clamp(-30px, -3.8vw, -20px)",
                right: "clamp(-14px, -1.8vw, -8px)",
              }}
            >
              {/* Паутинка, свисающая с уголка книги под тыквой */}
              <img
                src="/cobweb.png"
                alt=""
                draggable={false}
                className="absolute -bottom-2 -left-3 pointer-events-none select-none pixelated opacity-30 -rotate-45"
                style={{
                  width: "clamp(28px, 4vw, 42px)",
                  height: "clamp(28px, 4vw, 42px)",
                }}
              />

              {/* Надпись над тыквой (появляется ТОЛЬКО при наведении) */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/90 px-2.5 py-0.5 text-[10px] text-amber-300 font-minecraft border border-amber-500/50 shadow-[0_0_14px_rgba(255,140,0,0.45)] pointer-events-none select-none z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Счастливого Хэллоуина! 🎃
              </div>

              {/* Сама пиксельная тыква */}
              <div className="relative halloween-pumpkin-glow transition-transform duration-300 ease-out group-hover:scale-105 cursor-pointer">
                <img
                  src="/pixel-pumpkin.png"
                  alt="Halloween Jack-o'-lantern"
                  draggable={false}
                  className="h-auto object-contain pixelated pointer-events-none"
                  style={{
                    imageRendering: "pixelated",
                    width: "clamp(50px, 7.2vw, 72px)",
                    maxWidth: "72px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MinecraftBook;
