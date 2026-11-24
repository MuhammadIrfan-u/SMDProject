// Playing tricks: following suit, finding the trick winner, collecting tricks and the pile.
import { Card, Game, PLAYER_NAMES } from './types';

export function leadSuit(game: Game) {
  if (game.trick.length === 0) return '';
  return game.trick[0].card.suit;
}

// Cards the player is allowed to play (must follow suit if possible)
export function legalCards(game: Game, player: number) {
  const hand = game.hands[player];
  const lead = leadSuit(game);
  if (lead === '') return hand;
  const sameSuit = hand.filter((c) => c.suit === lead);
  return sameSuit.length > 0 ? sameSuit : hand;
}

export function playCard(game: Game, player: number, card: Card): Game {
  const hands = game.hands.map((h) => [...h]);
  hands[player] = hands[player].filter((c) => !(c.suit === card.suit && c.rank === card.rank));
  const trick = [...game.trick, { player, card, revealed: game.revealed }];
  const message = PLAYER_NAMES[player] + ' played.';
  if (trick.length === 4) {
    return { ...game, hands, trick, turn: -1, message };
  }
  return { ...game, hands, trick, turn: (player + 1) % 4, message };
}

// Who wins the 4 cards on the table?
// A trump card only beats other suits if the rang was already revealed when it was played
// (or if trump is the suit that was led).
function trickWinner(game: Game) {
  const lead = leadSuit(game);
  let best = game.trick[0];
  for (const play of game.trick) {
    const a = play.card;
    const b = best.card;
    const aTrump = a.suit === game.trump && (play.revealed || a.suit === lead);
    const bTrump = b.suit === game.trump && (best.revealed || b.suit === lead);
    if (aTrump && !bTrump) {
      best = play;
    } else if (aTrump && bTrump && a.rank > b.rank) {
      best = play;
    } else if (!aTrump && !bTrump && a.suit === lead && b.suit !== lead) {
      best = play;
    } else if (!aTrump && !bTrump && a.suit === lead && b.suit === lead && a.rank > b.rank) {
      best = play;
    }
  }
  return best.player;
}

// Called after the 4th card: gives the trick to someone and starts the next one.
export function finishTrick(game: Game): Game {
  const winner = trickWinner(game);
  const team = winner % 2;
  const tricks = [...game.tricks];
  let pile = game.pile;
  let lastPileWinner = game.lastPileWinner;
  let message = PLAYER_NAMES[winner] + ' won the trick.';

  if (!game.revealed) {
    // Before the reveal the winning team keeps the trick straight away
    tricks[team] += 1;
  } else {
    // After the reveal tricks go to the middle pile
    pile += 1;
    if (lastPileWinner === winner) {
      // same player won twice in a row: takes the whole pile
      tricks[team] += pile;
      message = PLAYER_NAMES[winner] + ' won twice in a row and takes ' + pile + ' tricks!';
      pile = 0;
      lastPileWinner = -1;
    } else {
      lastPileWinner = winner;
    }
  }

  const tricksPlayed = game.tricksPlayed + 1;
  if (tricksPlayed === 13) {
    // leftover pile goes to the winner of the last trick
    tricks[team] += pile;
    return { ...game, tricks, pile: 0, tricksPlayed, trick: [], phase: 'over', turn: -1, message: 'Hand finished!' };
  }
  // Before the last trick the bidder takes the face-down card back into their hand
  let hands = game.hands;
  let hiddenCard = game.hiddenCard;
  if (tricksPlayed === 12 && hiddenCard) {
    hands = game.hands.map((h) => [...h]);
    hands[game.bidder].push(hiddenCard);
    hiddenCard = null;
  }
  return { ...game, hands, hiddenCard, tricks, pile, lastPileWinner, tricksPlayed, trick: [], turn: winner, message };
}

// Did the bidding team reach its bid?
export function biddersWon(game: Game) {
  return game.tricks[game.bidder % 2] >= game.bid;
}
