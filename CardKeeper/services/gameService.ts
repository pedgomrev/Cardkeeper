import type { Game } from '@/models';
import { gameRepository } from '@/storage/AsyncStorageGameRepository';
import type { GameRepository } from '@/storage/GameRepository';

export class GameService {
  constructor(
    private readonly repository: GameRepository,
  ) {}

  async saveGame(game: Game): Promise<void> {
    await this.repository.save(game);
  }

  async getGameById(
    gameId: string,
  ): Promise<Game | null> {
    return this.repository.findById(gameId);
  }

  async getAllGames(): Promise<Game[]> {
    const games = await this.repository.findAll();

    return [...games].sort(
      (firstGame, secondGame) =>
        new Date(secondGame.updatedAt).getTime() -
        new Date(firstGame.updatedAt).getTime(),
    );
  }

  async getActiveGame(): Promise<Game | null> {
    return this.repository.findActive();
  }

  async deleteGame(gameId: string): Promise<void> {
    await this.repository.delete(gameId);
  }

  async clearGames(): Promise<void> {
    await this.repository.clear();
  }
}

export const gameService =
  new GameService(gameRepository);