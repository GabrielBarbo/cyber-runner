/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import { create } from 'zustand';
import { GameStatus, RUN_SPEED_BASE, GameDifficulty, GameTheme, AvatarStyle } from './types';

interface GameState {
  status: GameStatus;
  score: number;
  lives: number;
  maxLives: number;
  speed: number;
  collectedLetters: number[]; 
  level: number;
  laneCount: number;
  gemsCollected: number;
  distance: number;
  
  // Customization
  customWord: string;
  difficulty: GameDifficulty;
  theme: GameTheme;
  avatarStyle: AvatarStyle;
  unlockedAvatars: AvatarStyle[];
  unlockedThemes: GameTheme[];

  // Inventory / Abilities
  hasDoubleJump: boolean;
  hasImmortality: boolean;
  isImmortalityActive: boolean;
  isDucking: boolean;
  hasBlaster: boolean;
  currentFloorY: number;

  // Actions
  startGame: () => void;
  restartGame: () => void;
  takeDamage: () => void;
  restoreLife: () => void;
  addScore: (amount: number) => void;
  collectGem: (value: number) => void;
  collectLetter: (index: number) => void;
  setStatus: (status: GameStatus) => void;
  setDistance: (dist: number) => void;
  setIsDucking: (isDucking: boolean) => void;
  
  // Customization Actions
  setCustomWord: (word: string) => void;
  setDifficulty: (diff: GameDifficulty) => void;
  setTheme: (theme: GameTheme) => void;
  setAvatarStyle: (style: AvatarStyle) => void;

  // Shop / Abilities
  buyItem: (type: 'DOUBLE_JUMP' | 'MAX_LIFE' | 'HEAL' | 'IMMORTAL' | 'BLASTER', cost: number) => boolean;
  advanceLevel: () => void;
  openShop: () => void;
  closeShop: () => void;
  activateImmortality: () => void;
}

export const useStore = create<GameState>((set, get) => ({
  status: GameStatus.MENU,
  score: 0,
  lives: 3,
  maxLives: 3,
  speed: 0,
  collectedLetters: [],
  level: 1,
  laneCount: 3,
  gemsCollected: 0,
  distance: 0,

  customWord: 'COSMOS',
  difficulty: GameDifficulty.MEDIUM,
  theme: GameTheme.NEON,
  avatarStyle: AvatarStyle.ROBOT,
  unlockedAvatars: [AvatarStyle.ROBOT],
  unlockedThemes: [GameTheme.NEON],
  
  hasDoubleJump: false,
  hasImmortality: false,
  hasBlaster: false,
  isImmortalityActive: false,
  isDucking: false,
  currentFloorY: 0,

  startGame: () => set({ 
    status: GameStatus.PLAYING, 
    score: 0, 
    lives: 3, 
    maxLives: 3,
    speed: RUN_SPEED_BASE,
    collectedLetters: [],
    level: 1,
    laneCount: get().difficulty === GameDifficulty.HARD ? 5 : 3,
    gemsCollected: 0,
    distance: 0,
    hasDoubleJump: false,
    hasImmortality: false,
    isImmortalityActive: false,
    isDucking: false,
    currentFloorY: 0
  }),

  restartGame: () => set({ 
    status: GameStatus.PLAYING, 
    score: 0, 
    lives: 3, 
    maxLives: 3,
    speed: RUN_SPEED_BASE,
    collectedLetters: [],
    level: 1,
    laneCount: get().difficulty === GameDifficulty.HARD ? 5 : 3,
    gemsCollected: 0,
    distance: 0,
    hasDoubleJump: false,
    hasImmortality: false,
    hasBlaster: false,
    isImmortalityActive: false,
    isDucking: false,
    currentFloorY: 0
  }),

  takeDamage: () => {
    const { lives, isImmortalityActive, status } = get();
    if (isImmortalityActive || status !== GameStatus.PLAYING) return;

    if (lives > 1) {
      set({ lives: lives - 1 });
    } else {
      set({ lives: 0, status: GameStatus.GAME_OVER, speed: 0 });
    }
  },

  restoreLife: () => {
    const { lives, maxLives } = get();
    set({ lives: Math.min(lives + 1, maxLives) });
  },

  addScore: (amount) => set((state) => ({ score: state.score + amount })),
  
  collectGem: (value) => set((state) => ({ 
    score: state.score + value, 
    gemsCollected: state.gemsCollected + 1 
  })),

  setDistance: (dist) => {
    // Aggressive speed scaling: Base 22.5, +0.5 units of speed every 100m
    const targetSpeed = RUN_SPEED_BASE + (dist / 100) * 0.75; // Increased scaling factor to 0.75
    set((state) => ({ 
        distance: dist, 
        speed: Math.max(state.speed, Math.min(targetSpeed, RUN_SPEED_BASE * 3.5)) // Cap at 3.5x base speed (~78 units)
    }));
  },

  collectLetter: (index) => {
    const { collectedLetters, level, speed, customWord } = get();
    
    if (!collectedLetters.includes(index)) {
      const newLetters = [...collectedLetters, index];
      
      const speedIncrease = RUN_SPEED_BASE * 0.10;
      const nextSpeed = speed + speedIncrease;

      set({ 
        collectedLetters: newLetters,
        speed: nextSpeed
      });

      // Check if full word collected
      if (newLetters.length === customWord.length) {
        // Infinite progression
        get().advanceLevel();
      }
    }
  },

  advanceLevel: () => {
      const { level, laneCount, speed } = get();
      const nextLevel = level + 1;
      
      const speedIncrease = RUN_SPEED_BASE * 0.30;
      const newSpeed = speed + speedIncrease;

      set({
          level: nextLevel,
          laneCount: Math.min(laneCount + (nextLevel % 2 === 0 ? 2 : 0), 9), 
          status: GameStatus.PLAYING,
          speed: newSpeed,
          collectedLetters: [],
          score: get().score + (1000 * level)
      });
  },

  setCustomWord: (word) => set({ customWord: word.toUpperCase().slice(0, 8).replace(/[^A-Z]/g, '') || 'RUN' }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setTheme: (theme) => set({ theme }),
  setAvatarStyle: (avatarStyle) => set({ avatarStyle }),

  openShop: () => set({ status: GameStatus.SHOP }),
  
  closeShop: () => set({ status: GameStatus.PLAYING }),

  buyItem: (type, cost) => {
      const { score, maxLives, lives } = get();
      
      if (score >= cost) {
          set({ score: score - cost });
          
          switch (type) {
              case 'DOUBLE_JUMP':
                  set({ hasDoubleJump: true });
                  break;
              case 'MAX_LIFE':
                  set({ maxLives: maxLives + 1, lives: lives + 1 });
                  break;
              case 'HEAL':
                  set({ lives: Math.min(lives + 1, maxLives) });
                  break;
              case 'IMMORTAL':
                  set({ hasImmortality: true });
                  break;
              case 'BLASTER':
                  set({ hasBlaster: true });
                  break;
              default:
                  // Handle dynamic types
                  if (type.startsWith('AVATAR_')) {
                      const style = type.replace('AVATAR_', '') as AvatarStyle;
                      set(state => ({ unlockedAvatars: [...state.unlockedAvatars, style] }));
                  } else if (type.startsWith('THEME_')) {
                      const theme = type.replace('THEME_', '') as GameTheme;
                      set(state => ({ unlockedThemes: [...state.unlockedThemes, theme] }));
                  }
                  break;
          }
          return true;
      }
      return false;
  },

  activateImmortality: () => {
      const { hasImmortality, isImmortalityActive } = get();
      if (hasImmortality && !isImmortalityActive) {
          set({ isImmortalityActive: true });
          setTimeout(() => set({ isImmortalityActive: false }), 5000);
      }
  },

  setIsDucking: (isDucking) => set({ isDucking }),
  setCurrentFloorY: (currentFloorY) => set({ currentFloorY }),
  setStatus: (status) => set({ status }),
  increaseLevel: () => set((state) => ({ level: state.level + 1 })),
}));
