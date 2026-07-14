import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Game } from '@/models';

import type { GameRepository } from './GameRepository';

const GAMES_STORAGE_KEY = '@cardkeeper/games';

export class AsyncStorageGameRepository
  implements GameRepository
{
  async save(game: Game): Promise<void> {
    const games = await this.findAll();

    const existingGameIndex = games.findIndex(
      (storedGame) => storedGame.id === game.id,
    );

    const updatedGames =
      existingGameIndex === -1
        ? [...games, game]
        : games.map((storedGame) =>
            storedGame.id === game.id
              ? game
              : storedGame,
          );

    await this.writeGames(updatedGames);
  }

  async findById(
    gameId: string,
  ): Promise<Game | null> {
    const games = await this.findAll();

    return (
      games.find((game) => game.id === gameId) ??
      null
    );
  }

  async findAll(): Promise<Game[]> {
    const storedValue = await AsyncStorage.getItem(
      GAMES_STORAGE_KEY,
    );

    if (!storedValue) {
      return [];
    }

    try {
      const parsedValue: unknown =
        JSON.parse(storedValue);

      if (!Array.isArray(parsedValue)) {
        return [];
      }

      return parsedValue as Game[];
    } catch {
      return [];
    }
  }

  async findActive(): Promise<Game | null> {
    const games = await this.findAll();

    const activeGames = games
      .filter(
        (game) => game.status === 'in_progress',
      )
      .sort(
        (firstGame, secondGame) =>
          new Date(secondGame.updatedAt).getTime() -
          new Date(firstGame.updatedAt).getTime(),
      );

    return activeGames[0] ?? null;
  }

  async delete(gameId: string): Promise<void> {
    const games = await this.findAll();

    const remainingGames = games.filter(
      (game) => game.id !== gameId,
    );

    await this.writeGames(remainingGames);
  }

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(
      GAMES_STORAGE_KEY,
    );
  }

  private async writeGames(
    games: Game[],
  ): Promise<void> {
    await AsyncStorage.setItem(
      GAMES_STORAGE_KEY,
      JSON.stringify(games),
    );
  }
}

export const gameRepository =
  new AsyncStorageGameRepository();