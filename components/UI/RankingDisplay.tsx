/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Trophy, Medal } from 'lucide-react';
import { ranking, PlayerScore } from '../../utils/ranking';

interface RankingDisplayProps {
  currentScore: number;
  currentPlayerName: string;
}

export const RankingDisplay: React.FC<RankingDisplayProps> = ({ currentScore, currentPlayerName }) => {
  const [topScores, setTopScores] = useState<PlayerScore[]>([]);
  const [playerRank, setPlayerRank] = useState<number | null>(null);

  useEffect(() => {
    // Add current score and get updated ranking
    const updatedRanking = ranking.addScore({
      playerName: currentPlayerName || 'ANÔNIMO',
      score: currentScore,
      level: 0,
      distance: 0,
      gemsCollected: 0
    });
    
    setTopScores(updatedRanking);
    
    // Find current player's rank
    const rank = updatedRanking.findIndex(s => s.score === currentScore && s.playerName === currentPlayerName);
    if (rank >= 0) {
      setPlayerRank(rank + 1);
    }
  }, []);

  const getMedalIcon = (position: number) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `#${position}`;
  };

  const isPlayerInTop5 = playerRank !== null && playerRank <= 5;

  return (
    <div className="w-full max-w-lg mx-auto mt-8 mb-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 font-cyber tracking-widest">
            TOP 5 RANKING
          </h2>
          <Trophy className="w-6 h-6 text-yellow-400" />
        </div>
        {isPlayerInTop5 && playerRank === 1 && (
          <p className="text-yellow-400 font-bold animate-pulse text-sm">🌟 VOCÊ ESTÁ NO TOPO! 🌟</p>
        )}
        {isPlayerInTop5 && playerRank && playerRank > 1 && (
          <p className="text-cyan-400 font-bold text-sm">📍 Você está em #{playerRank}º lugar!</p>
        )}
      </div>

      <div className="space-y-2">
        {topScores.map((entry, index) => {
          const position = index + 1;
          const isCurrentPlayer = entry.playerName === currentPlayerName && entry.score === currentScore;
          
          return (
            <div
              key={`${entry.id}-${index}`}
              className={`p-4 rounded-lg border-2 transition-all ${
                isCurrentPlayer
                  ? 'bg-cyan-500/20 border-cyan-500 ring-2 ring-cyan-400'
                  : position === 1
                  ? 'bg-yellow-500/10 border-yellow-500'
                  : position === 2
                  ? 'bg-gray-400/10 border-gray-400'
                  : position === 3
                  ? 'bg-orange-500/10 border-orange-500'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-2xl font-black w-10 text-center">
                    {getMedalIcon(position)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate text-sm md:text-base">
                      {entry.playerName}
                      {isCurrentPlayer && <span className="text-cyan-400 ml-1">(VOCÊ)</span>}
                    </p>
                    <p className="text-xs text-white/50">
                      Nível {entry.level} • {Math.floor(entry.distance)} AL
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                    {entry.score.toLocaleString()}
                  </p>
                  <p className="text-xs text-white/50 font-mono">
                    {entry.gemsCollected} 💎
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {topScores.length === 0 && (
        <div className="text-center py-8 text-white/50">
          <p className="text-sm">Seja o primeiro a entrar no ranking!</p>
        </div>
      )}
    </div>
  );
};
