/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export enum GameStatus {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  SHOP = 'SHOP',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY'
}

export enum GameDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum GameTheme {
  NEON = 'NEON',
  DESERT = 'DESERT',
  OCEAN = 'OCEAN'
}

export enum AvatarStyle {
  ROBOT = 'ROBOT',
  CYBERPUNK = 'CYBERPUNK',
  ALIEN = 'ALIEN'
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export const THEMES: Record<GameTheme, ThemeColors> = {
  [GameTheme.NEON]: {
    primary: '#00ffff',
    secondary: '#ff00ff',
    accent: '#ffff00',
    background: '#050011'
  },
  [GameTheme.DESERT]: {
    primary: '#ffaa00',
    secondary: '#ff4400',
    accent: '#ffff00',
    background: '#221100'
  },
  [GameTheme.OCEAN]: {
    primary: '#00ffaa',
    secondary: '#0044ff',
    accent: '#ffffff',
    background: '#001122'
  }
};

export enum ObjectType {
  OBSTACLE = 'OBSTACLE',
  GEM = 'GEM',
  LETTER = 'LETTER',
  SHOP_PORTAL = 'SHOP_PORTAL',
  ALIEN = 'ALIEN',
  MISSILE = 'MISSILE',
  LASER = 'LASER',
  LIFE = 'LIFE',
  HOLE = 'HOLE',
  PLAYER_BOLT = 'PLAYER_BOLT',
  PLATFORM = 'PLATFORM'
}

export interface GameObject {
  id: string;
  type: ObjectType;
  position: [number, number, number]; // x, y, z
  active: boolean;
  value?: string; // For letters (G, E, M...)
  color?: string;
  targetIndex?: number; // Index in the COSMOS target word
  points?: number; // Score value for gems
  hasFired?: boolean; // For Aliens
}

export const LANE_WIDTH = 2.2;
export const JUMP_HEIGHT = 2.5;
export const JUMP_DURATION = 0.6; // seconds
export const RUN_SPEED_BASE = 22.5;
export const SPAWN_DISTANCE = 120;
export const REMOVE_DISTANCE = 20; // Behind player

// Synthwave Neon Colors
export const COSMOS_COLORS = [
    '#00ffff', // C - Cyan
    '#ff00ff', // O - Magenta
    '#ffff00', // S - Yellow
    '#00ff00', // M - Green
    '#ff5500', // O - Orange
    '#ffffff', // S - White
];

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    cost: number;
    icon: any; // Lucide icon component
    oneTime?: boolean; // If true, remove from pool after buying
}
