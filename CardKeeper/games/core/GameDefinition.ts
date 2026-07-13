import type { GameType } from './types';

export type RuleSection = {
  title: string;
  content: string[];
};

export type GameDefinition = {
  id: GameType;
  name: string;
  shortDescription: string;
  minimumPlayers: number;
  maximumPlayers?: number;
  ruleSections: RuleSection[];
};