// Choosing the rang (hidden trump card) and revealing it.
import { sortHand } from './deal';
import { Card, Game, PLAYER_NAMES } from './types';
import { leadSuit } from './tricks';

// The bidder puts one of their first 5 cards face down. Its suit is the rang.
export function chooseTrump(game: Game, card: Card): Game {
  const hands = game.hands.map((h) => [...h]);
  hands[game.bidder] = hands[game.bidder].filter((c) => !(c.suit === card.suit && c.rank === card.rank));
  // the remaining cards are dealt now, so everyone holds 13 cards
  // (the bidder holds 12 plus the face-down card)
  for (const hand of hands) sortHand(hand);
  return {
    ...game,
    hands,
    hiddenCard: card,
    trump: card.suit,
    phase: 'play',
    turn: game.bidder,
    message: PLAYER_NAMES[game.bidder] + ' placed the rang card face down and leads.',
  };
}

// Can the current player reveal the rang?
// The bidder can at any time. Any other player only when they cannot follow the led suit.
export function canReveal(game: Game, player: number) {
  if (game.phase !== 'play' || game.revealed) return false;
  if (player === game.bidder) return true;
  const lead = leadSuit(game);
  if (lead === '') return false;
  return !game.hands[player].some((c) => c.suit === lead);
}

// Turns the face-down card over. It goes back into the bidder's hand.
export function revealRang(game: Game, player: number): Game {
  const hands = game.hands.map((h) => [...h]);
  if (game.hiddenCard) {
    hands[game.bidder].push(game.hiddenCard);
    sortHand(hands[game.bidder]);
  }
  return {
    ...game,
    hands,
    hiddenCard: null,
    revealed: true,
    message: PLAYER_NAMES[player] + ' revealed the rang: ' + game.trump,
  };
}
