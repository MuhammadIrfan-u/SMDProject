// The computer players (West, North and East). They only look at their own cards.
import { highestBid } from './bidding';
import { firstFive } from './deal';
import { canReveal, revealRang } from './rang';
import { legalCards, leadSuit, playCard } from './tricks';
import { Game, SUITS } from './types';

// Bots bid when they have strong cards (J, Q, K, A) in their first 5.
export function botBid(game: Game) {
  const hand = firstFive(game.hands[game.turn]);
  let strong = 0;
  for (const card of hand) {
    if (card.rank >= 11) strong++;
  }
  const want = 8 + (strong - 3);
  if (strong >= 3 && want > highestBid(game)) return want;
  return 0;
}

// The bot picks the suit it has most of (in its first 5 cards) and hides its lowest card of that suit.
export function botTrump(game: Game) {
  const hand = firstFive(game.hands[game.turn]);
  let bestSuit = SUITS[0];
  let bestCount = -1;
  for (const suit of SUITS) {
    const count = hand.filter((c) => c.suit === suit).length;
    if (count > bestCount) {
      bestCount = count;
      bestSuit = suit;
    }
  }
  let chosen = hand.filter((c) => c.suit === bestSuit)[0];
  for (const c of hand) {
    if (c.suit === bestSuit && c.rank < chosen.rank) chosen = c;
  }
  return chosen;
}

// A bot's whole move: reveal if it can't follow suit, then play a card.
export function botMove(game: Game): Game {
  let g = game;
  const lead0 = leadSuit(g);
  const cannotFollow = lead0 !== '' && !g.hands[g.turn].some((c) => c.suit === lead0);
  if (cannotFollow && canReveal(g, g.turn)) g = revealRang(g, g.turn);
  const legal = legalCards(g, g.turn);
  const lead = leadSuit(g);
  let chosen = legal[0];
  if (lead === '' || chosen.suit === lead) {
    // leading or following suit: play the highest card
    for (const c of legal) {
      if (c.rank > chosen.rank) chosen = c;
    }
  } else {
    // cannot follow suit: play the lowest trump if the rang is known, otherwise the lowest card
    const trumps = legal.filter((c) => g.revealed && c.suit === g.trump);
    const pool = trumps.length > 0 ? trumps : legal;
    chosen = pool[0];
    for (const c of pool) {
      if (c.rank < chosen.rank) chosen = c;
    }
  }
  return playCard(g, g.turn, chosen);
}
