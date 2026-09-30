import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingModal } from './components/OnboardingModal';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { DailyChallengeScreen } from './components/DailyChallengeScreen';
import { SpecialCasesScreen } from './components/SpecialCasesScreen';
import { AchievementsScreen } from './components/AchievementsScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { StatsScreen } from './components/StatsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { TermsModal } from './components/TermsModal';
import { HeartsModal } from './components/HeartsModal';
import { ReportQuestionModal } from './components/ReportQuestionModal';
import { AdModal } from './components/AdModal';
import { CelebrationModals } from './components/CelebrationModals';

const GameContainer: React.FC = () => {
  const { screenState, userProfile } = useGame();

  if (screenState === 'splash') {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col justify-start items-center selection:bg-amber-500/30 selection:text-amber-200">
      {/* Onboarding Dialog if first launch */}
      {!userProfile.hasSeenOnboarding && <OnboardingModal />}

      {/* Main App Frame (Optimized for Mobile & Tablet viewports) */}
      <div className="w-full max-w-md min-h-screen bg-[#070b16] flex flex-col justify-between shadow-2xl relative border-x border-slate-900/80">
        {/* Sticky App Header */}
        <Header />

        {/* Dynamic Screen Component */}
        <main className="flex-1 flex flex-col justify-between py-2 overflow-x-hidden">
          {screenState === 'home' && <HomeScreen />}
          {screenState === 'game' && <GameScreen />}
          {screenState === 'game_over' && <GameOverScreen />}
          {screenState === 'daily_challenge' && <DailyChallengeScreen />}
          {screenState === 'special_cases' && <SpecialCasesScreen />}
          {screenState === 'achievements' && <AchievementsScreen />}
          {screenState === 'leaderboard' && <LeaderboardScreen />}
          {screenState === 'stats' && <StatsScreen />}
          {screenState === 'settings' && <SettingsScreen />}
          {screenState === 'privacy' && <PrivacyPolicyModal />}
          {screenState === 'terms' && <TermsModal />}
        </main>

        {/* Modals & Overlays */}
        <HeartsModal />
        <ReportQuestionModal />
        <AdModal />
        <CelebrationModals />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  );
}
