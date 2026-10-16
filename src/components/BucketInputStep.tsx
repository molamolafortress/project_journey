import React, { useState } from 'react';
import { BucketItem, RefinementSuggestion, ColorTheme, Language } from '../types/game';
import { getRealisticSeeds } from '../data/realisticDb';
import { Sparkles, ArrowRight } from 'lucide-react';

interface BucketInputStepProps {
  bucketList: BucketItem[];
  targetCount: number;
  colorTheme: ColorTheme;
  lang: Language;
  onAddItem: (text: string) => void;
  onAutoFill: () => void;
}

export const BucketInputStep: React.FC<BucketInputStepProps> = ({
  bucketList,
  targetCount,
  colorTheme,
  lang,
  onAddItem,
  onAutoFill
}) => {
  const [inputText, setInputText] = useState('');
  const [refinement, setRefinement] = useState<RefinementSuggestion | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [exampleOffset, setExampleOffset] = useState(0);

  const isHanji = colorTheme === 'hanji';
  const isEn = lang === 'en';
  const currentCount = bucketList.length < targetCount ? bucketList.length + 1 : targetCount;

  // Available examples excluding already added
  const alreadyTexts = bucketList.map((b) => b.text);
  const availableSeeds = getRealisticSeeds(lang).filter((s) => !alreadyTexts.includes(s.text));
  const currentExamples = availableSeeds.slice(exampleOffset, exampleOffset + 5);

  const handleShuffleExamples = () => {
    const nextOffset = (exampleOffset + 5) >= availableSeeds.length ? 0 : exampleOffset + 5;
    setExampleOffset(nextOffset);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const raw = inputText.trim();
    if (!raw) return;

    const lower = raw.toLowerCase();
    const needsRefine = isEn
      ? (raw.split(/\s+/).length <= 1 && raw.length <= 10) ||
        ['travel', 'trip', 'exercise', 'study', 'music', 'book', 'happiness', 'rest', 'money', 'love', 'art', 'cooking'].includes(lower)
      : raw.length <= 4 || ['여행', '운동', '공부', '음악', '책', '행복', '휴식', '돈'].includes(raw);

    if (needsRefine) {
      setIsRefining(true);
      try {
        const res = await fetch('/api/gemini/refine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: raw, lang })
        });
        const data = await res.json();
        if (data && data.options && data.options.length > 0) {
          setRefinement(data);
          setIsRefining(false);
          return;
        }
      } catch {
        // Fallback
      }
      setIsRefining(false);
    }

    onAddItem(raw);
    setInputText('');
    setRefinement(null);
  };

  const handleSelectRefined = (refinedText: string) => {
    onAddItem(refinedText);
    setInputText('');
    setRefinement(null);
  };

  const handleChipClick = (text: string) => {
    setInputText(text);
  };

  return (
    <section className="space-y-6 max-w-2xl mx-auto">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span
            className={`text-xs font-semibold tracking-[0.25em] uppercase font-sans ${
              isHanji ? 'text-[#877e70]' : 'text-neutral-400'
            }`}
          >
            Step 1. Bucket List ({currentCount} / {targetCount})
          </span>
        </div>

        <h1
          className={`text-2xl md:text-3xl font-bold font-serif-kr ${
            isHanji ? 'text-[#1c1a18]' : 'text-white'
          }`}
        >
          {isEn
            ? 'What are the 10 things you truly wish to do in life?'
            : '당신이 진정으로 원하는 10가지는 무엇인가요?'}
        </h1>
        <p className={`text-sm ${isHanji ? 'text-[#5a544a]' : 'text-neutral-400'}`}>
          {isEn
            ? 'Write down the wishes you have quietly set aside in a corner of your heart amidst a busy life.'
            : '바쁜 일상에 치여 마음 한구석에 미뤄두었던 소망들을 하나씩 적어보세요.'}
        </p>
      </div>

      {/* Input Form */}
      <div
        className={`border rounded-xl p-6 space-y-4 shadow-xl transition-colors ${
          isHanji
            ? 'bg-[#ffffff] border-[#ded7c5] shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
            : 'bg-neutral-950 border-neutral-800'
        }`}
      >
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            id="bucket-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isEn
                ? 'Type a wish (Gemini will suggest vivid ideas if you enter a single word)'
                : '하고 싶은 것을 적어주세요 (단순 단어 입력 시 Gemini가 구체화를 제안합니다)'
            }
            className={`flex-1 border rounded-lg px-4 py-3 transition text-sm md:text-base focus:outline-none ${
              isHanji
                ? 'bg-[#faf8f2] border-[#cfc6b2] text-[#1c1a18] placeholder:text-[#999081] focus:border-[#1c1a18]'
                : 'bg-black border-neutral-700 text-white placeholder:text-neutral-600 focus:border-white'
            }`}
          />
          <button
            type="submit"
            disabled={isRefining}
            className={`font-semibold px-6 py-3 rounded-lg transition shrink-0 flex items-center gap-1.5 cursor-pointer text-sm ${
              isHanji
                ? 'bg-[#1c1a18] hover:bg-[#332f2c] text-[#f7f4ea]'
                : 'bg-white hover:bg-neutral-200 text-black'
            }`}
          >
            <span>
              {isRefining
                ? isEn ? 'Thinking...' : '분석중...'
                : isEn ? 'Add' : '다음'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1.1 Refinement Proposal Box */}
        {refinement && (
          <div
            className={`border rounded-lg p-4 space-y-3 animate-in fade-in duration-300 ${
              isHanji
                ? 'bg-[#f8f5ee] border-[#dcd4c3]'
                : 'bg-neutral-900 border-neutral-700'
            }`}
          >
            <div
              className={`flex items-center gap-2 font-medium text-sm ${
                isHanji ? 'text-[#1c1a18]' : 'text-white'
              }`}
            >
              <Sparkles className={`w-4 h-4 shrink-0 ${isHanji ? 'text-[#b83a2b]' : 'text-amber-300'}`} />
              <span>{refinement.question}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {refinement.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectRefined(opt)}
                  className={`text-left text-xs border px-3 py-1.5 rounded transition cursor-pointer ${
                    isHanji
                      ? 'bg-white hover:bg-[#1c1a18] text-[#2c2925] hover:text-white border-[#cfc6b2]'
                      : 'bg-black hover:bg-white text-neutral-200 hover:text-black border-neutral-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 1.2 Diverse Inspiration Seeds (Pill Chips) */}
      <div className="space-y-2">
        <div
          className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs px-1 ${
            isHanji ? 'text-[#665e53]' : 'text-neutral-400'
          }`}
        >
          <span>
            {isEn
              ? '💡 Inspiration from others’ bucket lists (Click to fill the input box)'
              : '💡 다른 사람들의 버킷리스트 예시 (클릭 시 입력창에 채워집니다)'}
          </span>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleShuffleExamples}
              className={`underline transition cursor-pointer ${
                isHanji ? 'hover:text-[#1c1a18]' : 'hover:text-white'
              }`}
            >
              {isEn ? 'More examples' : '다른 예시 보기'}
            </button>
            <button
              onClick={onAutoFill}
              className={`font-semibold underline transition cursor-pointer ${
                isHanji ? 'text-[#b83a2b] hover:text-[#912c20]' : 'text-white hover:text-neutral-300'
              }`}
            >
              {isEn ? '[⚡ Quick Demo: Auto-fill Remaining]' : '[⚡ 테스트용: 남은 칸 한번에 채우기]'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentExamples.map((seed, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(seed.text)}
              className={`text-xs border rounded-full px-3.5 py-1.5 transition text-left cursor-pointer ${
                isHanji
                  ? 'bg-[#ffffff] hover:bg-[#ede6d6] text-[#2c2925] border-[#ded7c5]'
                  : 'bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-white border-neutral-800'
              }`}
            >
              + {seed.text}
            </button>
          ))}
        </div>
      </div>

      {/* Completed Bucket List (Blind: Cost and Lifespan strictly hidden!) */}
      {bucketList.length > 0 && (
        <div
          className={`space-y-2 pt-4 border-t ${
            isHanji ? 'border-[#ded7c5]' : 'border-neutral-900'
          }`}
        >
          <div
            className={`text-xs font-semibold uppercase tracking-wider ${
              isHanji ? 'text-[#736a5c]' : 'text-neutral-400'
            }`}
          >
            {isEn
              ? `Recorded Wishes (${bucketList.length} / ${targetCount})`
              : `작성 완료된 소망 목록 (${bucketList.length} / ${targetCount})`}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {bucketList.map((item) => (
              <div
                key={item.id}
                className={`flex justify-between items-center border rounded-lg px-3.5 py-2 text-xs ${
                  isHanji
                    ? 'bg-[#ffffff] border-[#ded7c5] text-[#2c2925]'
                    : 'bg-neutral-950/80 border-neutral-800 text-neutral-200'
                }`}
              >
                <span className="truncate pr-2">
                  {item.id}. {item.text}
                </span>
                <span
                  className={`shrink-0 text-[11px] font-sans ${
                    item.status === 'ready'
                      ? isHanji
                        ? 'text-[#3b5a4a] font-medium'
                        : 'text-emerald-400'
                      : 'text-amber-500 animate-pulse'
                  }`}
                >
                  {item.status === 'ready'
                    ? isEn ? '● Ready' : '● 준비됨'
                    : isEn ? '○ Analyzing' : '○ 분석중'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
