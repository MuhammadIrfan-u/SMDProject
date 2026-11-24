// Shuffling and dealing the cards, and starting a fresh game.
import { Card, Game, SUITS } from './types';

// Creates a new shuffled game and deals 13 cards to every player.
export function newGame(): Game {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let rank = 2; rank <= 14; rank++) {
      deck.push({ suit, rank });
    }
  }
  // shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  const hands: Card[][] = [[], [], [], []];
  for (let p = 0; p < 4; p++) {
    const first = deck.slice(p * 13, p * 13 + 5); // the 5 cards seen while bidding
    const rest = deck.slice(p * 13 + 5, p * 13 + 13); // the other 8 come after the rang is chosen
    sortHand(first);
    hands[p] = [...first, ...rest];
  }
  return {
    phase: 'bid',
    hands,
    turn: 0,
    bids: [null, null, null, null],
    bidder: 0,
    bid: 0,
    trump: '',
    hiddenCard: null,
    revealed: false,
    trick: [],
    pile: 0,
    lastPileWinner: -1,
    tricks: [0, 0],
    tricksPlayed: 0,
    message: 'Look at your first 5 cards, then bid or pass.',
  };
}

// Sort by suit, then high to low. (Sorts the array itself.)
export function sortHand(hand: Card[]) {
  hand.sort((a, b) => {
    if (a.suit !== b.suit) return SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
    return b.rank - a.rank;
  });
}

// The first 5 cards are the only ones visible during bidding.
export function firstFive(hand: Card[]) {
  return hand.slice(0, 5);
}
