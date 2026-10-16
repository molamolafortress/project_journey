import React, { useState, useEffect, useRef } from 'react';
import { EndingSlide, BucketItem, PlayerProfile, ColorTheme, Language } from '../types/game';
import { soundEngine } from '../services/soundEngine';
import { JourneyArtwork } from './JourneyArtwork';
import { Play, Pause, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';

interface FrostpunkEndingProps {
  slides: EndingSlide[];
  history: BucketItem[];
  profile: PlayerProfile;
  totalLifeGained: string;
  colorTheme: ColorTheme;
  lang: Language;
  onRestart: () => void;
}

export const FrostpunkEnding: React.FC<FrostpunkEndingProps> = ({
  slides,
  history,
  profile,
  totalLifeGained,
  colorTheme,
  lang,
  onRestart
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [slideState, setSlideState] = useState<'entering' | 'active' | 'exiting'>('active');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Preload personalized AI Artwork as soon as Ending starts
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [isArtworkLoading, setIsArtworkLoading] = useState<boolean>(true);
  const [artworkError, setArtworkError] = useState<string | null>(null);

  const isHanji = colorTheme === 'hanji';
  const isEn = lang === 'en';
  const currentSlide = slides[currentIndex];
  const isLastSlide = currentIndex === slides.length - 1;

  const generateEndingArtwork = async () => {
    setIsArtworkLoading(true);
    setArtworkError(null);
    try {
      const res = await fetch('/api/gemini/generate-artwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coreValue: profile.coreValue,
          summary: profile.summary,
          history: history.map((h) => ({ text: h.text, category: h.category })),
          theme: colorTheme
        })
      });
      if (!res.ok) throw new Error(isEn ? 'Failed to generate artwork' : '아트워크 생성 실패');
      const data = await res.json();
      if (data && data.imageUrl) {
        setArtworkUrl(data.imageUrl);
      } else {
        throw new Error(isEn ? 'No image data received' : '이미지 데이터 없음');
      }
    } catch (err: unknown) {
      setArtworkError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsArtworkLoading(false);
    }
  };

  useEffect(() => {
    generateEndingArtwork();
  }, [colorTheme]);

  useEffect(() => {
    soundEngine.startAmbientDrone();
    soundEngine.playTransitionHit(0);

    return () => {
      soundEngine.stopAmbientDrone();
    };
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!isAutoPlay || isLastSlide) return;

    timerRef.current = setTimeout(() => {
      setSlideState('exiting');
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const next = prev + 1;
          soundEngine.playTransitionHit(next);
          return next;
        });
        setSlideState('active');
      }, 1200);
    }, 6800);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isAutoPlay, isLastSlide]);

  const handleNext = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (currentIndex < slides.length - 1) {
      setSlideState('exiting');
      setTimeout(() => {
        const next = currentIndex + 1;
        setCurrentIndex(next);
        soundEngine.playTransitionHit(next);
        setSlideState('active');
      }, 300);
    }
  };

  const handlePrev = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (currentIndex > 0) {
      setSlideState('exiting');
      setTimeout(() => {
        const prev = currentIndex - 1;
        setCurrentIndex(prev);
        soundEngine.playTransitionHit(prev);
        setSlideState('active');
      }, 300);
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  return (
    <section
      className={`min-h-[580px] flex flex-col justify-between p-6 md:p-10 select-none max-w-3xl mx-auto transition-colors duration-300 ${
        isHanji ? 'text-[#1c1a18]' : 'bg-black text-white'
      }`}
    >
      {/* Header bar */}
      <div className="space-y-2 text-center">
        <div
          className={`flex justify-between items-center text-[11px] font-mono tracking-[0.3em] uppercase ${
            isHanji ? 'text-[#736a5c]' : 'text-neutral-500'
          }`}
        >
          <span>THE CHRONICLE OF YOUR TIME</span>
          <span>{currentIndex + 1} / {slides.length}</span>
        </div>
        <div className={isHanji ? 'frost-rule-hanji w-48 mx-auto' : 'frost-rule-black w-48 mx-auto'} />
      </div>

      {/* Slide Stage Container */}
      <div className="my-auto py-8">
        <div
          className={`transition-all duration-1000 ${
            slideState === 'exiting'
              ? 'opacity-0 scale-102 -translate-y-3 blur-xs'
              : 'opacity-100 scale-100 translate-y-0 blur-none'
          }`}
        >
          {/* 1. Choice Slide */}
          {currentSlide.type === 'choice' && (
            <div className="max-w-xl mx-auto space-y-6 text-center">
              <div
                className={`text-xs font-sans tracking-[0.25em] uppercase ${
                  isHanji ? 'text-[#877e70]' : 'text-neutral-400'
                }`}
              >
                {isEn
                  ? `Record #${currentSlide.turn} — ${currentSlide.days} Days of Life`
                  : `기록 #${currentSlide.turn} — ${currentSlide.days}일간의 시간`}
              </div>

              <h2
                className={`text-2xl md:text-3xl font-bold font-serif-kr leading-snug py-2 ${
                  isHanji ? 'text-[#1c1a18]' : 'text-white'
                }`}
              >
                "{currentSlide.title}"
              </h2>

              <p
                className={`leading-relaxed text-base md:text-lg font-light font-serif-kr whitespace-pre-line px-2 ${
                  isHanji ? 'text-[#332f2b]' : 'text-neutral-300'
                }`}
              >
                {currentSlide.chronicle}
              </p>

              <div className="pt-4 flex justify-center gap-3 text-xs font-mono tracking-wider">
                <span
                  className={`px-3.5 py-1.5 border rounded-lg ${
                    isHanji
                      ? 'bg-[#ffffff] border-[#ded7c5] text-[#b83a2b] font-medium'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300'
                  }`}
                >
                  SPENT -${currentSlide.cost?.toLocaleString()}
                </span>
                <span
                  className={`px-3.5 py-1.5 border font-semibold rounded-lg ${
                    isHanji
                      ? 'bg-[#ffffff] border-[#ded7c5] text-[#2f5b40]'
                      : 'bg-neutral-950 border-neutral-800 text-white'
                  }`}
                >
                  LIFE +{currentSlide.lifeDelta} MONTHS
                </span>
              </div>
            </div>
          )}

          {/* 2. Summary Slide: The Reckoning */}
          {currentSlide.type === 'summary' && (
            <div className="max-w-xl mx-auto space-y-6 text-center">
              <div
                className={`text-xs font-mono tracking-[0.25em] uppercase ${
                  isHanji ? 'text-[#877e70]' : 'text-neutral-400'
                }`}
              >
                {isEn ? 'THE RECKONING — SUMMARY OF YOUR JOURNEY' : 'THE RECKONING — 여정의 결산'}
              </div>

              <h2
                className={`text-2xl md:text-3xl font-bold font-serif-kr leading-snug py-2 ${
                  isHanji ? 'text-[#1c1a18]' : 'text-white'
                }`}
              >
                {isEn
                  ? `${currentSlide.chosenCount} Wishes Fulfilled, and +${currentSlide.totalLifeGained} Months of Life`
                  : `${currentSlide.chosenCount}가지의 마주한 소망, 그리고 +${currentSlide.totalLifeGained}개월의 삶`}
              </h2>

              <p
                className={`leading-relaxed text-base font-light font-serif-kr px-2 ${
                  isHanji ? 'text-[#332f2b]' : 'text-neutral-300'
                }`}
              >
                {isEn ? (
                  <>
                    You used a total of{' '}
                    <span className={`font-semibold ${isHanji ? 'text-[#b83a2b]' : 'text-white'}`}>
                      ${currentSlide.totalSpent?.toLocaleString()}
                    </span>{' '}
                    to turn the wishes held deep in your heart into reality.<br />
                    The vitality born from immersing yourself in what you truly loved extended your initial 6 months to a total of{' '}
                    <span className={`font-semibold ${isHanji ? 'text-[#2f5b40]' : 'text-white'}`}>
                      {currentSlide.finalMonths?.toFixed(1)} months
                    </span>.
                  </>
                ) : (
                  <>
                    당신은 총{' '}
                    <span className={`font-semibold ${isHanji ? 'text-[#b83a2b]' : 'text-white'}`}>
                      ${currentSlide.totalSpent?.toLocaleString()}
                    </span>
                    의 예산을 사용하여 마음 깊이 원했던 소망들을 현실로 바꾸었습니다.<br />
                    자신이 진짜 원하는 것에 몰입할 때 피어난 생명력은 6개월이었던 당신의 시간을 총{' '}
                    <span className={`font-semibold ${isHanji ? 'text-[#2f5b40]' : 'text-white'}`}>
                      {currentSlide.finalMonths?.toFixed(1)}개월
                    </span>
                    까지 연장시켰습니다.
                  </>
                )}
              </p>

              {currentSlide.unchosen && currentSlide.unchosen.length > 0 && (
                <div
                  className={`mt-6 pt-5 border text-left space-y-2.5 p-5 rounded-xl ${
                    isHanji
                      ? 'bg-[#ffffff] border-[#ded7c5] shadow-sm'
                      : 'bg-neutral-950/60 border-neutral-800'
                  }`}
                >
                  <div
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      isHanji ? 'text-[#b83a2b]' : 'text-neutral-400'
                    }`}
                  >
                    {isEn
                      ? 'Wishes Left Behind Before Finite Time and Budget'
                      : '한정된 예산과 시간 앞에 끝내 남겨둔 소망들'}
                  </div>
                  <div className={`text-xs leading-relaxed space-y-1 ${isHanji ? 'text-[#5a544a]' : 'text-neutral-400'}`}>
                    {currentSlide.unchosen.slice(0, 4).map((u, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className={isHanji ? 'text-[#b83a2b]' : 'text-neutral-600'}>•</span>
                        <span className={isHanji ? 'text-[#2b2723]' : 'text-neutral-300'}>{u}</span>
                      </div>
                    ))}
                    {currentSlide.unchosen.length > 4 && (
                      <div className={`pt-1 text-[11px] ${isHanji ? 'text-[#877e70]' : 'text-neutral-500'}`}>
                        {isEn
                          ? `...and ${currentSlide.unchosen.length - 4} more unfulfilled wish(es)`
                          : `외 ${currentSlide.unchosen.length - 4}가지의 미뤄둔 소망...`}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. Argon Profile Slide */}
          {currentSlide.type === 'argon_profile' && (
            <div className="max-w-xl mx-auto space-y-6 text-left">
              <div className="text-center space-y-1">
                <div
                  className={`text-xs font-mono tracking-[0.25em] uppercase ${
                    isHanji ? 'text-[#877e70]' : 'text-neutral-400'
                  }`}
                >
                  ARGON PROFILE — GENUINE SELF (GEMINI 4 ARGON)
                </div>
                <h2
                  className={`text-2xl md:text-3xl font-bold font-serif-kr ${
                    isHanji ? 'text-[#1c1a18]' : 'text-white'
                  }`}
                >
                  {isEn ? 'The Shape of Life You Truly Longed For' : '당신이 진정으로 원했던 삶의 모습'}
                </h2>
              </div>

              <div
                className={`border rounded-2xl p-6 md:p-8 space-y-4 shadow-xl ${
                  isHanji
                    ? 'bg-[#ffffff] border-[#ded7c5] shadow-[0_12px_40px_rgb(0,0,0,0.06)]'
                    : 'bg-neutral-950 border-neutral-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-sans uppercase tracking-wider ${
                        isHanji ? 'text-[#736a5c]' : 'text-neutral-500'
                      }`}
                    >
                      {isEn ? 'Core Value' : '핵심 가치'}
                    </span>
                  </div>
                  <div
                    className={`text-xl font-bold font-serif-kr ${
                      isHanji ? 'text-[#1c1a18]' : 'text-white'
                    }`}
                  >
                    "{profile.coreValue || (isEn ? 'A life lived at your own authentic rhythm' : '나만의 호흡으로 살아가는 삶')}"
                  </div>
                </div>

                <div className={isHanji ? 'frost-rule-hanji' : 'frost-rule-black'} />

                <div className="space-y-2">
                  <span
                    className={`text-xs font-sans uppercase tracking-wider ${
                      isHanji ? 'text-[#736a5c]' : 'text-neutral-500'
                    }`}
                  >
                    {isEn ? 'Inner Psychological Analysis' : '내면 분석'}
                  </span>
                  <p
                    className={`text-sm md:text-base leading-relaxed font-serif-kr font-light ${
                      isHanji ? 'text-[#38332d]' : 'text-neutral-300'
                    }`}
                  >
                    {profile.summary}
                  </p>
                </div>

                {profile.repressedDesires && (
                  <div className="space-y-1.5 pt-2">
                    <span
                      className={`text-xs font-sans uppercase tracking-wider ${
                        isHanji ? 'text-[#736a5c]' : 'text-neutral-500'
                      }`}
                    >
                      {isEn ? 'What Was Held Back in Reality' : '현실에서 억눌렸던 것'}
                    </span>
                    <p
                      className={`text-xs md:text-sm leading-relaxed font-sans ${
                        isHanji ? 'text-[#5a544a]' : 'text-neutral-400'
                      }`}
                    >
                      {profile.repressedDesires}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. Final Artwork & Philosophical Awakening */}
          {currentSlide.type === 'artwork_awakening' && (
            <div className="max-w-2xl mx-auto space-y-8 text-center">
              {/* Artwork Canvas (Preloaded when FrostpunkEnding mounted!) */}
              <JourneyArtwork
                history={history}
                profile={profile}
                totalLifeGained={totalLifeGained}
                colorTheme={colorTheme}
                lang={lang}
                preloadedImageUrl={artworkUrl}
                preloadedIsLoading={isArtworkLoading}
                preloadedError={artworkError}
                onRetry={generateEndingArtwork}
              />

              {/* Philosophical Awakening message */}
              <div className="space-y-4 pt-2">
                <p
                  className={`text-lg md:text-xl font-serif-kr font-medium leading-relaxed ${
                    isHanji ? 'text-[#1c1a18]' : 'text-neutral-200'
                  }`}
                >
                  {isEn ? (
                    <>
                      “Your budget in the game is now exhausted,<br />
                      but for you—looking at this screen right now—far more than six months and countless possibilities still remain.”
                    </>
                  ) : (
                    <>
                      “게임 속 예산은 모두 소진되었지만,<br />
                      지금 화면을 마주하고 있는 당신에게는 아직 6개월보다 훨씬 긴 시간과 기회가 남아있습니다.”
                    </>
                  )}
                </p>
                <p className={`text-xs md:text-sm ${isHanji ? 'text-[#5a544a]' : 'text-neutral-400'}`}>
                  {isEn
                    ? 'Why not take one small step today toward a genuine wish you have kept tucked away in a corner of your heart?'
                    : '바쁜 일상 때문에 가슴 한구석으로 미뤄두었던 당신의 진짜 소망 하나, 오늘 작은 것부터 시작해 보는 건 어떨까요?'}
                </p>

                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={onRestart}
                    className={`font-semibold px-8 py-3 rounded-xl text-sm transition flex items-center gap-2 shadow-lg cursor-pointer ${
                      isHanji
                        ? 'bg-[#1c1a18] hover:bg-[#332f2c] text-[#f7f4ea]'
                        : 'bg-white hover:bg-neutral-200 text-black'
                    }`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isEn ? 'Begin a New Journey' : '새로운 여정 다시 시작하기'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div
        className={`flex justify-between items-center pt-6 border-t text-xs ${
          isHanji ? 'border-[#ded7c5]' : 'border-neutral-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`font-mono tracking-widest ${
              isHanji ? 'text-[#736a5c]' : 'text-neutral-500'
            }`}
          >
            {String(currentIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
          {!isLastSlide && (
            <button
              onClick={toggleAutoPlay}
              className={`flex items-center gap-1 transition px-2 py-1 rounded border cursor-pointer ${
                isHanji
                  ? 'bg-white border-[#ded7c5] text-[#2c2925] hover:bg-[#ede5d4]'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {isAutoPlay ? (
                <>
                  <Pause className="w-3 h-3" />
                  <span>{isEn ? 'Auto-Advance On' : '천천히 자동 넘김 켜짐'}</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  <span>{isEn ? 'Manual Mode' : '수동 모드'}</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className={`border px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                isHanji
                  ? 'bg-white border-[#ded7c5] text-[#2c2925] hover:bg-[#ede5d4]'
                  : 'border-neutral-800 hover:border-neutral-500 text-neutral-400 hover:text-white'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{isEn ? 'Prev' : '이전'}</span>
            </button>
          )}
          {!isLastSlide ? (
            <button
              onClick={handleNext}
              className={`border px-4 py-1.5 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer ${
                isHanji
                  ? 'bg-[#1c1a18] hover:bg-[#332f2c] text-[#f7f4ea] border-[#1c1a18]'
                  : 'bg-neutral-900 hover:bg-white text-neutral-200 hover:text-black border-neutral-700 hover:border-white'
              }`}
            >
              <span>{isEn ? 'Next Record' : '다음 기록'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
};
