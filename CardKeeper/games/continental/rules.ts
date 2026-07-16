export type ContinentalCombinationType =
  | 'trio'
  | 'straight';

export type ContinentalCombination = {
  type: ContinentalCombinationType;
  amount: number;
};

export type ContinentalRoundRule = {
  number: number;
  cardsDealt: number;
  combinations: ContinentalCombination[];
  closingScore: number;
};

export const CONTINENTAL_ROUNDS: ContinentalRoundRule[] = [
  {
    number: 1,
    cardsDealt: 6,
    combinations: [
      { type: 'trio', amount: 2 },
    ],
    closingScore: -10,
  },
  {
    number: 2,
    cardsDealt: 7,
    combinations: [
      { type: 'trio', amount: 1 },
      { type: 'straight', amount: 1 },
    ],
    closingScore: -20,
  },
  {
    number: 3,
    cardsDealt: 8,
    combinations: [
      { type: 'straight', amount: 2 },
    ],
    closingScore: -30,
  },
  {
    number: 4,
    cardsDealt: 9,
    combinations: [
      { type: 'trio', amount: 3 },
    ],
    closingScore: -40,
  },
  {
    number: 5,
    cardsDealt: 10,
    combinations: [
      { type: 'trio', amount: 2 },
      { type: 'straight', amount: 1 },
    ],
    closingScore: -50,
  },
  {
    number: 6,
    cardsDealt: 11,
    combinations: [
      { type: 'trio', amount: 1 },
      { type: 'straight', amount: 2 },
    ],
    closingScore: -60,
  },
  {
    number: 7,
    cardsDealt: 12,
    combinations: [
      { type: 'straight', amount: 3 },
    ],
    closingScore: -70,
  },
];

export const CONTINENTAL_TOTAL_ROUNDS =
  CONTINENTAL_ROUNDS.length;

export function getContinentalRoundRule(
  roundNumber: number,
): ContinentalRoundRule | undefined {
  return CONTINENTAL_ROUNDS.find(
    (round) => round.number === roundNumber,
  );
}
export function formatContinentalRoundLabel(
  roundNumber: number,
): string {
  const rule = getContinentalRoundRule(roundNumber);

  if (!rule) {
    return '';
  }

  return rule.combinations
    .map(({ type, amount }) => {
      if (type === 'trio') {
        return `${amount} ${
          amount === 1 ? 'trío' : 'tríos'
        }`;
      }

      return `${amount} ${
        amount === 1 ? 'escalera' : 'escaleras'
      }`;
    })
    .join(' y ');
}