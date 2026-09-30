import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Category,
  LevelRank,
  Question,
  QuestionReport,
  ScreenState,
  UserProfile,
  UserStats,
} from '../types';
import { getRankForXP, getNextRank } from '../data/levels';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { getQuestionsForGame, getDailyChallengeQuestions } from '../data/questions';
import { getTodayDateString, getDaysDifference } from '../utils/persian';
import { soundService } from '../services/audio';
import { adManager, ActiveAdModalState } from '../services/ads';
import { analytics } from '../services/analytics';

const STORAGE_KEY = 'fake_news_detective_profile_v1';
const REPORTS_STORAGE_KEY = 'fake_news_detective_reports_v1';
const LIFE_RECHARGE_MS = 30 * 60 * 1000; // 30 minutes per heart
const MAX_LIVES = 5;

const INITIAL_STATS: UserStats = {
  totalGames: 0,
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  totalWrong: 0,
  highestScore: 0,
  bestStreak: 1,
  fastestAnswerSec: 10,
  categoryStats: {},
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'کارآگاه حقیقت',
  avatarId: 'detective_1',
  score: 0,
  xp: 0,
  level: 1,
  coins: 150,
  lives: MAX_LIVES,
  lastLifeLostTimestamp: null,
  streakDays: 1,
  lastActiveDate: getTodayDateString(),
  viewedQuestionIds: [],
  stats: INITIAL_STATS,
  unlockedAchievements: [],
  dailyCompletedDates: [],
  settings: {
    soundEnabled: true,
    vibrationEnabled: true,
    darkMode: true,
    notificationsEnabled: true,
  },
  hasSeenOnboarding: false,
};

export interface AnswerResult {
  isCorrect: boolean;
  selectedAnswer: 'true' | 'false' | 'timeout';
  question: Question;
  ptsEarned: number;
  speedBonus: number;
  comboMultiplier: number;
}

interface GameContextType {
  userProfile: UserProfile;
  screenState: ScreenState;
  setScreenState: (screen: ScreenState) => void;
  // Navigation & Modals
  isHeartsModalOpen: boolean;
  setIsHeartsModalOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  reportingQuestion: Question | null;
  adModalState: ActiveAdModalState | null;
  newAchievementUnlocked: (typeof INITIAL_ACHIEVEMENTS)[0] | null;
  dismissAchievementModal: () => void;
  newLevelReached: LevelRank | null;
  dismissLevelUpModal: () => void;
  // Match state
  matchQuestions: Question[];
  currentQuestionIndex: number;
  currentQuestion: Question | null;
  questionTimer: number;
  consecutiveStreak: number;
  matchScore: number;
  matchCoinsEarned: number;
  matchXpEarned: number;
  isAnswerSubmitted: boolean;
  lastAnswerResult: AnswerResult | null;
  userAnswersHistory: Array<{ question: Question; userAnswer: 'true' | 'false' | 'timeout'; isCorrect: boolean }>;
  eliminatedOption: 'true' | 'false' | null;
  revealedClue: boolean;
  matchGameMode: 'quick' | 'daily' | 'special_case';
  // Actions
  startQuickGame: () => boolean;
  startDailyChallenge: () => boolean;
  startSpecialCaseGame: (category: Category) => boolean;
  submitAnswer: (answer: 'true' | 'false') => void;
  proceedToNextQuestion: () => void;
  useHintEliminate: () => boolean;
  useHintExtraTime: () => boolean;
  useHintClue: () => boolean;
  rechargeLifeViaAd: () => void;
  rechargeLifeViaCoins: () => boolean;
  watchDoubleRewardAd: () => void;
  updateProfileName: (name: string) => void;
  updateAvatar: (avatarId: string) => void;
  toggleSound: () => void;
  toggleVibration: () => void;
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  completeOnboarding: () => void;
  resetProgress: () => void;
  submitQuestionReport: (reason: QuestionReport['reason'], description?: string) => void;
  openReportModal: (q: Question) => void;
  // Helpers
  nextHeartCountdownSeconds: number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_PROFILE, ...parsed };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROFILE;
  });

  const [screenState, setScreenState] = useState<ScreenState>('splash');
  const [isHeartsModalOpen, setIsHeartsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportingQuestion, setReportingQuestion] = useState<Question | null>(null);
  const [adModalState, setAdModalState] = useState<ActiveAdModalState | null>(null);
  const [newAchievementUnlocked, setNewAchievementUnlocked] = useState<(typeof INITIAL_ACHIEVEMENTS)[0] | null>(null);
  const [newLevelReached, setNewLevelReached] = useState<LevelRank | null>(null);

  // Match State
  const [matchGameMode, setMatchGameMode] = useState<'quick' | 'daily' | 'special_case'>('quick');
  const [matchQuestions, setMatchQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(10);
  const [consecutiveStreak, setConsecutiveStreak] = useState(0);
  const [matchScore, setMatchScore] = useState(0);
  const [matchCoinsEarned, setMatchCoinsEarned] = useState(0);
  const [matchXpEarned, setMatchXpEarned] = useState(0);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [lastAnswerResult, setLastAnswerResult] = useState<AnswerResult | null>(null);
  const [userAnswersHistory, setUserAnswersHistory] = useState<
    Array<{ question: Question; userAnswer: 'true' | 'false' | 'timeout'; isCorrect: boolean }>
  >([]);
  const [eliminatedOption, setEliminatedOption] = useState<'true' | 'false' | null>(null);
  const [revealedClue, setRevealedClue] = useState(false);

  // Hook Ad listener
  useEffect(() => {
    adManager.setAdModalListener(setAdModalState);
    return () => {
      adManager.setAdModalListener(null);
    };
  }, []);

  // Save profile on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
    } catch {
      // Ignore
    }
  }, [userProfile]);

  // Sync sound & vibration with service
  useEffect(() => {
    soundService.setSoundEnabled(userProfile.settings.soundEnabled);
    soundService.setVibrationEnabled(userProfile.settings.vibrationEnabled);
  }, [userProfile.settings]);

  // Daily Streak Check on mount
  useEffect(() => {
    const today = getTodayDateString();
    if (userProfile.lastActiveDate !== today) {
      const diff = getDaysDifference(userProfile.lastActiveDate, today);
      let newStreak = userProfile.streakDays;
      if (diff === 1) {
        newStreak += 1;
        analytics.logEvent('streak_extended', { streak: newStreak });
      } else if (diff > 1) {
        newStreak = 1;
      }
      setUserProfile((prev) => ({
        ...prev,
        streakDays: newStreak,
        lastActiveDate: today,
        stats: {
          ...prev.stats,
          bestStreak: Math.max(prev.stats.bestStreak, newStreak),
        },
      }));
    }
  }, [userProfile.lastActiveDate, userProfile.streakDays]);

  // Hearts Recharge Timer (every 30 mins regen 1 life if < 5)
  const [nextHeartCountdownSeconds, setNextHeartCountdownSeconds] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (userProfile.lives < MAX_LIVES && userProfile.lastLifeLostTimestamp) {
        const now = Date.now();
        const elapsed = now - userProfile.lastLifeLostTimestamp;
        if (elapsed >= LIFE_RECHARGE_MS) {
          const livesToAdd = Math.floor(elapsed / LIFE_RECHARGE_MS);
          const newLives = Math.min(MAX_LIVES, userProfile.lives + livesToAdd);
          const remainingMs = elapsed % LIFE_RECHARGE_MS;
          setUserProfile((prev) => ({
            ...prev,
            lives: newLives,
            lastLifeLostTimestamp: newLives >= MAX_LIVES ? null : now - remainingMs,
          }));
        } else {
          setNextHeartCountdownSeconds(Math.ceil((LIFE_RECHARGE_MS - elapsed) / 1000));
        }
      } else {
        setNextHeartCountdownSeconds(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userProfile.lives, userProfile.lastLifeLostTimestamp]);

  const currentQuestion = useMemo(() => {
    if (currentQuestionIndex < matchQuestions.length) {
      return matchQuestions[currentQuestionIndex];
    }
    return null;
  }, [currentQuestionIndex, matchQuestions]);

  // Handle timeout answering
  const handleTimeout = useCallback(() => {
    if (isAnswerSubmitted || !currentQuestion) return;

    soundService.playTimeout();
    setIsAnswerSubmitted(true);
    setConsecutiveStreak(0);

    // Lose heart on timeout as well
    const now = Date.now();
    setUserProfile((prev) => {
      const newLives = Math.max(0, prev.lives - 1);
      return {
        ...prev,
        lives: newLives,
        lastLifeLostTimestamp: prev.lastLifeLostTimestamp || now,
        stats: {
          ...prev.stats,
          totalQuestionsAnswered: prev.stats.totalQuestionsAnswered + 1,
          totalWrong: prev.stats.totalWrong + 1,
        },
      };
    });

    const result: AnswerResult = {
      isCorrect: false,
      selectedAnswer: 'timeout',
      question: currentQuestion,
      ptsEarned: 0,
      speedBonus: 0,
      comboMultiplier: 1,
    };
    setLastAnswerResult(result);
    setUserAnswersHistory((prev) => [
      ...prev,
      { question: currentQuestion, userAnswer: 'timeout', isCorrect: false },
    ]);
  }, [isAnswerSubmitted, currentQuestion]);

  // Question Timer countdown
  useEffect(() => {
    if (screenState !== 'game' || isAnswerSubmitted || !currentQuestion) return;

    if (questionTimer <= 0) {
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setQuestionTimer((prev) => {
        if (prev <= 4 && prev > 1) {
          soundService.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [screenState, isAnswerSubmitted, questionTimer, currentQuestion, handleTimeout]);

  // Check achievements helper
  const checkAchievements = useCallback((stats: UserStats, streak: number) => {
    INITIAL_ACHIEVEMENTS.forEach((ach) => {
      if (userProfile.unlockedAchievements.includes(ach.id)) return;

      let satisfied = false;
      if (ach.id === 'first_truth' && stats.totalCorrect >= 1) satisfied = true;
      if (ach.id === 'correct_10' && stats.totalCorrect >= 10) satisfied = true;
      if (ach.id === 'correct_100' && stats.totalCorrect >= 100) satisfied = true;
      if (ach.id === 'correct_500' && stats.totalCorrect >= 500) satisfied = true;
      if (ach.id === 'speed_demon' && stats.fastestAnswerSec <= 3) satisfied = true;
      if (ach.id === 'streak_7' && streak >= 7) satisfied = true;
      if (ach.id === 'streak_30' && streak >= 30) satisfied = true;

      if (satisfied) {
        soundService.playAchievement();
        try {
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        } catch {
          // Ignore
        }
        setNewAchievementUnlocked(ach);
        analytics.logEvent('achievement_unlocked', { achievement_id: ach.id });

        setUserProfile((prev) => ({
          ...prev,
          coins: prev.coins + ach.rewardCoins,
          xp: prev.xp + ach.rewardXP,
          unlockedAchievements: [...prev.unlockedAchievements, ach.id],
        }));
      }
    });
  }, [userProfile.unlockedAchievements]);

  // Start Quick Game
  const startQuickGame = (): boolean => {
    if (userProfile.lives <= 0) {
      setIsHeartsModalOpen(true);
      return false;
    }

    const questions = getQuestionsForGame(10, userProfile.viewedQuestionIds);
    setMatchGameMode('quick');
    setMatchQuestions(questions);
    setCurrentQuestionIndex(0);
    setQuestionTimer(10);
    setConsecutiveStreak(0);
    setMatchScore(0);
    setMatchCoinsEarned(0);
    setMatchXpEarned(0);
    setIsAnswerSubmitted(false);
    setLastAnswerResult(null);
    setUserAnswersHistory([]);
    setEliminatedOption(null);
    setRevealedClue(false);
    setScreenState('game');
    analytics.logEvent('game_started', { mode: 'quick' });
    soundService.playClick();
    return true;
  };

  // Start Daily Challenge
  const startDailyChallenge = (): boolean => {
    const today = getTodayDateString();
    if (userProfile.dailyCompletedDates.includes(today)) {
      return false;
    }
    if (userProfile.lives <= 0) {
      setIsHeartsModalOpen(true);
      return false;
    }

    const questions = getDailyChallengeQuestions(today);
    setMatchGameMode('daily');
    setMatchQuestions(questions);
    setCurrentQuestionIndex(0);
    setQuestionTimer(10);
    setConsecutiveStreak(0);
    setMatchScore(0);
    setMatchCoinsEarned(0);
    setMatchXpEarned(0);
    setIsAnswerSubmitted(false);
    setLastAnswerResult(null);
    setUserAnswersHistory([]);
    setEliminatedOption(null);
    setRevealedClue(false);
    setScreenState('game');
    analytics.logEvent('daily_challenge_started', { date: today });
    soundService.playClick();
    return true;
  };

  // Start Special Case Dossier
  const startSpecialCaseGame = (category: Category): boolean => {
    if (userProfile.lives <= 0) {
      setIsHeartsModalOpen(true);
      return false;
    }

    const questions = getQuestionsForGame(10, userProfile.viewedQuestionIds, category);
    setMatchGameMode('special_case');
    setMatchQuestions(questions);
    setCurrentQuestionIndex(0);
    setQuestionTimer(10);
    setConsecutiveStreak(0);
    setMatchScore(0);
    setMatchCoinsEarned(0);
    setMatchXpEarned(0);
    setIsAnswerSubmitted(false);
    setLastAnswerResult(null);
    setUserAnswersHistory([]);
    setEliminatedOption(null);
    setRevealedClue(false);
    setScreenState('game');
    analytics.logEvent('game_started', { mode: 'special_case', category });
    soundService.playClick();
    return true;
  };

  // Submit Answer (🟢 واقعیت vs 🔴 شایعه)
  const submitAnswer = (answer: 'true' | 'false') => {
    if (isAnswerSubmitted || !currentQuestion) return;

    setIsAnswerSubmitted(true);
    const isCorrect = currentQuestion.correctAnswer === answer;
    const answerDuration = 10 - questionTimer;

    let ptsEarned = 0;
    let speedBonus = 0;
    let comboMultiplier = 1;
    let coinsEarned = 0;
    let xpEarned = 0;

    if (isCorrect) {
      soundService.playCorrect();
      const newStreak = consecutiveStreak + 1;
      setConsecutiveStreak(newStreak);

      // Base score
      const basePts = 100;

      // Speed bonus
      if (answerDuration <= 3) {
        speedBonus = 100;
      } else if (answerDuration <= 6) {
        speedBonus = 50;
      }

      // Combo multiplier: 2 -> x1.2, 3 -> x1.5, 5 -> x2, 10 -> x3
      if (newStreak >= 10) comboMultiplier = 3.0;
      else if (newStreak >= 5) comboMultiplier = 2.0;
      else if (newStreak >= 3) comboMultiplier = 1.5;
      else if (newStreak >= 2) comboMultiplier = 1.2;

      ptsEarned = Math.round((basePts + speedBonus) * comboMultiplier);
      coinsEarned = 10 + (speedBonus > 0 ? 5 : 0);
      xpEarned = Math.round(ptsEarned * 0.4);

      setMatchScore((prev) => prev + ptsEarned);
      setMatchCoinsEarned((prev) => prev + coinsEarned);
      setMatchXpEarned((prev) => prev + xpEarned);

      // Check level up
      const oldRank = getRankForXP(userProfile.xp);
      const newRank = getRankForXP(userProfile.xp + xpEarned);
      if (newRank.level > oldRank.level) {
        soundService.playLevelUp();
        setNewLevelReached(newRank);
        analytics.logEvent('level_up', { new_level: newRank.level });
      }

      setUserProfile((prev) => {
        const updatedCat = { ...(prev.stats.categoryStats[currentQuestion.category] || { correct: 0, total: 0 }) };
        updatedCat.correct += 1;
        updatedCat.total += 1;

        const newStats: UserStats = {
          ...prev.stats,
          totalQuestionsAnswered: prev.stats.totalQuestionsAnswered + 1,
          totalCorrect: prev.stats.totalCorrect + 1,
          fastestAnswerSec: Math.min(prev.stats.fastestAnswerSec, answerDuration),
          categoryStats: {
            ...prev.stats.categoryStats,
            [currentQuestion.category]: updatedCat,
          },
        };

        checkAchievements(newStats, prev.streakDays);

        return {
          ...prev,
          score: prev.score + ptsEarned,
          coins: prev.coins + coinsEarned,
          xp: prev.xp + xpEarned,
          level: newRank.level,
          viewedQuestionIds: prev.viewedQuestionIds.includes(currentQuestion.id)
            ? prev.viewedQuestionIds
            : [...prev.viewedQuestionIds, currentQuestion.id],
          stats: newStats,
        };
      });

      analytics.logEvent('correct_answer', {
        question_id: currentQuestion.id,
        category: currentQuestion.category,
        streak: newStreak,
      });
    } else {
      // Wrong answer
      soundService.playWrong();
      setConsecutiveStreak(0);

      const now = Date.now();
      setUserProfile((prev) => {
        const updatedCat = { ...(prev.stats.categoryStats[currentQuestion.category] || { correct: 0, total: 0 }) };
        updatedCat.total += 1;

        const newLives = Math.max(0, prev.lives - 1);

        return {
          ...prev,
          lives: newLives,
          lastLifeLostTimestamp: prev.lastLifeLostTimestamp || now,
          viewedQuestionIds: prev.viewedQuestionIds.includes(currentQuestion.id)
            ? prev.viewedQuestionIds
            : [...prev.viewedQuestionIds, currentQuestion.id],
          stats: {
            ...prev.stats,
            totalQuestionsAnswered: prev.stats.totalQuestionsAnswered + 1,
            totalWrong: prev.stats.totalWrong + 1,
            categoryStats: {
              ...prev.stats.categoryStats,
              [currentQuestion.category]: updatedCat,
            },
          },
        };
      });

      analytics.logEvent('wrong_answer', {
        question_id: currentQuestion.id,
        category: currentQuestion.category,
      });
    }

    const result: AnswerResult = {
      isCorrect,
      selectedAnswer: answer,
      question: currentQuestion,
      ptsEarned,
      speedBonus,
      comboMultiplier,
    };
    setLastAnswerResult(result);
    setUserAnswersHistory((prev) => [
      ...prev,
      { question: currentQuestion, userAnswer: answer, isCorrect },
    ]);
  };

  // Proceed to next question or end game
  const proceedToNextQuestion = () => {
    soundService.playClick();
    if (currentQuestionIndex + 1 < matchQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionTimer(10);
      setIsAnswerSubmitted(false);
      setLastAnswerResult(null);
      setEliminatedOption(null);
      setRevealedClue(false);
    } else {
      // Game Completed!
      const totalCorrect = userAnswersHistory.filter((a) => a.isCorrect).length + (lastAnswerResult?.isCorrect ? 1 : 0);
      const isFullFlawless = totalCorrect === matchQuestions.length;

      if (isFullFlawless) {
        soundService.playVictory();
        try {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        } catch {
          // Ignore
        }
      } else if (totalCorrect >= 7) {
        soundService.playVictory();
      }

      // Record daily challenge completed if daily
      if (matchGameMode === 'daily') {
        const today = getTodayDateString();
        setUserProfile((prev) => ({
          ...prev,
          dailyCompletedDates: [...prev.dailyCompletedDates, today],
        }));
        analytics.logEvent('daily_challenge_completed', { date: today, score: matchScore });
      }

      setUserProfile((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          totalGames: prev.stats.totalGames + 1,
          highestScore: Math.max(prev.stats.highestScore, matchScore),
        },
      }));

      analytics.logEvent('game_completed', {
        mode: matchGameMode,
        score: matchScore,
        correct_count: totalCorrect,
      });

      // Show clean non-intrusive interstitial ad after game as required
      adManager.showInterstitial(() => {
        setScreenState('game_over');
      });
    }
  };

  // HINT 1: Eliminate 50/50 option (Cost 50 coins)
  const useHintEliminate = (): boolean => {
    if (eliminatedOption || !currentQuestion || isAnswerSubmitted) return false;

    if (userProfile.coins < 50) {
      // Offer rewarded ad for hint
      adManager.showRewardedAd({
        rewardTitle: 'حذف یک گزینه نادرست',
        onRewarded: () => {
          const wrongOption = currentQuestion.correctAnswer === 'true' ? 'false' : 'true';
          setEliminatedOption(wrongOption);
          soundService.playClick();
          analytics.logEvent('hint_used', { hint_type: 'eliminate_option', via: 'ad' });
        },
      });
      return false;
    }

    soundService.playCoin();
    setUserProfile((prev) => ({ ...prev, coins: prev.coins - 50 }));
    const wrongOption = currentQuestion.correctAnswer === 'true' ? 'false' : 'true';
    setEliminatedOption(wrongOption);
    analytics.logEvent('hint_used', { hint_type: 'eliminate_option', via: 'coins' });
    return true;
  };

  // HINT 2: Extra Time (+5 seconds, Cost 30 coins)
  const useHintExtraTime = (): boolean => {
    if (isAnswerSubmitted || !currentQuestion) return false;

    if (userProfile.coins < 30) {
      adManager.showRewardedAd({
        rewardTitle: 'افزایش ۵ ثانیه زمان پاسخ',
        onRewarded: () => {
          setQuestionTimer((prev) => prev + 5);
          soundService.playClick();
          analytics.logEvent('hint_used', { hint_type: 'extra_time', via: 'ad' });
        },
      });
      return false;
    }

    soundService.playCoin();
    setUserProfile((prev) => ({ ...prev, coins: prev.coins - 30 }));
    setQuestionTimer((prev) => prev + 5);
    analytics.logEvent('hint_used', { hint_type: 'extra_time', via: 'coins' });
    return true;
  };

  // HINT 3: Show Clue (Cost 40 coins)
  const useHintClue = (): boolean => {
    if (revealedClue || isAnswerSubmitted || !currentQuestion) return false;

    if (userProfile.coins < 40) {
      adManager.showRewardedAd({
        rewardTitle: 'نمایش سرنخ کارآگاهی',
        onRewarded: () => {
          setRevealedClue(true);
          soundService.playClick();
          analytics.logEvent('hint_used', { hint_type: 'clue', via: 'ad' });
        },
      });
      return false;
    }

    soundService.playCoin();
    setUserProfile((prev) => ({ ...prev, coins: prev.coins - 40 }));
    setRevealedClue(true);
    analytics.logEvent('hint_used', { hint_type: 'clue', via: 'coins' });
    return true;
  };

  // Recharge Hearts via Rewarded Ad
  const rechargeLifeViaAd = () => {
    adManager.showRewardedAd({
      rewardTitle: 'دریافت ۱ جان رایگان',
      onRewarded: () => {
        soundService.playCorrect();
        setUserProfile((prev) => {
          const newLives = Math.min(MAX_LIVES, prev.lives + 1);
          return {
            ...prev,
            lives: newLives,
            lastLifeLostTimestamp: newLives >= MAX_LIVES ? null : prev.lastLifeLostTimestamp,
          };
        });
        setIsHeartsModalOpen(false);
      },
    });
  };

  // Recharge Hearts via 100 Coins
  const rechargeLifeViaCoins = (): boolean => {
    if (userProfile.coins < 100 || userProfile.lives >= MAX_LIVES) return false;

    soundService.playCoin();
    setUserProfile((prev) => {
      const newLives = Math.min(MAX_LIVES, prev.lives + 1);
      return {
        ...prev,
        coins: prev.coins - 100,
        lives: newLives,
        lastLifeLostTimestamp: newLives >= MAX_LIVES ? null : prev.lastLifeLostTimestamp,
      };
    });
    return true;
  };

  // Double Reward after game with ad
  const watchDoubleRewardAd = () => {
    adManager.showRewardedAd({
      rewardTitle: '۲ برابر کردن سکه و امتیاز این بازی',
      onRewarded: () => {
        soundService.playVictory();
        try {
          confetti({ particleCount: 50, spread: 60 });
        } catch {
          // Ignore
        }
        setUserProfile((prev) => ({
          ...prev,
          score: prev.score + matchScore,
          coins: prev.coins + matchCoinsEarned,
        }));
        setMatchScore((prev) => prev * 2);
        setMatchCoinsEarned((prev) => prev * 2);
      },
    });
  };

  const updateProfileName = (name: string) => {
    setUserProfile((prev) => ({ ...prev, name: name.trim() || 'کارآگاه حقیقت' }));
  };

  const updateAvatar = (avatarId: string) => {
    setUserProfile((prev) => ({ ...prev, avatarId }));
  };

  const toggleSound = () => {
    setUserProfile((prev) => ({
      ...prev,
      settings: { ...prev.settings, soundEnabled: !prev.settings.soundEnabled },
    }));
  };

  const toggleVibration = () => {
    setUserProfile((prev) => ({
      ...prev,
      settings: { ...prev.settings, vibrationEnabled: !prev.settings.vibrationEnabled },
    }));
  };

  const toggleDarkMode = () => {
    setUserProfile((prev) => ({
      ...prev,
      settings: { ...prev.settings, darkMode: !prev.settings.darkMode },
    }));
  };

  const toggleNotifications = () => {
    setUserProfile((prev) => ({
      ...prev,
      settings: { ...prev.settings, notificationsEnabled: !prev.settings.notificationsEnabled },
    }));
  };

  const completeOnboarding = () => {
    setUserProfile((prev) => ({ ...prev, hasSeenOnboarding: true }));
    setScreenState('home');
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(REPORTS_STORAGE_KEY);
    setUserProfile(DEFAULT_PROFILE);
    setScreenState('home');
  };

  const openReportModal = (q: Question) => {
    setReportingQuestion(q);
    setIsReportModalOpen(true);
  };

  const submitQuestionReport = (reason: QuestionReport['reason'], description?: string) => {
    if (!reportingQuestion) return;
    const report: QuestionReport = {
      id: 'rep_' + Date.now(),
      questionId: reportingQuestion.id,
      reason,
      description,
      reportedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
      const list = stored ? JSON.parse(stored) : [];
      list.push(report);
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Ignore
    }

    analytics.logEvent('question_reported', {
      question_id: reportingQuestion.id,
      reason,
    });

    setIsReportModalOpen(false);
    setReportingQuestion(null);
  };

  const dismissAchievementModal = () => {
    setNewAchievementUnlocked(null);
  };

  const dismissLevelUpModal = () => {
    setNewLevelReached(null);
  };

  return (
    <GameContext.Provider
      value={{
        userProfile,
        screenState,
        setScreenState,
        isHeartsModalOpen,
        setIsHeartsModalOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        reportingQuestion,
        adModalState,
        newAchievementUnlocked,
        dismissAchievementModal,
        newLevelReached,
        dismissLevelUpModal,
        matchQuestions,
        currentQuestionIndex,
        currentQuestion,
        questionTimer,
        consecutiveStreak,
        matchScore,
        matchCoinsEarned,
        matchXpEarned,
        isAnswerSubmitted,
        lastAnswerResult,
        userAnswersHistory,
        eliminatedOption,
        revealedClue,
        matchGameMode,
        startQuickGame,
        startDailyChallenge,
        startSpecialCaseGame,
        submitAnswer,
        proceedToNextQuestion,
        useHintEliminate,
        useHintExtraTime,
        useHintClue,
        rechargeLifeViaAd,
        rechargeLifeViaCoins,
        watchDoubleRewardAd,
        updateProfileName,
        updateAvatar,
        toggleSound,
        toggleVibration,
        toggleDarkMode,
        toggleNotifications,
        completeOnboarding,
        resetProgress,
        submitQuestionReport,
        openReportModal,
        nextHeartCountdownSeconds,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
