import React from 'react';
import { SoundPreset, ColorTheme } from '../types/game';
import { soundEngine } from '../services/soundEngine';
import { Volume2, VolumeX, Palette, FileSearch } from 'lucide-react';

interface HeaderProps {
  soundPreset: SoundPreset;
  onSoundPresetChange: (preset: SoundPreset) => void;
  colorTheme: ColorTheme;
  onColorThemeChange: (theme: ColorTheme) => void;
  isBgWorking?: boolean;
  onOpenInspector?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundPreset,
  onSoundPresetChange,
  colorTheme,
  onColorThemeChange,
  isBgWorking = false,
  onOpenInspector
}) => {
  const isHanji = colorTheme === 'hanji';

  const handlePreview = () => {
    soundEngine.playTransitionHit(0);
  };

  const handleToggleMute = () => {
    if (soundPreset === 'mute') {
      onSoundPresetChange('frostcello');
    } else {
      onSoundPresetChange('mute');
    }
  };

  const toggleTheme = () => {
    onColorThemeChange(isHanji ? 'black' : 'hanji');
  };

  return (
    <header
      className={`max-w-4xl w-full mx-auto rounded-2xl p-4 mb-6 transition-colors duration-300 ${
        isHanji
          ? 'bg-[#fcfaf5] border border-[#ded7c5] text-[#2c2925] shadow-sm'
          : 'bg-neutral-950 border border-neutral-800 text-neutral-300'
      }`}
    >
      <div className="flex flex-wrap justify-between items-center gap-3">
        {/* Left: Atmospheric Title & Subtitle */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-serif-kr text-xs font-bold ${
              isHanji
                ? 'bg-[#b83a2b] text-white shadow-sm'
                : 'bg-neutral-800 text-amber-300 border border-neutral-700'
            }`}
            title="진정한 나를 찾아가는 여행"
          >
            나
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1
                className={`text-sm font-bold font-serif-kr tracking-tight ${
                  isHanji ? 'text-[#1c1a18]' : 'text-white'
                }`}
              >
                진정한 나를 찾아가는 여정
              </h1>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-serif-kr font-medium ${
                  isHanji
                    ? 'bg-[#f0ece1] text-[#736a5c] border border-[#ded7c5]'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                }`}
              >
                6개월의 시한부
              </span>
            </div>
            <p className={`text-[11px] ${isHanji ? 'text-[#7a7266]' : 'text-neutral-500'}`}>
              유한한 시간과 $100,000의 예산 속에서 마주하는 10개의 소망
            </p>
          </div>
        </div>

        {/* Right: Controls & Creator Inspector */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Creator Inspector Button */}
          {onOpenInspector && (
            <button
              onClick={onOpenInspector}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                isHanji
                  ? 'bg-[#f4efe4] border-[#cfc6b2] text-[#474138] hover:bg-[#eae3d4]'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
              }`}
              title="시스템 물가 산정 근거 및 AI 추론 검증"
            >
              <FileSearch className={`w-3.5 h-3.5 ${isHanji ? 'text-[#b83a2b]' : 'text-amber-400'}`} />
              <span>시스템 산정 근거</span>
              {isBgWorking && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
          )}

          {/* Hanji / Black Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
              isHanji
                ? 'bg-[#f4efe4] border-[#cfc6b2] text-[#1c1a18] hover:bg-[#eae3d4]'
                : 'bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800'
            }`}
            title="테마 전환"
          >
            <Palette className={`w-3.5 h-3.5 ${isHanji ? 'text-[#b83a2b]' : 'text-amber-400'}`} />
            <span>{isHanji ? '한지' : '흑야'}</span>
          </button>

          {/* Sound preset selector */}
          <div
            className={`flex items-center gap-1.5 border rounded-lg px-2.5 py-1 text-xs ${
              isHanji
                ? 'bg-[#f8f5ee] border-[#ded7c5] text-[#2c2925]'
                : 'bg-black border-neutral-800 text-white'
            }`}
          >
            <button
              onClick={handleToggleMute}
              className="transition cursor-pointer"
              title={soundPreset === 'mute' ? '음소거 해제' : '음소거'}
            >
              {soundPreset === 'mute' ? (
                <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
              ) : (
                <Volume2 className={`w-3.5 h-3.5 ${isHanji ? 'text-[#7a7266]' : 'text-neutral-300'}`} />
              )}
            </button>

            <select
              value={soundPreset}
              onChange={(e) => onSoundPresetChange(e.target.value as SoundPreset)}
              className={`text-xs font-medium focus:outline-none cursor-pointer bg-transparent ${
                isHanji ? 'text-[#1c1a18]' : 'text-white'
              }`}
            >
              <option value="frostcello" className={isHanji ? 'bg-white text-black' : 'bg-black text-white'}>
                Frostcello
              </option>
              <option value="warmpiano" className={isHanji ? 'bg-white text-black' : 'bg-black text-white'}>
                Piano
              </option>
              <option value="heartbeat" className={isHanji ? 'bg-white text-black' : 'bg-black text-white'}>
                Heartbeat
              </option>
              <option value="mute" className={isHanji ? 'bg-white text-black' : 'bg-black text-white'}>
                Mute
              </option>
            </select>

            {soundPreset !== 'mute' && (
              <button
                onClick={handlePreview}
                className={`px-1.5 py-0.5 rounded text-[10px] border transition cursor-pointer ml-1 ${
                  isHanji
                    ? 'bg-[#eee7d8] hover:bg-[#e4dcce] text-[#2c2925] border-[#d4cbba]'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border-neutral-700'
                }`}
              >
                청음
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
