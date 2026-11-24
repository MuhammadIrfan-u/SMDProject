// Shared types and constants for the Rang game.
// Players: 0 = You (bottom), 1 = West (left), 2 = North (top, your partner), 3 = East (right)
// Play goes clockwise: 0 -> 1 -> 2 -> 3 -> 0.  Teams: players 0 & 2 vs players 1 & 3.

export type Card = { suit: string; rank: number };
// revealed = was the rang already revealed when this card was played?
export type Played = { player: number; card: Card; revealed: boolean };

export type Game = {
  phase: 'bid' | 'trump' | 'play' | 'over';
  hands: Card[][];
  turn: number; // whose turn it is (-1 = waiting for a trick to be collected)
  bids: (number | null)[]; // null = not yet, 0 = pass
  bidder: number;
  bid: number;
  trump: string; // the rang suit (secret until revealed)
  hiddenCard: Card | null; // the bidder's face-down card that marks the rang
  revealed: boolean;
  trick: Played[]; // cards on the table right now
  pile: number; // tricks waiting in the middle after the reveal
  lastPileWinner: number; // who won the last trick that went into the pile (-1 = nobody)
  tricks: number[]; // tricks won by team 0 and team 1
  tricksPlayed: number;
  message: string;
};

export const SUITS = ['♠', '♥', '♣', '♦'];
export const PLAYER_NAMES = ['You', 'West', 'North', 'East'];

export function rankName(rank: number) {
  if (rank === 14) return 'A';
  if (rank === 13) return 'K';
  if (rank === 12) return 'Q';
  if (rank === 11) return 'J';
  return String(rank);
}
