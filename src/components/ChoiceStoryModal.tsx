import React, { useState } from 'react';
import { BucketItem, ColorTheme } from '../types/game';
import { ArrowRight, ArrowLeft, Sparkles, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface ChoiceStoryModalProps {
  item: BucketItem;
  remainingBudget: number;
  currentMonths: number;
  isGameOver: boolean;
  colorTheme: ColorTheme;
  onContinue: () => void;
}

export const ChoiceStoryModal: React.FC<ChoiceStoryModalProps> = ({
  item,
  remainingBudget,
  currentMonths,
  isGameOver,
  colorTheme,
  onContinue
}) => {
  const [currentPage, setCurrentPage] = useState<'story' | 'result'>('story');
  const [showBreakdown, setShowBreakdown] = useState(false);

  const isHanji = colorTheme === 'hanji';
  const actualCost = item.actualCost ?? item.cost;
  const paragraphs = (item.story || '').split('\n\n').filter(Boolean);

  return (
    <section
      className={`max-w-2xl mx-auto border rounded-2xl p-7 md:p-10 space-y-6 shadow-2xl transition-colors duration-300 animate-in fade-in ${
        isHanji
          ? 'bg-[#ffffff] border-[#ded7c5] shadow-[0_12px_40px_rgb(0,0,0,0.06)]'
          : 'bg-black border-neutral-800'
      }`}
    >
      {/* Page indicator */}
      <div className="flex items-center justify-between border-b pb-3 text-xs">
        <div
          className={`flex items-center gap-2 font-mono tracking-widest uppercase ${
            isHanji ? 'text-[#736a5c]' : 'text-neutral-400'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${isHanji ? 'text-[#b83a2b]' : 'text-amber-300'}`} />
          <span>Memory #{item.turnNumber || 1}</span>
        </div>

        <div className="flex items-center gap-1.5 font-medium">
          <span
            className={`px-2 py-0.5 rounded text-[11px] ${
              currentPage === 'story'
                ? isHanji
                  ? 'bg-[#1c1a18] text-white'
                  : 'bg-white text-black'
                : isHanji
                ? 'bg-[#f0ece1] text-[#736a5c]'
                : 'bg-neutral-800 text-neutral-400'
            }`}
          >
            1. 이야기
          </span>
          <span className="text-neutral-400">/</span>
          <span
            className={`px-2 py-0.5 rounded text-[11px] ${
              currentPage === 'result'
                ? isHanji
                  ? 'bg-[#1c1a18] text-white'
                  : 'bg-white text-black'
                : isHanji
                ? 'bg-[#f0ece1] text-[#736a5c]'
                : 'bg-neutral-800 text-neutral-400'
            }`}
          >
            2. 결과와 소요
          </span>
        </div>
      </div>

      {/* Main Title */}
      <div className="space-y-1">
        <h2
          className={`text-xl md:text-2xl font-bold font-serif-kr leading-snug ${
            isHanji ? 'text-[#1c1a18]' : 'text-white'
          }`}
        >
          "{item.text}"
        </h2>
      </div>

      {/* PAGE 1: Pure Story Narrative */}
      {currentPage === 'story' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div
            className={`leading-relaxed text-base md:text-lg font-light font-serif-kr space-y-4 py-4 ${
              isHanji ? 'text-[#2b2723]' : 'text-neutral-200'
            }`}
          >
            {paragraphs.length > 0 ? (
              paragraphs.map((p, idx) => <p key={idx}>{p}</p>)
            ) : (
              <p className="italic text-sm opacity-70">
                선택한 소망을 이루기 위해 온 마음을 쏟아 소중한 시간과 일상을 채워나갔습니다.
              </p>
            )}
          </div>

          <div className="flex justify-end pt-3 border-t border-dashed border-neutral-300 dark:border-neutral-800">
            <button
              onClick={() => setCurrentPage('result')}
              className={`font-semibold px-7 py-3 rounded-xl text-sm transition flex items-center gap-2 cursor-pointer shadow-md ${
                isHanji
                  ? 'bg-[#1c1a18] hover:bg-[#332f2c] text-[#f7f4ea]'
                  : 'bg-white hover:bg-neutral-200 text-black'
              }`}
            >
              <span>다음 (소요 및 결과 확인)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* PAGE 2: Clean Explanation without the square badges */}
      {currentPage === 'result' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Subtle category or context tag */}
          <div className="flex items-center gap-2">
            <BookOpen className={`w-4 h-4 ${isHanji ? 'text-[#b83a2b]' : 'text-amber-400'}`} />
            <span className={`text-xs font-semibold ${isHanji ? 'text-[#736a5c]' : 'text-neutral-400'}`}>
              선택의 결과와 내면의 변화
            </span>
          </div>

          {/* Clean Description Only (네모박스 빼고 아래 설명만 배치) */}
          <div
            className={`text-sm md:text-base leading-relaxed font-sans space-y-2 py-4 border-y ${
              isHanji ? 'text-[#2e2a25] border-[#ded7c5]' : 'text-neutral-200 border-neutral-800'
            }`}
          >
            <p className={`font-medium ${isHanji ? 'text-[#1c1a18]' : 'text-white'}`}>
              ▶ [{item.text}] {item.daysSpent}일을 진행하면서 비용 ${actualCost.toLocaleString()}를 사용했으며, 수명이 {item.lifespanDelta}개월 증가했습니다.
            </p>
            <p className={`text-xs md:text-sm font-sans pt-1 ${isHanji ? 'text-[#736a5c]' : 'text-neutral-400'}`}>
              (남은 예산: ${remainingBudget.toLocaleString()} / 현재 기대 수명: {currentMonths.toFixed(1)}개월)
            </p>
          </div>

          {/* Optional System Pricing Breakdown Accordion (제작자/사용자 궁금증 해소) */}
          {(item.costBreakdown || item.rationale) && (
            <div
              className={`rounded-xl border transition ${
                isHanji
                  ? 'bg-[#faf8f2] border-[#ded7c5]'
                  : 'bg-neutral-950 border-neutral-800'
              }`}
            >
              <button
                type="button"
                onClick={() => setShowBreakdown(!showBreakdown)}
                className={`w-full flex items-center justify-between p-3.5 text-xs font-medium cursor-pointer transition ${
                  isHanji ? 'text-[#5c5446] hover:text-[#1c1a18]' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>💡 왜 이 비용과 기간이 소요되었을까요? (시스템 산정 근거)</span>
                {showBreakdown ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showBreakdown && (
                <div
                  className={`p-3.5 pt-0 text-xs space-y-2 border-t ${
                    isHanji ? 'border-[#ded7c5]/60 text-[#474138]' : 'border-neutral-800 text-neutral-300'
                  }`}
                >
                  {item.costBreakdown && (
                    <div>
                      <span className="font-semibold text-neutral-500 mr-1.5">세부 내역:</span>
                      <span>{item.costBreakdown}</span>
                    </div>
                  )}
                  {item.rationale && (
                    <div className="text-[11px] opacity-80">
                      <span className="font-semibold text-neutral-500 mr-1.5">현실적 판단 근거:</span>
                      <span>{item.rationale}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-dashed border-neutral-300 dark:border-neutral-800">
            <button
              onClick={() => setCurrentPage('story')}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                isHanji
                  ? 'text-[#736a5c] hover:text-[#1c1a18] hover:bg-[#f0ece1]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>이야기 다시 읽기</span>
            </button>

            <button
              onClick={onContinue}
              className={`font-semibold px-7 py-3 rounded-xl text-sm transition flex items-center gap-2 cursor-pointer shadow-lg ${
                isGameOver
                  ? isHanji
                    ? 'bg-[#b83a2b] hover:bg-[#912c20] text-white'
                    : 'bg-amber-400 hover:bg-amber-300 text-black'
                  : isHanji
                  ? 'bg-[#1c1a18] hover:bg-[#332f2c] text-[#f7f4ea]'
                  : 'bg-white hover:bg-neutral-200 text-black'
              }`}
            >
              <span>
                {isGameOver
                  ? '모든 예산을 사용했습니다. 마지막 회고록 마주하기 →'
                  : `남은 예산 $${remainingBudget.toLocaleString()}로 다음 선택 마주하기 →`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
