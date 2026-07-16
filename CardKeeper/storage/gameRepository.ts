import type { Game } from '@/models';

export interface GameRepository {
  save(game: Game): Promise<void>;

  findById(gameId: string): Promise<Game | null>;

  findAll(): Promise<Game[]>;

  findActive(): Promise<Game | null>;

  delete(gameId: string): Promise<void>;

  clear(): Promise<void>;
}