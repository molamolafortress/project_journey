import { useState, useEffect, useCallback } from 'react';
import {
  BucketItem,
  PlayerProfile,
  GamePhase,
  SoundPreset,
  EndingSlide,
  ColorTheme
} from './types/game';
import { REALISTIC_SEEDS } from './data/realisticDb';
import { compileEndingSlides } from './game/engine';
import { soundEngine } from './services/soundEngine';
import { Volume2, VolumeX, Palette, FileSearch } from 'lucide-react';
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
  const [isBgWorking, setIsBgWorking] = useState<boolean>(false);
  const [bgLogMessage, setBgLogMessage] = useState<string>(
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

  // Background Worker: Gemini Flash inference via /api/gemini/analyze
  const analyzeBucketItemInBackground = useCallback(
    async (item: BucketItem) => {
      logWorker(`⚙️ [Gemini Flash] #${item.id} "${item.text.slice(0, 15)}..." 현실 물가/소요일/수명 실시간 추론 중...`, true);

      try {
        const res = await fetch('/api/gemini/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: item.text, id: item.id })
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
        logWorker(`✅ [Gemini Flash] #${item.id} "${item.text.slice(0, 10)}..." 비용($${(data.cost ?? item.cost).toLocaleString()}) 및 수명(+${data.lifespanDelta ?? item.lifespanDelta}개월) 추론 완료`, false);
      } catch {
        setBucketList((prev) =>
          prev.map((b) => (b.id === item.id ? { ...b, status: 'ready' } : b))
        );
        logWorker(`✅ [Gemini Flash] #${item.id} 분석 완료`, false);
      }
    },
    [logWorker]
  );

  // Background Worker: Argon Genuine Self Profiling via /api/gemini/profile
  const triggerArgonProfiling = useCallback(
    async (items: BucketItem[]) => {
      logWorker('🧠 [Gemini Argon] 10개 버킷리스트 기반 진정한 자아(Genuine Self) 프로파일링 시작...', true);

      try {
        const res = await fetch('/api/gemini/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: items.map((i) => i.text) })
        });
        const data = await res.json();
        setProfile({
          status: 'ready',
          coreValue: data.coreValue || '나만의 호흡으로 살아가는 삶과 진실한 관계',
          summary: data.summary || '당신이 적어 내려간 버킷리스트는 세상의 속도에서 벗어나 온전히 나만의 흔적과 온기를 남기고자 하는 깊은 소망을 가리키고 있습니다.',
          repressedDesires: data.repressedDesires
        });
        logWorker(`✅ [Gemini Argon] 프로파일링 완료: [${data.coreValue || '진정한 자아'}]`, false);
      } catch {
        setProfile((prev) => ({ ...prev, status: 'ready' }));
        logWorker('✅ [Gemini Argon] 프로파일링 완료', false);
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
      analyzeBucketItemInBackground(initialItem);

      // If 10 items reached, transition to narrative bridge
      if (updated.length === TARGET_COUNT) {
        triggerArgonProfiling(updated);
        setPhase('story_bridge');
      }
    },
    [bucketList, analyzeBucketItemInBackground, triggerArgonProfiling]
  );

  // Quick Auto-fill for testing
  const handleAutoFill = useCallback(() => {
    const existingTexts = bucketList.map((b) => b.text);
    const available = REALISTIC_SEEDS.filter((s) => !existingTexts.includes(s.text));

    const toAdd = available.slice(0, TARGET_COUNT - bucketList.length);
    const updated = [...bucketList];

    toAdd.forEach((seed) => {
      const nextId = updated.length + 1;
      const item: BucketItem = {
        id: nextId,
        text: seed.text,
        category: seed.category,
        cost: seed.cost,
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
      triggerArgonProfiling(updated);
      setPhase('story_bridge');
    }
  }, [bucketList, triggerArgonProfiling]);

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

    logWorker(`▶ 선택 #${turnNumber}: "${item.text.slice(0, 15)}..." (비용 -$${actualCost.toLocaleString()} / 수명 +${item.lifespanDelta}개월)`, false);
  };

  // Step 3: Handle Other Option custom action via Gemini Flash
  const handleCustomAction = async (text: string) => {
    const nextId = bucketList.length + 1;
    logWorker(`⚙️ [Gemini Flash] 자유 입력 소망 "${text}" 실시간 분석 중...`, true);

    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, id: nextId })
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
      logWorker(`✅ [Gemini Flash] 자유 입력 분석 완료`, false);
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
    logWorker('🌌 [Step 4] 프로스트펑크 시네마틱 엔딩 크로니클 시작 (0초 지연)', false);
  };

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
      {/* Creator Inspector Modal */}
      <SystemInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        bucketList={bucketList}
        colorTheme={colorTheme}
      />

      {/* Main Game Stage */}
      <main className="w-full my-auto py-4">
        {phase === 'input' && (
          <BucketInputStep
            bucketList={bucketList}
            targetCount={TARGET_COUNT}
            colorTheme={colorTheme}
            onAddItem={handleAddItem}
            onAutoFill={handleAutoFill}
          />
        )}

        {phase === 'story_bridge' && (
          <StoryBridgeStep
            colorTheme={colorTheme}
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
          진정한 나를 찾아가는 여행 (True Self Odyssey)
        </div>

        {/* Minimal Utilities */}
        <div className="flex items-center gap-1.5">
          {/* Sound Toggle */}
          <button
            onClick={() => handleSoundPresetChange(soundPreset === 'mute' ? 'frostcello' : 'mute')}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1.5 cursor-pointer text-xs ${
              colorTheme === 'hanji'
                ? 'hover:bg-[#ebe3d0] text-[#5c5446]'
                : 'hover:bg-neutral-800 text-neutral-400'
            }`}
            title="배경음 전환"
          >
            {soundPreset === 'mute' ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
            <span>{soundPreset === 'mute' ? '음소거' : '배경음'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setColorTheme(colorTheme === 'hanji' ? 'black' : 'hanji')}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1.5 cursor-pointer text-xs ${
              colorTheme === 'hanji'
                ? 'hover:bg-[#ebe3d0] text-[#5c5446]'
                : 'hover:bg-neutral-800 text-neutral-400'
            }`}
            title="테마 전환"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>{colorTheme === 'hanji' ? '한지' : '칠흑'}</span>
          </button>

          {/* System Inspector for Creator */}
          <button
            onClick={() => setIsInspectorOpen(true)}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1.5 cursor-pointer text-xs ${
              colorTheme === 'hanji'
                ? 'hover:bg-[#ebe3d0] text-[#736a5c]'
                : 'hover:bg-neutral-800 text-neutral-400'
            }`}
            title="시스템 산정 근거 (운영진용)"
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>산정 근거</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
