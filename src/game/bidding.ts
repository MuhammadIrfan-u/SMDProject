// Bidding phase: pass or bid 8-13, then find the bidder.
import { Game, PLAYER_NAMES } from './types';

export function highestBid(game: Game) {
  let highest = 0;
  for (const b of game.bids) {
    if (b !== null && b > highest) highest = b;
  }
  return highest;
}

// amount = 0 means pass
export function placeBid(game: Game, amount: number): Game {
  const bids = [...game.bids];
  bids[game.turn] = amount;
  const name = PLAYER_NAMES[game.turn];
  const text = amount === 0 ? name + ' passed.' : name + ' bid ' + amount + '.';

  // Not everyone has bid yet: next player
  if (game.turn < 3) {
    return { ...game, bids, turn: game.turn + 1, message: text };
  }

  // Everyone has bid: find the winner of the bidding
  let bidder = 0;
  let bid = 8; // if everybody passes, the first player bids 8
  let best = 0;
  for (let p = 0; p < 4; p++) {
    const b = bids[p] as number;
    if (b > best) {
      best = b;
      bidder = p;
      bid = b;
    }
  }
  return {
    ...game,
    bids,
    bidder,
    bid,
    phase: 'trump',
    turn: bidder,
    message: text + ' ' + PLAYER_NAMES[bidder] + ' will choose the rang.',
  };
}
