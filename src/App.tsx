import { useState, useEffect, useCallback } from 'react';
import {
  BucketItem,
  PlayerProfile,
  GamePhase,
  SoundPreset,
  EndingSlide,
  ColorTheme,
  Language
} from './types/game';
import { REALISTIC_SEEDS, REALISTIC_SEEDS_EN, getRealisticSeeds } from './data/realisticDb';
import { compileEndingSlides, generateArgonProfile } from './game/engine';
import { soundEngine } from './services/soundEngine';
import { Volume2, VolumeX, Palette, FileSearch, Globe } from 'lucide-react';
import { BucketInputStep } from './components/BucketInputStep';
import { StoryBridgeStep } from './components/StoryBridgeStep';
import { InGameDashboard } from './components/InGameDashboard';
import { ChoiceStoryModal } from './components/ChoiceStoryModal';
import { FrostpunkEnding } from './components/FrostpunkEnding';
import { SystemInspectorModal } from './components/SystemInspectorModal';

export default function App() {
  const TARGET_COUNT = 10;
  const INITIAL_BUDGET = 100000;
  const INITIAL_MONTHS = 6.0;

  // Language: Korean ('ko') or English ('en')
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('lang') === 'en') return 'en';
    }
    return 'ko';
  });

  // Color Theme: Hanji (Default) or Black
  const [colorTheme, setColorTheme] = useState<ColorTheme>('hanji');
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Game state
  const [phase, setPhase] = useState<GamePhase>('input');
  const [bucketList, setBucketList] = useState<BucketItem[]>([]);
  const [budget, setBudget] = useState<number>(INITIAL_BUDGET);
  const [months, setMonths] = useState<number>(INITIAL_MONTHS);
  const [history, setHistory] = useState<BucketItem[]>([]);
  const [activeStoryItem, setActiveStoryItem] = useState<BucketItem | null>(null);

  // Background Profiling (Argon) & Ending slides
  const [profile, setProfile] = useState<PlayerProfile>({
    status: 'idle',
    coreValue: '',
    summary: ''
  });
  const [endingSlides, setEndingSlides] = useState<EndingSlide[]>([]);

  // Sound & Worker states
  const [soundPreset, setSoundPreset] = useState<SoundPreset>('frostcello');
  const [, setIsBgWorking] = useState<boolean>(false);
  const [, setBgLogMessage] = useState<string>(
    '[System] Gemini Flash 실시간 백그라운드 추론 준비 완료. 10개의 소망 입력을 시작합니다.'
  );

  // Sound preset synchronization
  const handleSoundPresetChange = (preset: SoundPreset) => {
    setSoundPreset(preset);
    soundEngine.setPreset(preset);
  };

  // First click audio resume
  useEffect(() => {
    const handleFirstClick = () => {
      soundEngine.setPreset(soundPreset);
      window.removeEventListener('click', handleFirstClick);
    };
    window.addEventListener('click', handleFirstClick);
    return () => window.removeEventListener('click', handleFirstClick);
  }, [soundPreset]);

  // Background worker helper: log updates
  const logWorker = useCallback((msg: string, working = false) => {
    setIsBgWorking(working);
    const time = new Date().toLocaleTimeString('ko-KR', { hour12: false });
    setBgLogMessage(`[${time}] ${msg}`);
  }, []);

  // Translate seed item helper when switching language mid-session
  const translateBucketItem = useCallback((item: BucketItem, targetLang: Language): BucketItem => {
    const koIdx = REALISTIC_SEEDS.findIndex((s) => s.text === item.text);
    const enIdx = REALISTIC_SEEDS_EN.findIndex((s) => s.text === item.text);
    const seedIdx = koIdx !== -1 ? koIdx : enIdx;
    if (seedIdx !== -1) {
      const targetSeed = targetLang === 'en' ? REALISTIC_SEEDS_EN[seedIdx] : REALISTIC_SEEDS[seedIdx];
      if (targetSeed) {
        return {
          ...item,
          text: targetSeed.text,
          category: targetSeed.category,
          costBreakdown: targetSeed.costBreakdown,
          rationale: targetSeed.rationale,
          story: targetSeed.story,
          chronicle: targetSeed.chronicle
        };
      }
    }
    return item;
  }, []);

  // Toggle Language between KO and EN seamlessly
  const handleToggleLang = useCallback(() => {
    const nextLang: Language = lang === 'ko' ? 'en' : 'ko';
    setLang(nextLang);

    setBucketList((prev) => {
      const nextList = prev.map((item) => translateBucketItem(item, nextLang));
      if (nextList.length > 0) {
        const nextProfile = generateArgonProfile(nextList, nextLang);
        setProfile((p) => ({
          ...p,
          coreValue: nextProfile.coreValue,
          summary: nextProfile.summary,
          repressedDesires: nextProfile.repressedDesires
        }));
      }
      return nextList;
    });

    setHistory((prev) => prev.map((item) => translateBucketItem(item, nextLang)));
    setActiveStoryItem((prev) => (prev ? translateBucketItem(prev, nextLang) : null));
  }, [lang, translateBucketItem]);

  // Background Worker: Gemini Flash inference via /api/gemini/analyze
  const analyzeBucketItemInBackground = useCallback(
    async (item: BucketItem, currentLang: Language) => {
      logWorker(`⚙️ [Gemini Flash] #${item.id} "${item.text.slice(0, 15)}..." analyzing...`, true);

      try {
        const res = await fetch('/api/gemini/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: item.text, id: item.id, lang: currentLang })
        });
        const data = await res.json();

        setBucketList((prev) =>
          prev.map((b) =>
            b.id === item.id
              ? {
                  ...b,
                  cost: data.cost ?? b.cost,
                  costBreakdown: data.costBreakdown ?? b.costBreakdown,
                  rationale: data.rationale ?? b.rationale,
                  feasibility: data.feasibility ?? b.feasibility,
                  daysSpent: data.daysSpent ?? b.daysSpent,
                  lifespanDelta: data.lifespanDelta ?? b.lifespanDelta,
                  story: data.story ?? b.story,
                  chronicle: data.chronicle ?? b.chronicle,
                  status: 'ready'
                }
              : b
          )
        );
        logWorker(`✅ [Gemini Flash] #${item.id} complete`, false);
      } catch {
        setBucketList((prev) =>
          prev.map((b) => (b.id === item.id ? { ...b, status: 'ready' } : b))
        );
        logWorker(`✅ [Gemini Flash] #${item.id} complete`, false);
      }
    },
    [logWorker]
  );

  // Background Worker: Argon Genuine Self Profiling via /api/gemini/profile
  const triggerArgonProfiling = useCallback(
    async (items: BucketItem[], currentLang: Language) => {
      const initialFallback = generateArgonProfile(items, currentLang);
      setProfile({
        ...initialFallback,
        status: 'analyzing'
      });
      logWorker('🧠 [Gemini 4 Argon] Profiling Genuine Self...', true);

      try {
        const res = await fetch('/api/gemini/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: items.map((i) => i.text), lang: currentLang })
        });
        const data = await res.json();
        setProfile({
          status: 'ready',
          coreValue: data.coreValue || initialFallback.coreValue,
          summary: data.summary || initialFallback.summary,
          repressedDesires: data.repressedDesires || initialFallback.repressedDesires
        });
        logWorker(`✅ [Gemini 4 Argon] Profiling complete: [${data.coreValue || initialFallback.coreValue}]`, false);
      } catch {
        setProfile({ ...initialFallback, status: 'ready' });
        logWorker('✅ [Gemini 4 Argon] Profiling complete', false);
      }
    },
    [logWorker]
  );

  // Add Item to Bucket List
  const handleAddItem = useCallback(
    (text: string) => {
      if (bucketList.length >= TARGET_COUNT) return;

      const nextId = bucketList.length + 1;
      const initialItem: BucketItem = {
        id: nextId,
        text,
        cost: 2500,
        daysSpent: 14,
        lifespanDelta: 1.2,
        story: '',
        chronicle: '',
        status: 'analyzing',
        selected: false
      };

      const updated = [...bucketList, initialItem];
      setBucketList(updated);

      // Trigger Gemini Flash background analysis
      analyzeBucketItemInBackground(initialItem, lang);

      // If 10 items reached, transition to narrative bridge
      if (updated.length === TARGET_COUNT) {
        triggerArgonProfiling(updated, lang);
        setPhase('story_bridge');
      }
    },
    [bucketList, lang, analyzeBucketItemInBackground, triggerArgonProfiling]
  );

  // Quick Auto-fill for testing
  const handleAutoFill = useCallback(() => {
    const seeds = getRealisticSeeds(lang);
    const existingTexts = bucketList.map((b) => b.text);
    const available = seeds.filter((s) => !existingTexts.includes(s.text));

    const toAdd = available.slice(0, TARGET_COUNT - bucketList.length);
    const updated = [...bucketList];

    toAdd.forEach((seed) => {
      const nextId = updated.length + 1;
      const item: BucketItem = {
        id: nextId,
        text: seed.text,
        category: seed.category,
        cost: seed.cost,
        costBreakdown: seed.costBreakdown,
        rationale: seed.rationale,
        feasibility: 'realistic',
        daysSpent: seed.daysSpent,
        lifespanDelta: seed.lifespanDelta,
        story: seed.story,
        chronicle: seed.chronicle,
        status: 'ready',
        selected: false
      };
      updated.push(item);
    });

    setBucketList(updated);

    if (updated.length >= TARGET_COUNT) {
      triggerArgonProfiling(updated, lang);
      setPhase('story_bridge');
    }
  }, [bucketList, lang, triggerArgonProfiling]);

  // Handle autostart query parameter for testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1' && bucketList.length === 0) {
        handleAutoFill();
      }
    }
  }, [handleAutoFill, bucketList.length]);

  // Transition from Story Bridge (2.5) to Gameplay (3)
  const handleCompleteStoryBridge = () => {
    setPhase('gameplay');
  };

  // Step 3: Handle item selection
  const handleSelectItem = (id: number) => {
    const item = bucketList.find((b) => b.id === id);
    if (!item || item.selected) return;

    const actualCost = Math.min(budget, item.cost);
    const newBudget = Math.max(0, budget - actualCost);
    const newMonths = Number((months + item.lifespanDelta).toFixed(1));

    const turnNumber = history.length + 1;
    const selectedRecord: BucketItem = {
      ...item,
      selected: true,
      turnNumber,
      actualCost
    };

    setBudget(newBudget);
    setMonths(newMonths);
    setHistory((prev) => [...prev, selectedRecord]);
    setBucketList((prev) => prev.map((b) => (b.id === id ? selectedRecord : b)));

    setActiveStoryItem(selectedRecord);
    setPhase('story_result');

    logWorker(`▶ Choice #${turnNumber}: "${item.text.slice(0, 15)}..." (-$${actualCost.toLocaleString()} / +${item.lifespanDelta}m)`, false);
  };

  // Step 3: Handle Other Option custom action via Gemini Flash
  const handleCustomAction = async (text: string) => {
    const nextId = bucketList.length + 1;
    logWorker(`⚙️ [Gemini Flash] Analyzing custom wish "${text}"...`, true);

    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, id: nextId, lang })
      });
      const data = await res.json();

      const cost = data.cost || 2500;
      const actualCost = Math.min(budget, cost);
      const newBudget = Math.max(0, budget - actualCost);
      const newMonths = Number((months + (data.lifespanDelta || 1.2)).toFixed(1));

      const turnNumber = history.length + 1;
      const selectedRecord: BucketItem = {
        id: nextId,
        text,
        cost,
        costBreakdown: data.costBreakdown,
        rationale: data.rationale,
        feasibility: data.feasibility,
        daysSpent: data.daysSpent || 14,
        lifespanDelta: data.lifespanDelta || 1.2,
        story: data.story || '',
        chronicle: data.chronicle || '',
        status: 'ready',
        selected: true,
        turnNumber,
        actualCost
      };

      setBudget(newBudget);
      setMonths(newMonths);
      setHistory((prev) => [...prev, selectedRecord]);
      setBucketList((prev) => [...prev, selectedRecord]);

      setActiveStoryItem(selectedRecord);
      setPhase('story_result');
      logWorker(`✅ [Gemini Flash] Custom wish analyzed`, false);
    } catch {
      // Fallback
    }
  };

  // Continue after viewing single choice story
  const handleContinueAfterStory = () => {
    const unchosen = bucketList.filter((b) => !b.selected);
    if (budget <= 0 || unchosen.length === 0) {
      triggerEndingSequence();
    } else {
      setActiveStoryItem(null);
      setPhase('gameplay');
    }
  };

  // Step 4: Compile slides & trigger Frostpunk Ending
  const triggerEndingSequence = () => {
    const finalSlides = compileEndingSlides(
      history,
      bucketList,
      profile,
      INITIAL_BUDGET,
      budget,
      INITIAL_MONTHS,
      months
    );
    setEndingSlides(finalSlides);
    setPhase('ending');
    logWorker('🌌 [Step 4] Frostpunk Cinematic Ending Chronicle started', false);
  };

  // Re-compile ending slides if language changes during ending
  useEffect(() => {
    if (phase === 'ending') {
      const updatedSlides = compileEndingSlides(
        history,
        bucketList,
        profile,
        INITIAL_BUDGET,
        budget,
        INITIAL_MONTHS,
        months
      );
      setEndingSlides(updatedSlides);
    }
  }, [lang, phase, history, bucketList, profile, budget, months]);

  // Restart game
  const handleRestart = () => {
    setPhase('input');
    setBucketList([]);
    setBudget(INITIAL_BUDGET);
    setMonths(INITIAL_MONTHS);
    setHistory([]);
    setActiveStoryItem(null);
    setEndingSlides([]);
    setProfile({ status: 'idle', coreValue: '', summary: '' });
  };

  const totalLifeGained = history
    .reduce((acc, cur) => acc + cur.lifespanDelta, 0)
    .toFixed(1);

  return (
    <div
      className={`min-h-screen flex flex-col justify-between p-4 md:p-8 transition-colors duration-300 ${
        colorTheme === 'hanji' ? 'theme-hanji' : 'theme-black'
      }`}
    >
      {/* Top Language & Quick Utility Bar */}
      <header className="w-full max-w-3xl mx-auto flex items-center justify-between pb-2">
        <div
          className={`text-xs font-serif-kr tracking-wider ${
            colorTheme === 'hanji' ? 'text-[#736a5c]' : 'text-neutral-400'
          }`}
        >
          {lang === 'en' ? 'True Self Odyssey — 6 Months Left' : '진정한 나를 찾아가는 여정 — 시한부 6개월'}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleLang}
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
              colorTheme === 'hanji'
                ? 'bg-[#ffffff] hover:bg-[#ede6d6] text-[#1c1a18] border-[#cfc6b2]'
                : 'bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-700'
            }`}
            title={lang === 'en' ? '한국어로 전환 (Switch to Korean)' : 'Switch to English (영어로 전환)'}
          >
            <Globe className={`w-3.5 h-3.5 ${colorTheme === 'hanji' ? 'text-[#b83a2b]' : 'text-amber-400'}`} />
            <span>{lang === 'en' ? '한국어 / EN' : 'EN / 한국어'}</span>
          </button>
        </div>
      </header>

      {/* Creator Inspector Modal */}
      <SystemInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        bucketList={bucketList}
        profile={profile}
        colorTheme={colorTheme}
        lang={lang}
      />

      {/* Main Game Stage */}
      <main className="w-full my-auto py-4">
        {phase === 'input' && (
          <BucketInputStep
            bucketList={bucketList}
            targetCount={TARGET_COUNT}
            colorTheme={colorTheme}
            lang={lang}
            onAddItem={handleAddItem}
            onAutoFill={handleAutoFill}
          />
        )}

        {phase === 'story_bridge' && (
          <StoryBridgeStep
            colorTheme={colorTheme}
            lang={lang}
            onComplete={handleCompleteStoryBridge}
          />
        )}

        {phase === 'gameplay' && (
          <InGameDashboard
            bucketList={bucketList}
            budget={budget}
            months={months}
            historyCount={history.length}
            colorTheme={colorTheme}
            lang={lang}
            onSelectItem={handleSelectItem}
            onCustomAction={handleCustomAction}
            onTriggerEnding={triggerEndingSequence}
          />
        )}

        {phase === 'story_result' && activeStoryItem && (
          <ChoiceStoryModal
            item={activeStoryItem}
            remainingBudget={budget}
            currentMonths={months}
            isGameOver={budget <= 0 || bucketList.filter((b) => !b.selected).length === 0}
            colorTheme={colorTheme}
            lang={lang}
            onContinue={handleContinueAfterStory}
          />
        )}

        {phase === 'ending' && (
          <FrostpunkEnding
            slides={endingSlides}
            history={history}
            profile={profile}
            totalLifeGained={totalLifeGained}
            colorTheme={colorTheme}
            lang={lang}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Subtle Bottom Bar with Discreet Utility Controls */}
      <footer
        className={`flex flex-col sm:flex-row items-center justify-between gap-3 text-xs mt-6 pt-3 border-t transition-colors ${
          colorTheme === 'hanji' ? 'text-[#877e70] border-[#ded7c5]' : 'text-neutral-500 border-neutral-900'
        }`}
      >
        <div className="font-serif-kr">
          {lang === 'en'
            ? 'True Self Odyssey (Powered by Gemini 4 Argon & Gemini 3.1 Flash)'
            : '진정한 나를 찾아가는 여행 (True Self Odyssey)'}
        </div>

        {/* Minimal Utilities */}
        <div className="flex items-center gap-1.5">
          {/* Language Toggle */}
          <button
            onClick={handleToggleLang}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1.5 cursor-pointer text-xs ${
              colorTheme === 'hanji'
                ? 'hover:bg-[#ebe3d0] text-[#5c5446]'
                : 'hover:bg-neutral-800 text-neutral-400'
            }`}
            title="Language / 언어 전환"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? '한국어' : 'English'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => handleSoundPresetChange(soundPreset === 'mute' ? 'frostcello' : 'mute')}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1.5 cursor-pointer text-xs ${
              colorTheme === 'hanji'
                ? 'hover:bg-[#ebe3d0] text-[#5c5446]'
                : 'hover:bg-neutral-800 text-neutral-400'
            }`}
            title={lang === 'en' ? 'Toggle BGM' : '배경음 전환'}
          >
            {soundPreset === 'mute' ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
            <span>
              {soundPreset === 'mute'
                ? lang === 'en' ? 'Muted' : '음소거'
                : lang === 'en' ? 'Sound' : '배경음'}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setColorTheme(colorTheme === 'hanji' ? 'black' : 'hanji')}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1.5 cursor-pointer text-xs ${
              colorTheme === 'hanji'
                ? 'hover:bg-[#ebe3d0] text-[#5c5446]'
                : 'hover:bg-neutral-800 text-neutral-400'
            }`}
            title={lang === 'en' ? 'Switch Theme' : '테마 전환'}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>
              {colorTheme === 'hanji'
                ? lang === 'en' ? 'Hanji' : '한지'
                : lang === 'en' ? 'Obsidian' : '칠흑'}
            </span>
          </button>

          {/* System Inspector for Creator */}
          <button
            onClick={() => setIsInspectorOpen(true)}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1.5 cursor-pointer text-xs ${
              colorTheme === 'hanji'
                ? 'hover:bg-[#ebe3d0] text-[#736a5c]'
                : 'hover:bg-neutral-800 text-neutral-400'
            }`}
            title={lang === 'en' ? 'AI Architecture & Cost Inspector' : '시스템 산정 근거 (운영진용)'}
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'AI Inspector' : '산정 근거'}</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
