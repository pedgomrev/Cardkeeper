import type { GameDefinition } from '../core/GameDefinition';
import { GAME_TYPES } from '../core/types';

export const maumauDefinition = {
  id: GAME_TYPES.MAUMAU,
  name: 'MauMau',
  shortDescription:
    'Completa cada ronda y termina con la menor puntuación posible.',
  minimumPlayers: 3,
  maximumPlayers: 6,
ruleSections: [
  {
    title: 'Objetivo',
    content: [
      'La partida se juega hasta que solo queda un jugador con menos puntos que el límite. En cada ronda debe completarse una combinación de tríos y escaleras.',
      'Al finalizar la partida, gana el jugador que tenga menos puntos acumulados.',
    ],
  },
  {
    title: 'Preparación',
    content: [
      'Se recomienda jugar con un mínimo de tres jugadores y un máximo de seis.',
      'Para tres o cuatro jugadores se utilizar una baraja española. Con cinco o seis jugadores se utilizan dos barajas.',
      'En cada ronda se reparten siete cartas a cada jugador.',
      'Se elige al jugador que comienza y los turnos continúan en el sentido de las agujas del reloj.',
    ],
  },
  {
    title: 'Desarrollo del turno',
    content: [
      'En su turno, el jugador debe robar una carta del mazo o tomar la primera carta de la pila de descarte.',
      'Después de robar, debe descartar una carta para finalizar su turno.',
    ],
  },
  {
    title: 'Bajar combinaciones y cerrar la ronda',
    content: [
      'Cuando un jugador completa las combinaciones.',
      'Para cerrar la ronda, el jugador debe robar una carta, bajar su combinación completa y utilizar como descarte final una carta con valor inferior o igual a cinco.',
      'La carta utilizada para cerrar se coloca boca abajo sobre la pila de descarte para indicar que la ronda ha terminado.',
      'Después de bajar la combinación, las cartas restantes de los otros jugadores pueden añadirse a la que esté sobre la mesa.',
      'Como añadido un jugador puede cerrar sin tener la combinación entera, puntuando solo las cartas que no entren en la combinación completa'
    ],
  },
  {
    title: 'Rondas',
    content: [
      'En cada ronda los jugadores deberán hacer una de estas combinaciones:',
      'Trío y cuarteto.',
      'Trío y escalera.',
      'Cuarteto y escalera de 3',
      'Escalera completa.'
    ],
  },
  {
    title: 'Puntuación',
    content: [
      'Cartas del 1 al 9: Su valor.',
      'Figuras —sota, caballo y rey—: 10 puntos.',
      'Comodines: 20 puntos.',
      'El jugador que cierra obtiene una puntuación negativa según la combinación con la que cierra: -25 para la escalera completa, -10 en el resto de casos',
      'El resto de jugadores suma los puntos correspondientes a las cartas que conserve en la mano.',
    ],
  },
  {
    title: 'Continental y final de la partida',
    content: [
      'El juego termina cuando solo queda un jugador con menos de la puntuación límite establecida',
    ],
  },
  ],
} satisfies GameDefinition;