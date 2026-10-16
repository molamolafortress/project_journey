import React, { useState, useEffect } from 'react';
import { BucketItem, PlayerProfile, ColorTheme, Language } from '../types/game';
import { Download, Sparkles, RefreshCw, Image as ImageIcon } from 'lucide-react';

interface JourneyArtworkProps {
  history: BucketItem[];
  profile: PlayerProfile;
  totalLifeGained: string;
  colorTheme: ColorTheme;
  lang?: Language;
  preloadedImageUrl?: string | null;
  preloadedIsLoading?: boolean;
  preloadedError?: string | null;
  onRetry?: () => void;
}

export const JourneyArtwork: React.FC<JourneyArtworkProps> = ({
  history,
  profile,
  totalLifeGained,
  colorTheme,
  lang = 'ko',
  preloadedImageUrl,
  preloadedIsLoading,
  preloadedError,
  onRetry
}) => {
  const [internalImageUrl, setInternalImageUrl] = useState<string | null>(null);
  const [internalLoading, setInternalLoading] = useState<boolean>(false);
  const [, setInternalError] = useState<string | null>(null);

  const isHanji = colorTheme === 'hanji';
  const isEn = lang === 'en';
  const isControlled = preloadedImageUrl !== undefined || preloadedIsLoading !== undefined;

  const imageUrl = isControlled ? preloadedImageUrl ?? null : internalImageUrl;
  const isLoading = isControlled ? Boolean(preloadedIsLoading) : internalLoading;
  void preloadedError;

  const fetchArtwork = async () => {
    if (onRetry && isControlled) {
      onRetry();
      return;
    }
    setInternalLoading(true);
    setInternalError(null);
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

      if (!res.ok) {
        throw new Error(isEn ? 'Failed to generate artwork.' : '아트워크 생성 중 오류가 발생했습니다.');
      }

      const data = await res.json();
      if (data && data.imageUrl) {
        setInternalImageUrl(data.imageUrl);
      } else {
        throw new Error(isEn ? 'Could not retrieve image data.' : '이미지 데이터를 가져올 수 없습니다.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('AI artwork generation failed:', msg);
      setInternalError(msg);
    } finally {
      setInternalLoading(false);
    }
  };

  useEffect(() => {
    if (!isControlled) {
      fetchArtwork();
    }
  }, [isControlled, profile.coreValue, history.length, colorTheme]);

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `my-true-self-journey-artwork.jpg`;
    a.click();
  };

  const defaultCoreValue = isEn
    ? 'A life lived at your own authentic rhythm'
    : '온전한 나만의 호흡으로 살아가는 삶';

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Artwork Display Box */}
      <div
        className={`relative rounded-2xl overflow-hidden border shadow-2xl transition-all duration-300 ${
          isHanji
            ? 'bg-[#ffffff] border-[#ded7c5] shadow-[0_12px_40px_rgb(0,0,0,0.06)]'
            : 'bg-neutral-950 border-neutral-800'
        }`}
      >
        {/* Top Tag */}
        <div
          className={`px-4 py-2.5 border-b flex items-center justify-between text-xs ${
            isHanji
              ? 'bg-[#fcfaf5] border-[#ded7c5] text-[#5c5446]'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400'
          }`}
        >
          <div className="flex items-center gap-1.5 font-medium">
            <Sparkles className={`w-3.5 h-3.5 ${isHanji ? 'text-[#b83a2b]' : 'text-amber-400'}`} />
            <span>
              {isEn
                ? 'Personalized Commemorative AI Artwork (gemini-3.1-flash-lite-image)'
                : '내면 프로파일 맞춤 헌정 아트워크 (Gemini AI Artwork)'}
            </span>
          </div>
          <span className="text-[11px] font-sans opacity-75">
            {isEn
              ? `${history.length} Wishes | +${totalLifeGained} Months Gained`
              : `${history.length}개의 소망 | +${totalLifeGained}개월의 생명력`}
          </span>
        </div>

        {/* Content Area */}
        <div className="aspect-video w-full relative flex items-center justify-center overflow-hidden">
          {isLoading && (
            <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center animate-pulse">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isHanji ? 'bg-[#b83a2b]/10 text-[#b83a2b]' : 'bg-amber-400/10 text-amber-400'
                }`}
              >
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <p className={`text-sm font-semibold font-serif-kr ${isHanji ? 'text-[#1c1a18]' : 'text-white'}`}>
                  {isEn
                    ? 'Painting a one-of-a-kind commemorative artwork tailored to your inner profile...'
                    : '당신의 내면 프로파일에 맞는 단 하나의 그림을 그리는 중입니다...'}
                </p>
                <p className={`text-xs ${isHanji ? 'text-[#736a5c]' : 'text-neutral-400'}`}>
                  {isEn
                    ? `Weaving your ${history.length} fulfilled wish(es) and "${profile.coreValue || defaultCoreValue}" into canvas.`
                    : `선택한 ${history.length}가지 소망과 "${profile.coreValue || '진정한 자아'}"의 결을 담아내는 중입니다.`}
                </p>
              </div>
            </div>
          )}

          {!isLoading && imageUrl && (
            <img
              src={imageUrl}
              alt={isEn ? 'Commemorative artwork of your genuine self' : '당신의 진정한 자아를 담은 헌정 아트워크'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-opacity duration-700 opacity-100"
            />
          )}

          {!isLoading && !imageUrl && (
            <div className="p-8 text-center space-y-3">
              <div
                className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
                  isHanji ? 'bg-[#b83a2b]/10 text-[#b83a2b]' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className={`text-sm font-serif-kr ${isHanji ? 'text-[#2c2925]' : 'text-neutral-300'}`}>
                "{profile.coreValue || defaultCoreValue}"
              </p>
              <button
                onClick={fetchArtwork}
                className="text-xs underline cursor-pointer opacity-75 hover:opacity-100"
              >
                {isEn ? 'Retry generating artwork' : '다시 생성 시도하기'}
              </button>
            </div>
          )}
        </div>

        {/* Bottom Core Value Caption */}
        <div
          className={`p-4 border-t text-center space-y-1 ${
            isHanji ? 'bg-[#fcfaf5] border-[#ded7c5]' : 'bg-neutral-900 border-neutral-800'
          }`}
        >
          <p className={`text-sm md:text-base font-bold font-serif-kr ${isHanji ? 'text-[#1c1a18]' : 'text-white'}`}>
            "{profile.coreValue || defaultCoreValue}"
          </p>
          <p className={`text-xs font-sans ${isHanji ? 'text-[#736a5c]' : 'text-neutral-400'}`}>
            {isEn
              ? 'The wishes you faced and chose within finite time have become a single radiant landscape.'
              : '당신이 유한한 시간 속에서 마주하고 선택한 소망들이 하나의 빛나는 풍경이 되었습니다.'}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div
        className={`flex justify-between items-center text-xs px-1 ${
          isHanji ? 'text-[#665e53]' : 'text-neutral-400'
        }`}
      >
        <span>
          {isEn
            ? 'This illustration was uniquely generated by Gemini AI (gemini-3.1-flash-lite-image) from your 10 wishes and psychological profile.'
            : '이 그림은 당신의 10가지 소망과 심리 프로파일을 해석하여 Gemini AI가 독자적으로 생성한 아트워크입니다.'}
        </span>
        {imageUrl && (
          <button
            onClick={handleDownload}
            className={`flex items-center gap-1.5 border px-3.5 py-1.5 rounded-lg transition text-xs cursor-pointer shadow-sm shrink-0 ${
              isHanji
                ? 'bg-[#ffffff] hover:bg-[#ede6d6] text-[#1c1a18] border-[#cfc6b2]'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-700'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isEn ? 'Save Artwork (JPG)' : '그림 소장하기 (JPG)'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
