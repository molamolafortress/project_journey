import React, { useState } from 'react';
import { BucketItem, ColorTheme } from '../types/game';
import { Sparkles, Send, ArrowRight, Heart, DollarSign } from 'lucide-react';

interface InGameDashboardProps {
  bucketList: BucketItem[];
  budget: number;
  months: number;
  historyCount: number;
  colorTheme: ColorTheme;
  onSelectItem: (id: number) => void;
  onCustomAction: (text: string) => void;
  onTriggerEnding: () => void;
}

export const InGameDashboard: React.FC<InGameDashboardProps> = ({
  bucketList,
  budget,
  months,
  historyCount,
  colorTheme,
  onSelectItem,
  onCustomAction,
  onTriggerEnding
}) => {
  const [customInput, setCustomInput] = useState('');
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);

  const isHanji = colorTheme === 'hanji';
  const unchosenItems = bucketList.filter((item) => !item.selected);

  const handleCustomSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = customInput.trim();
    if (!text || budget <= 0 || isSubmittingCustom) return;

    setIsSubmittingCustom(true);
    onCustomAction(text);
    setCustomInput('');
    setIsSubmittingCustom(false);
  };

  return (
    <section className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-500">
      {/* HUD: Lifespan & Budget */}
      <div
        className={`grid grid-cols-2 gap-4 border rounded-2xl p-6 shadow-xl transition-colors ${
          isHanji
            ? 'bg-[#ffffff] border-[#ded7c5] shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
            : 'bg-neutral-950 border-neutral-800'
        }`}
      >
        <div className="space-y-1">
          <div
            className={`text-xs font-sans flex items-center gap-1.5 uppercase tracking-wider ${
              isHanji ? 'text-[#736a5c]' : 'text-neutral-400'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isHanji ? 'text-[#b83a2b]' : 'text-rose-400'}`} />
            <span>남은 기대 수명</span>
          </div>
          <div
            className={`text-3xl md:text-4xl font-bold font-serif-kr flex items-baseline gap-1.5 ${
              isHanji ? 'text-[#b83a2b]' : 'text-white'
            }`}
          >
            <span>{months.toFixed(1)}</span>
            <span
              className={`text-sm font-normal font-sans ${
                isHanji ? 'text-[#736a5c]' : 'text-neutral-400'
              }`}
            >
              개월
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div
            className={`text-xs font-sans flex items-center gap-1.5 uppercase tracking-wider ${
              isHanji ? 'text-[#736a5c]' : 'text-neutral-400'
            }`}
          >
            <DollarSign className={`w-3.5 h-3.5 ${isHanji ? 'text-[#3b5a4a]' : 'text-emerald-400'}`} />
            <span>사용 가능 예산</span>
          </div>
          <div
            className={`text-3xl md:text-4xl font-bold font-serif-kr flex items-baseline gap-1 ${
              isHanji ? 'text-[#1c1a18]' : 'text-white'
            }`}
          >
            <span className={`text-2xl font-normal ${isHanji ? 'text-[#8c8273]' : 'text-neutral-400'}`}>$</span>
            <span>{budget.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Choice Prompt */}
      <div
        className={`border rounded-2xl p-6 space-y-4 shadow-xl transition-colors ${
          isHanji
            ? 'bg-[#ffffff] border-[#ded7c5] shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
            : 'bg-neutral-950 border-neutral-800'
        }`}
      >
        <div className="space-y-1.5">
          <div
            className={`text-xs font-semibold tracking-wider uppercase ${
              isHanji ? 'text-[#736a5c]' : 'text-neutral-400'
            }`}
          >
            당신의 버킷리스트 (선택 전에는 비용과 수명을 알 수 없습니다)
          </div>
          <p
            className={`text-sm font-serif-kr leading-relaxed ${
              isHanji ? 'text-[#38332d]' : 'text-neutral-300'
            }`}
          >
            {historyCount === 0
              ? '6개월의 시한부 판정 앞에서, 당신의 심장이 가장 먼저 향하는 소망은 무엇입니까?'
              : `지금까지 ${historyCount}개의 소망을 마주했습니다. 남은 예산과 시간 속에서 다음으로 무엇을 하시겠습니까?`}
          </p>
        </div>

        {/* Choice List */}
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {unchosenItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectItem(item.id)}
              className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between group cursor-pointer shadow-sm ${
                isHanji
                  ? 'bg-[#faf8f2] hover:bg-[#f2ece0] border-[#ded7c5] hover:border-[#1c1a18]'
                  : 'bg-black hover:bg-neutral-900 border-neutral-800 hover:border-neutral-500'
              }`}
            >
              <div className="flex items-center gap-2.5 pr-3">
                <span
                  className={`font-mono text-xs ${
                    isHanji ? 'text-[#8c8273]' : 'text-neutral-500'
                  }`}
                >
                  {item.id}.
                </span>
                <span
                  className={`text-sm font-medium leading-snug ${
                    isHanji ? 'text-[#1c1a18]' : 'text-neutral-200 group-hover:text-white'
                  }`}
                >
                  {item.text}
                </span>
              </div>
              <span
                className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border transition flex items-center gap-1 ${
                  isHanji
                    ? 'bg-[#1c1a18] text-[#f7f4ea] border-[#1c1a18] group-hover:bg-[#b83a2b] group-hover:border-[#b83a2b]'
                    : 'bg-neutral-900 group-hover:bg-white text-neutral-300 group-hover:text-black border-neutral-700 group-hover:border-white'
                }`}
              >
                <span>선택</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>

        {/* Other Option: Free-form custom action */}
        <div
          className={`pt-4 border-t space-y-2 ${
            isHanji ? 'border-[#ded7c5]' : 'border-neutral-900'
          }`}
        >
          <div
            className={`text-xs flex items-center gap-1.5 ${
              isHanji ? 'text-[#5a544a]' : 'text-neutral-400'
            }`}
          >
            <Sparkles className={`w-3 h-3 ${isHanji ? 'text-[#b83a2b]' : 'text-amber-300'}`} />
            <span>Other Option: 목록 외에 지금 당장 하고 싶은 다른 행동 직접 적기</span>
          </div>
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="예: 바닷가 작은 오두막에서 보름간 혼자 머물기..."
              className={`flex-1 border rounded-xl px-4 py-2.5 text-sm transition focus:outline-none ${
                isHanji
                  ? 'bg-[#faf8f2] border-[#cfc6b2] text-[#1c1a18] placeholder:text-[#999081] focus:border-[#1c1a18]'
                  : 'bg-black border-neutral-800 text-white placeholder:text-neutral-600 focus:border-neutral-500'
              }`}
            />
            <button
              type="submit"
              disabled={!customInput.trim() || budget <= 0 || isSubmittingCustom}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold border transition shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-40 ${
                isHanji
                  ? 'bg-[#1c1a18] hover:bg-[#332f2c] text-[#f7f4ea] border-[#1c1a18]'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-700 hover:border-neutral-500'
              }`}
            >
              <span>직접 실행</span>
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      </div>

      {/* Early Conclusion Option */}
      {historyCount > 0 && (
        <div className="text-center pt-2">
          <button
            onClick={onTriggerEnding}
            className={`text-xs underline transition cursor-pointer ${
              isHanji
                ? 'text-[#665e53] hover:text-[#1c1a18]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            남은 예산($ {budget.toLocaleString()})을 간직한 채 여기서 여정 마무리하기 (엔딩 보기) →
          </button>
        </div>
      )}
    </section>
  );
};
