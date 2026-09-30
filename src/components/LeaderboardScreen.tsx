import React, { useMemo } from 'react';
import { BarChart3, Trophy, ArrowRight, Medal, Crown } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { INITIAL_LEADERBOARD } from '../data/leaderboard';
import { toPersianDigits } from '../utils/persian';
import { getRankForXP } from '../data/levels';
import { AVATAR_OPTIONS } from '../data/avatars';
import { LeaderboardEntry } from '../types';

export const LeaderboardScreen: React.FC = () => {
  const { setScreenState, userProfile } = useGame();
  const currentRank = getRankForXP(userProfile.xp);
  const userAvatar = AVATAR_OPTIONS.find((a) => a.id === userProfile.avatarId) || AVATAR_OPTIONS[0];

  // Merge current user into leaderboard dynamically
  const sortedBoard = useMemo(() => {
    const userEntry: LeaderboardEntry = {
      id: 'current_user',
      name: `${userProfile.name} (شما)`,
      score: userProfile.score,
      level: currentRank.level,
      rankTitle: currentRank.title,
      avatarId: userProfile.avatarId,
      wins: userProfile.stats.totalGames,
      isCurrentUser: true,
    };

    const combined = [...INITIAL_LEADERBOARD, userEntry];
    return combined.sort((a, b) => b.score - a.score);
  }, [userProfile.score, userProfile.name, userProfile.avatarId, userProfile.stats.totalGames, currentRank]);

  const userRankPosition = sortedBoard.findIndex((e) => e.isCurrentUser) + 1;

  return (
    <div className="flex-1 max-w-md mx-auto w-full px-4 py-3 flex flex-col justify-between space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setScreenState('home')}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به خانه</span>
        </button>

        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
          <Trophy className="w-3.5 h-3.5" />
          <span>رتبه‌بندی کارآگاهان</span>
        </span>
      </div>

      {/* User Rank Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#0f1733] to-[#0f1733] border border-amber-500/40 flex items-center justify-between text-right shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-lg font-black">
            #{toPersianDigits(userRankPosition)}
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1">
              <span>{userProfile.name}</span>
              <span className="text-xs text-amber-400 font-normal">(شما)</span>
            </h3>
            <span className="text-[11px] text-amber-300">{currentRank.title}</span>
          </div>
        </div>

        <div className="text-left">
          <span className="text-base font-black text-amber-300 block">
            {toPersianDigits(userProfile.score)}
          </span>
          <span className="text-[10px] text-slate-400">امتیاز کل</span>
        </div>
      </div>

      {/* Leaderboard Table List */}
      <div className="space-y-2 overflow-y-auto max-h-[62vh] pr-0.5">
        {sortedBoard.map((entry, idx) => {
          const rank = idx + 1;
          const isTop3 = rank <= 3;
          const avatar = AVATAR_OPTIONS.find((a) => a.id === entry.avatarId) || AVATAR_OPTIONS[0];

          return (
            <div
              key={entry.id}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between text-right ${
                entry.isCurrentUser
                  ? 'bg-amber-950/30 border-amber-400 shadow-md'
                  : 'bg-[#0f1733] border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {/* Rank Badge */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    rank === 1
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : rank === 2
                      ? 'bg-slate-300 text-slate-950 font-black'
                      : rank === 3
                      ? 'bg-amber-700 text-white font-black'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {toPersianDigits(rank)}
                </div>

                {/* Avatar & Name */}
                <span className="text-xl">{avatar.emoji}</span>

                <div>
                  <h4 className="font-bold text-xs text-slate-100 flex items-center gap-1">
                    <span>{entry.name}</span>
                    {rank === 1 && <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                  </h4>
                  <span className="text-[10px] text-slate-400 block">{entry.rankTitle}</span>
                </div>
              </div>

              {/* Score */}
              <div className="text-left">
                <span className="font-black text-sm text-slate-100 block">
                  {toPersianDigits(entry.score)}
                </span>
                <span className="text-[10px] text-slate-400">
                  {toPersianDigits(entry.wins)} بازی
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
