import React, { useState } from 'react';
import { ColorTheme } from '../types/game';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface StoryBridgeStepProps {
  colorTheme: ColorTheme;
  onComplete: () => void;
}

interface ChapterSlide {
  tag: string;
  seal?: string;
  headline: string;
  paragraphs: string[];
  btnText: string;
}

const CHAPTER_SLIDES: ChapterSlide[] = [
  {
    tag: "Chapter I. 멈춰버린 시계",
    seal: "선고",
    headline: "“당신에게 남은 시간은 약 6개월입니다.”",
    paragraphs: [
      "진료실의 차가운 정적을 깨고 들려온 의사의 목소리는 이상할 만큼 담담했습니다. 창밖으로는 아무 일도 없었다는 듯 평소와 다름없는 햇살이 쏟아져 내리고 있었습니다.",
      "늘 ‘이번 프로젝트만 끝나면’, ‘조금만 더 여유가 생기면’이라며 달력 뒤편으로 끝없이 미뤄두었던 당신의 수많은 내일들이, 단 한 문장 앞에서 영원히 멈춰 섰습니다."
    ],
    btnText: "다음으로 →"
  },
  {
    tag: "Chapter II. 현실의 무게를 내려놓다",
    seal: "해방",
    headline: "신변을 정리하고 남은 예산, USD 100,000.",
    paragraphs: [
      "병원을 나서 집으로 돌아오는 길, 당신은 그동안 당신을 옥죄고 있던 일상의 의무와 타인의 기대들을 하나씩 내려놓기 시작했습니다.",
      "모든 신변을 정리하고 통장에 남은 사용 가능한 예산은 총 USD 100,000. 미래의 불안을 위해 악착같이 아껴두었던 그 숫자는, 이제 오직 당신의 남은 6개월을 위해서만 존재합니다."
    ],
    btnText: "다음으로 →"
  },
  {
    tag: "Chapter III. 진정한 나를 마주하는 질문",
    seal: "본심",
    headline: "이 6개월간, 당신이 진정으로 하고 싶은 것은 무엇일까요?",
    paragraphs: [
      "우리는 여전히 ‘한정된 예산’이라는 현실의 제약 속에 서 있습니다. 그러나 동시에, 진정으로 원하는 일에 온 마음을 다해 몰입할 때 피어나는 삶의 생명력은 당신의 시간을 기적처럼 연장시킬 수도 있습니다.",
      "방금 당신이 적어 내려간 10가지 소망 중, 지금 당신의 심장이 가장 먼저 가리키는 곳으로 첫 발을 내딛어 보세요."
    ],
    btnText: "나의 여정 시작하기 →"
  }
];

export const StoryBridgeStep: React.FC<StoryBridgeStepProps> = ({ colorTheme, onComplete }) => {
  const [slideIndex, setSlideIndex] = useState(0);

  const isHanji = colorTheme === 'hanji';
  const currentSlide = CHAPTER_SLIDES[slideIndex];

  const handleNext = () => {
    if (slideIndex < CHAPTER_SLIDES.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    }
  };

  return (
    <section
      className={`max-w-2xl mx-auto min-h-[460px] flex flex-col justify-between border rounded-2xl p-8 md:p-12 shadow-2xl transition-colors duration-300 animate-in fade-in ${
        isHanji
          ? 'bg-[#ffffff] border-[#ded7c5] shadow-[0_12px_40px_rgb(0,0,0,0.06)]'
          : 'bg-neutral-950 border-neutral-800'
      }`}
    >
      {/* Chapter Tag & Progress */}
      <div className="space-y-2.5">
        <div
          className={`flex justify-between items-center text-xs tracking-[0.3em] uppercase font-sans ${
            isHanji ? 'text-[#736a5c]' : 'text-neutral-400'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{currentSlide.tag}</span>
          </div>
          <span className="font-mono">{slideIndex + 1} / {CHAPTER_SLIDES.length}</span>
        </div>
        <div className={`w-16 h-0.5 ${isHanji ? 'bg-[#b83a2b]' : 'bg-white/70'}`} />
      </div>

      {/* Main Narrative Content */}
      <div className="my-auto py-8 space-y-5 font-serif-kr">
        <h2
          className={`text-2xl md:text-3xl font-bold leading-snug ${
            isHanji ? 'text-[#1c1a18]' : 'text-white'
          }`}
        >
          {currentSlide.headline}
        </h2>
        {currentSlide.paragraphs.map((p, idx) => (
          <p
            key={idx}
            className={`text-base md:text-lg font-light leading-relaxed ${
              isHanji ? 'text-[#38332d]' : 'text-neutral-300'
            }`}
          >
            {p}
          </p>
        ))}
      </div>

      {/* Footer controls */}
      <div
        className={`flex justify-between items-center pt-6 border-t ${
          isHanji ? 'border-[#ded7c5]' : 'border-neutral-900'
        }`}
      >
        <div className="flex gap-2">
          {CHAPTER_SLIDES.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === slideIndex
                  ? isHanji
                    ? 'w-8 bg-[#1c1a18]'
                    : 'w-8 bg-white'
                  : isHanji
                  ? 'w-2 bg-[#ded7c5]'
                  : 'w-2 bg-neutral-800'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {slideIndex > 0 && (
            <button
              onClick={handlePrev}
              className={`px-3.5 py-2.5 rounded-xl text-sm transition cursor-pointer ${
                isHanji
                  ? 'text-[#5a544a] hover:text-[#1c1a18]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleNext}
            className={`font-semibold px-7 py-3 rounded-xl text-sm transition flex items-center gap-2 shadow-lg cursor-pointer ${
              isHanji
                ? 'bg-[#1c1a18] hover:bg-[#332f2c] text-[#f7f4ea]'
                : 'bg-white hover:bg-neutral-200 text-black'
            }`}
          >
            <span>{currentSlide.btnText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
