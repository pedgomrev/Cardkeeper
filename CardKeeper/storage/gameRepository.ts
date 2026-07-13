import type { Game } from '@/models';

export interface GameRepository {
  save(game: Game): Promise<void>;
  findById(gameId: string): Promise<Game | null>;
  findAll(): Promise<Game[]>;
  delete(gameId: string): Promise<void>;
}