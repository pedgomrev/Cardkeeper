import type { GameDefinition } from '../core/GameDefinition';
import { GAME_TYPES } from '../core/types';

export const continentalDefinition = {
  id: GAME_TYPES.CONTINENTAL,
  name: 'Continental',
  shortDescription:
    'Completa las combinaciones de cada ronda y termina con la menor puntuación posible.',
  minimumPlayers: 3,
  maximumPlayers: 6,
ruleSections: [
  {
    title: 'Objetivo',
    content: [
      'La partida se juega a lo largo de siete rondas. En cada ronda debe completarse una combinación concreta de tríos y escaleras.',
      'Al finalizar la partida, gana el jugador que tenga menos puntos acumulados.',
    ],
  },
  {
    title: 'Preparación',
    content: [
      'Se recomienda jugar con un mínimo de tres jugadores y un máximo de seis.',
      'Para tres o cuatro jugadores se utilizan dos barajas españolas. Con cinco o seis jugadores se utilizan tres barajas.',
      'En la primera ronda se reparten seis cartas a cada jugador. En cada ronda posterior se reparte una carta más, hasta llegar a doce cartas en la séptima ronda.',
      'Se elige al jugador que comienza y los turnos continúan en el sentido de las agujas del reloj.',
    ],
  },
  {
    title: 'Desarrollo del turno',
    content: [
      'En su turno, el jugador debe robar una carta del mazo o tomar la primera carta de la pila de descarte.',
      'Después de robar, debe descartar una carta para finalizar su turno.',
      'Un jugador puede tomar una carta descartada fuera de su turno. Como penalización, también debe robar una carta adicional del mazo.',
      'La carta adicional se mantiene durante el resto de la ronda, por lo que el jugador tendrá una carta más de lo habitual hasta que consiga colocarla en alguna combinación.',
    ],
  },
  {
    title: 'Bajar combinaciones y cerrar la ronda',
    content: [
      'Cuando un jugador completa la combinación correspondiente a la ronda, puede bajarla a la mesa durante su turno.',
      'Para cerrar la ronda, el jugador debe robar una carta, bajar su combinación completa y utilizar como descarte final una carta con valor inferior o igual a cinco.',
      'La carta utilizada para cerrar se coloca boca abajo sobre la pila de descarte para indicar que la ronda ha terminado.',
      'Si el jugador tiene cartas adicionales por haber robado fuera de su turno, puede bajar su combinación, pero no podrá cerrar hasta colocar las cartas restantes en combinaciones propias o de otros jugadores.',
      'Después de bajar una combinación, las cartas restantes pueden añadirse a otras combinaciones que ya estén sobre la mesa.',
    ],
  },
  {
    title: 'Rondas',
    content: [
      '1.ª ronda: 2 tríos. Se reparten 6 cartas.',
      '2.ª ronda: 1 trío y 1 escalera. Se reparten 7 cartas.',
      '3.ª ronda: 2 escaleras. Se reparten 8 cartas.',
      '4.ª ronda: 3 tríos. Se reparten 9 cartas.',
      '5.ª ronda: 2 tríos y 1 escalera. Se reparten 10 cartas.',
      '6.ª ronda: 1 trío y 2 escaleras. Se reparten 11 cartas.',
      '7.ª ronda: 3 escaleras. Se reparten 12 cartas.',
    ],
  },
  {
    title: 'Puntuación',
    content: [
      'Cartas del 2 al 9: 5 puntos.',
      'Figuras —sota, caballo y rey—: 10 puntos.',
      'Ases: 20 puntos.',
      'Comodines: 50 puntos.',
      'El jugador que cierra obtiene una puntuación negativa según la ronda: -10 en la primera, -20 en la segunda y así sucesivamente hasta -70 en la séptima.',
      'El resto de jugadores suma los puntos correspondientes a las cartas que conserve en la mano.',
    ],
  },
  {
    title: 'Continental y final de la partida',
    content: [
      'Después de la séptima ronda, gana el jugador que tenga menos puntos acumulados.',
      'Si un jugador cierra la séptima ronda sin haber robado fuera de su turno, consigue un Continental y gana inmediatamente la partida.',
    ],
  },
  ],
} satisfies GameDefinition;