export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type Category =
  | 'تاریخ ایران'
  | 'تاریخ جهان'
  | 'علم'
  | 'فضا و نجوم'
  | 'حیوانات'
  | 'طبیعت'
  | 'فناوری و اینترنت'
  | 'بدن انسان'
  | 'جغرافیا'
  | 'فرهنگ و ادبیات'
  | 'شاهنامه'
  | 'عجایب جهان'
  | 'دانستنی‌های عمومی';

export interface Question {
  id: string;
  question: string;
  category: Category;
  difficulty: Difficulty;
  correctAnswer: 'true' | 'false'; // 'true' = واقعیت (Truth), 'false' = شایعه (Rumor)
  explanation: string;
  source: string;
  sourceUrl?: string;
  verifiedDate: string;
  tags?: string[];
  clue?: string; // Clue for Hint system
}

export interface QuestionReport {
  id: string;
  questionId: string;
  reason: 'wrong_answer' | 'invalid_source' | 'unclear' | 'other';
  description?: string;
  reportedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'general' | 'streak' | 'accuracy' | 'knowledge' | 'speed';
  maxProgress: number;
  currentProgress?: number;
  unlocked: boolean;
  unlockedAt?: string;
  rewardCoins: number;
  rewardXP: number;
}

export interface LevelRank {
  level: number;
  title: string;
  minXP: number;
  badge: string;
  color: string;
}

export interface UserStats {
  totalGames: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  totalWrong: number;
  highestScore: number;
  bestStreak: number;
  fastestAnswerSec: number;
  categoryStats: Record<string, { correct: number; total: number }>;
}

export interface UserProfile {
  name: string;
  avatarId: string;
  score: number;
  xp: number;
  level: number;
  coins: number;
  lives: number; // Max 5
  lastLifeLostTimestamp: number | null; // For 30-min recharge
  streakDays: number;
  lastActiveDate: string; // 'YYYY-MM-DD'
  viewedQuestionIds: string[];
  stats: UserStats;
  unlockedAchievements: string[];
  dailyCompletedDates: string[]; // ['YYYY-MM-DD']
  settings: {
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    darkMode: boolean;
    notificationsEnabled: boolean;
  };
  hasSeenOnboarding: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  level: number;
  rankTitle: string;
  avatarId: string;
  wins: number;
  isCurrentUser?: boolean;
}

export type ScreenState =
  | 'splash'
  | 'home'
  | 'game'
  | 'game_over'
  | 'daily_challenge'
  | 'special_cases'
  | 'achievements'
  | 'leaderboard'
  | 'stats'
  | 'settings'
  | 'privacy'
  | 'terms';
