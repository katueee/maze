export type Theme = {
  name: string;
  emoji: string;
  character: string;
  goal: string;
  bgColor: string;
  wallColor: string;
  pathColor: string;
  accentColor: string;
};

export const THEMES: Theme[] = [
  {
    name: 'おやつの森',
    emoji: '🍪',
    character: '🐰',
    goal: '🥕',
    bgColor: '#FFF8E7',
    wallColor: '#C8956C',
    pathColor: '#FFF3D6',
    accentColor: '#FF9A5C',
  },
  {
    name: 'キャンディランド',
    emoji: '🍬',
    character: '🐱',
    goal: '🍰',
    bgColor: '#FFF0F5',
    wallColor: '#E8A0BF',
    pathColor: '#FFE4F0',
    accentColor: '#FF69B4',
  },
  {
    name: 'どうぶつのおうち',
    emoji: '🏠',
    character: '🐶',
    goal: '🏠',
    bgColor: '#F0FFF0',
    wallColor: '#8FBC8F',
    pathColor: '#E8FFE8',
    accentColor: '#66BB6A',
  },
  {
    name: '星空の道',
    emoji: '⭐',
    character: '🐻',
    goal: '⭐',
    bgColor: '#F0F0FF',
    wallColor: '#9E9ECC',
    pathColor: '#E8E8FF',
    accentColor: '#7B68EE',
  },
  {
    name: 'プレゼント島',
    emoji: '🎁',
    character: '🐥',
    goal: '🎁',
    bgColor: '#FFFFF0',
    wallColor: '#DAA520',
    pathColor: '#FFFDE8',
    accentColor: '#FFD700',
  },
];

export function getRandomTheme(): Theme {
  return THEMES[Math.floor(Math.random() * THEMES.length)];
}
