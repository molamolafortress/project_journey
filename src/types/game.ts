export interface BucketItem {
  id: number;
  text: string;
  cost: number;
  daysSpent: number;
  lifespanDelta: number;
  story: string;
  chronicle: string;
  costBreakdown?: string;
  rationale?: string;
  feasibility?: 'realistic' | 'high_cost' | 'extreme' | 'impossible';
  status: 'analyzing' | 'ready';
  selected: boolean;
  category?: string;
  turnNumber?: number;
  actualCost?: number;
}

export interface PlayerProfile {
  status: 'idle' | 'analyzing' | 'ready';
  coreValue: string;
  summary: string;
  repressedDesires?: string;
}

export type GamePhase = 'input' | 'story_bridge' | 'gameplay' | 'story_result' | 'ending';

export type SoundPreset = 'frostcello' | 'warmpiano' | 'heartbeat' | 'mute';

export type ColorTheme = 'hanji' | 'black';

export interface EndingSlide {
  type: 'choice' | 'summary' | 'argon_profile' | 'artwork_awakening';
  turn?: number;
  title?: string;
  days?: number;
  cost?: number;
  lifeDelta?: number;
  chronicle?: string;
  totalSpent?: number;
  chosenCount?: number;
  totalLifeGained?: string;
  finalMonths?: number;
  unchosen?: string[];
}

export interface RefinementSuggestion {
  question: string;
  options: string[];
}
