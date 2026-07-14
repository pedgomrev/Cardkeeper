import {
    createContext,
    useContext,
    useMemo,
    useState,
} from 'react';

import type { Game } from '@/models';

type GameContextValue = {
  activeGame: Game | null;
  setActiveGame: (game: Game | null) => void;
  updateActiveGame: (game: Game) => void;
};

const GameContext = createContext<GameContextValue | null>(
  null,
);

type GameProviderProps = {
  children: React.ReactNode;
};

export function GameProvider({
  children,
}: GameProviderProps) {
  const [activeGame, setActiveGame] =
    useState<Game | null>(null);

  const value = useMemo<GameContextValue>(
    () => ({
      activeGame,
      setActiveGame,
      updateActiveGame: setActiveGame,
    }),
    [activeGame],
  );

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext(): GameContextValue {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error(
      'useGameContext debe utilizarse dentro de GameProvider.',
    );
  }

  return context;
}