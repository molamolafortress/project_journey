import React from 'react';
import { BucketItem, PlayerProfile, ColorTheme, Language } from '../types/game';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface SystemInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  bucketList: BucketItem[];
  profile?: PlayerProfile;
  colorTheme: ColorTheme;
  lang?: Language;
}

export const SystemInspectorModal: React.FC<SystemInspectorModalProps> = ({
  isOpen,
  onClose,
  bucketList,
  profile,
  colorTheme,
  lang = 'ko'
}) => {
  if (!isOpen) return null;

  const isHanji = colorTheme === 'hanji';
  const isEn = lang === 'en';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`max-w-3xl w-full max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${
          isHanji
            ? 'bg-[#fcfaf5] border-[#cfc6b2] text-[#1c1a18]'
            : 'bg-neutral-900 border-neutral-800 text-neutral-100'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-5 border-b ${
            isHanji ? 'border-[#ded7c5] bg-[#f5efe4]' : 'border-neutral-800 bg-neutral-950'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${isHanji ? 'bg-[#b83a2b]/10 text-[#b83a2b]' : 'bg-amber-400/10 text-amber-400'}`}>
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif-kr">
                {isEn
                  ? 'System AI Architecture & Cost Rationale Inspector'
                  : '시스템 AI 아키텍처 & 산정 근거 검증기 (Creator Inspector)'}
              </h2>
              <p className={`text-xs ${isHanji ? 'text-[#736a5c]' : 'text-neutral-400'}`}>
                {isEn
                  ? 'Gemini 4 Argon Deep Profiling · Gemini 3.1 Flash Lite Image Artwork · Gemini Flash Market Cost Inference'
                  : 'Gemini 4 Argon 심층 심리 프로파일링 · Gemini 3.1 Flash Lite Image 헌정 화폭 · Gemini Flash 실물 물가 추론'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition cursor-pointer ${
              isHanji ? 'hover:bg-[#e8e1d2] text-[#5c5446]' : 'hover:bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Active AI Models Overview & Argon Profile Result */}
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2.5 ${
              isHanji
                ? 'bg-[#ffffff] border-[#ded7c5] text-[#474138]'
                : 'bg-neutral-950/80 border-neutral-800 text-neutral-300'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-sm font-serif-kr">
                🧠 {isEn ? 'Deep Psychological Profiling' : '심층 심리 프로파일링'} (Model:{' '}
                <code className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 font-mono">
                  gemini-4-argon
                </code>
                )
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                {isEn ? 'Commemorative Artwork: gemini-3.1-flash-lite-image' : '헌정 아트워크: gemini-3.1-flash-lite-image'}
              </span>
            </div>
            {profile && profile.coreValue ? (
              <div className={`p-3 rounded-lg border space-y-1 ${isHanji ? 'bg-[#faf8f2] border-[#e5dec9]' : 'bg-neutral-900 border-neutral-800'}`}>
                <div className="font-semibold">
                  • {isEn ? 'Core Value' : '핵심 가치'}: "{profile.coreValue}"
                </div>
                <div>• {isEn ? 'Inner Summary' : '내면 요약'}: {profile.summary}</div>
                {profile.repressedDesires && (
                  <div className="opacity-85">
                    • {isEn ? 'Repressed Desires' : '억눌렸던 소망'}: {profile.repressedDesires}
                  </div>
                )}
              </div>
            ) : (
              <p className="opacity-75">
                {isEn
                  ? 'Once 10 bucket list wishes are entered, the gemini-4-argon model immediately infers the player’s Genuine Self.'
                  : '10가지 버킷리스트 입력이 완료되면 gemini-4-argon 모델이 즉시 플레이어의 진정한 자아(Genuine Self)를 심층 추론합니다.'}
              </p>
            )}
          </div>

          <div
            className={`p-3 rounded-xl border text-xs leading-relaxed ${
              isHanji
                ? 'bg-[#ffffff] border-[#ded7c5] text-[#474138]'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-300'
            }`}
          >
            <p className="font-semibold mb-1">
              💡 {isEn ? 'Real-World Market Pricing & Experiential Detour Principle' : '시스템 물가 책정 및 소망 실현 원칙'} (Model: <code>gemini-flash-latest</code>):
            </p>
            <p>
              {isEn
                ? 'Rather than arbitrary numbers, this engine reflects strict real-world market prices. For physically impossible or extreme wishes (such as nuclear missiles, omnipotence, or magical powers), instead of rejecting them or charging billions, the system reinterprets them into meaningful experiential detours (lucid dreaming clinics, desert rocket/silo tours, ice palace special effects) so the protagonist can confront the underlying psychological longing.'
                : '본 시스템은 일방적인 가공의 숫자가 아닌, 실제 세계 현실 물가를 철저하게 반영합니다. 핵미사일, 전지전능, 엘사 초능력과 같이 비현실적이거나 물리적으로 불가능한 소망은 단순 거절이나 수천억 청구 대신, 시한부 주인공이 현실에서 그 심리적 갈망과 본질을 마주할 수 있는 예술적·체험적 우회 프로젝트(자각몽 훈련, 사막 로켓/사일로 투어, 얼음 호텔 연출 등)로 재해석하여 실현합니다.'}
            </p>
          </div>

          {bucketList.length === 0 ? (
            <div className="text-center py-12 opacity-60 text-sm">
              {isEn ? 'No bucket list items entered yet.' : '아직 입력된 버킷리스트 항목이 없습니다.'}
            </div>
          ) : (
            bucketList.map((item, idx) => {
              const actualCost = item.actualCost ?? item.cost;
              const isImpossible = item.feasibility === 'impossible' || item.cost >= 10000000;
              const isHighCost = item.feasibility === 'high_cost' || (item.cost > 20000 && !isImpossible);

              return (
                <div
                  key={item.id || idx}
                  className={`p-4 rounded-xl border transition ${
                    isHanji
                      ? 'bg-white border-[#ded7c5] shadow-sm'
                      : 'bg-neutral-950 border-neutral-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded font-medium ${
                        isHanji ? 'bg-[#f4efe4] text-[#736a5c]' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        #{idx + 1}
                      </span>
                      <h3 className="font-bold text-sm font-serif-kr">"{item.text}"</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      {isImpossible ? (
                        <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700 border border-red-200">
                          <ShieldAlert className="w-3 h-3" />
                          <span>{isEn ? 'Impossible / Over Budget' : '실현 불가능 / 초과 자산'}</span>
                        </span>
                      ) : isHighCost ? (
                        <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{isEn ? 'Major Capital Wish' : '대규모 자본 소망'}</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{isEn ? 'Realistically Feasible' : '현실적 실현 가능'}</span>
                        </span>
                      )}

                      <span className={`text-xs font-mono font-bold ${
                        isImpossible ? 'text-red-600' : isHanji ? 'text-[#b83a2b]' : 'text-rose-400'
                      }`}>
                        ${actualCost.toLocaleString()}
                      </span>
                      <span className="text-xs text-neutral-500 font-mono">
                        ({item.daysSpent}{isEn ? 'd' : '일'} / +{item.lifespanDelta}{isEn ? 'm' : '개월'})
                      </span>
                    </div>
                  </div>

                  {/* Cost breakdown */}
                  {item.costBreakdown && (
                    <div className={`mt-2 p-2.5 rounded-lg text-xs font-sans ${
                      isHanji ? 'bg-[#faf8f2] text-[#474138]' : 'bg-neutral-900 text-neutral-300'
                    }`}>
                      <span className="font-semibold text-neutral-500 mr-1.5">
                        📊 {isEn ? 'Cost Breakdown:' : '세부 산정식:'}
                      </span>
                      {item.costBreakdown}
                    </div>
                  )}

                  {/* Rationale */}
                  {item.rationale && (
                    <div className={`mt-1.5 text-xs font-sans ${
                      isHanji ? 'text-[#6b6255]' : 'text-neutral-400'
                    }`}>
                      <span className="font-semibold mr-1.5">
                        🔍 {isEn ? 'System Rationale:' : '시스템 판단 근거:'}
                      </span>
                      {item.rationale}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex justify-end ${
            isHanji ? 'border-[#ded7c5] bg-[#f8f5ee]' : 'border-neutral-800 bg-neutral-950'
          }`}
        >
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
              isHanji
                ? 'bg-[#1c1a18] text-[#f7f4ea] hover:bg-[#332f2c]'
                : 'bg-white text-black hover:bg-neutral-200'
            }`}
          >
            {isEn ? 'Close' : '확인 및 닫기'}
          </button>
        </div>
      </div>
    </div>
  );
};
