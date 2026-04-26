/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface PlayerScore {
  id: string;
  playerName: string;
  score: number;
  level: number;
  distance: number;
  gemsCollected: number;
  timestamp: number;
}

const RANKING_STORAGE_KEY = 'cyber-runner-ranking';
const MAX_SCORES = 5;

// LocalStorage implementation (replace with API calls for online)
export const ranking = {
  // Get top 5 scores
  getTopScores: (): PlayerScore[] => {
    try {
      const stored = localStorage.getItem(RANKING_STORAGE_KEY);
      if (!stored) return [];
      
      const scores: PlayerScore[] = JSON.parse(stored);
      return scores
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_SCORES);
    } catch {
      return [];
    }
  },

  // Add new score and return updated ranking
  addScore: (playerData: Omit<PlayerScore, 'id' | 'timestamp'>): PlayerScore[] => {
    try {
      const stored = localStorage.getItem(RANKING_STORAGE_KEY);
      let scores: PlayerScore[] = stored ? JSON.parse(stored) : [];

      // Add new score
      const newScore: PlayerScore = {
        ...playerData,
        id: `${Date.now()}-${Math.random()}`,
        timestamp: Date.now()
      };

      scores.push(newScore);

      // Keep only top 50 to prevent storage bloat
      scores = scores
        .sort((a, b) => b.score - a.score)
        .slice(0, 50);

      localStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(scores));

      // Return top 5
      return scores.slice(0, MAX_SCORES);
    } catch {
      return [];
    }
  },

  // Clear all scores (admin function)
  clearAllScores: () => {
    localStorage.removeItem(RANKING_STORAGE_KEY);
  }
};
