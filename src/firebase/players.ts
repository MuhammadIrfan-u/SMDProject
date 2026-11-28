// Reading and writing players and their game history in Firestore.
//
// Data structure:
//   players/{playerId}                 one document per unique name
//     name, createdAt, lastPlayedAt,
//     gamesPlayed, gamesWon, gamesLost, bidsPlaced, bidsWon
//   players/{playerId}/games/{gameId}  one document per game the player started
//     status: 'in-progress' | 'won' | 'lost' | 'abandoned'
//     startedAt, finishedAt
//     bids: [{ seat, name, amount }]   amount 0 = pass
//     winningBid: { seat, name, amount }
//     myTeamBid, bidWon, myBidWon, tricks: { myTeam, opponents }, trump
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';

import { biddersWon } from '@/game/tricks';
import { Game, PLAYER_NAMES } from '@/game/types';
import { db } from './config';

export type GameStatus = 'in-progress' | 'won' | 'lost' | 'abandoned';

export type Player = {
  id: string;
  name: string;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  bidsPlaced: number;
  bidsWon: number;
};

export type BidEntry = { seat: number; name: string; amount: number };

export type GameRecord = {
  id: string;
  status: GameStatus;
  startedAt: Date | null;
  finishedAt: Date | null;
  bids: BidEntry[];
  winningBid: BidEntry | null;
  myTeamBid: boolean | null;
  bidWon: boolean | null;
  myBidWon: boolean | null;
  tricks: { myTeam: number; opponents: number } | null;
  trump: string | null;
};

// ---------- names ----------

export const NAME_MIN = 2;
export const NAME_MAX = 20;

// Returns an error message, or '' if the name is fine.
export function validateName(raw: string) {
  const name = raw.trim();
  if (name.length < NAME_MIN) return `Name must be at least ${NAME_MIN} characters.`;
  if (name.length > NAME_MAX) return `Name must be at most ${NAME_MAX} characters.`;
  if (!/^[A-Za-z0-9 _-]+$/.test(name)) return 'Use only letters, numbers, spaces, - and _.';
  return '';
}

// The name is the unique key: "Irfan", " irfan " and "IRFAN" are the same player.
export function playerIdFromName(raw: string) {
  return raw.trim().toLowerCase().replace(/\s+/g, '-');
}

// ---------- players ----------

function playerRef(playerId: string) {
  return doc(db, 'players', playerId);
}

function toPlayer(id: string, data: Record<string, unknown>): Player {
  return {
    id,
    name: String(data.name ?? id),
    gamesPlayed: Number(data.gamesPlayed ?? 0),
    gamesWon: Number(data.gamesWon ?? 0),
    gamesLost: Number(data.gamesLost ?? 0),
    bidsPlaced: Number(data.bidsPlaced ?? 0),
    bidsWon: Number(data.bidsWon ?? 0),
  };
}

export async function getPlayer(playerId: string): Promise<Player | null> {
  const snap = await getDoc(playerRef(playerId));
  return snap.exists() ? toPlayer(snap.id, snap.data()) : null;
}

// Finds the player with this name, or creates them. A returning name continues the same history.
export async function getOrCreatePlayer(rawName: string): Promise<{ player: Player; isNew: boolean }> {
  const name = rawName.trim();
  const id = playerIdFromName(name);
  const existing = await getPlayer(id);
  if (existing) return { player: existing, isNew: false };

  const fresh = { name, gamesPlayed: 0, gamesWon: 0, gamesLost: 0, bidsPlaced: 0, bidsWon: 0 };
  await setDoc(playerRef(id), { ...fresh, createdAt: serverTimestamp(), lastPlayedAt: serverTimestamp() });
  return { player: { id, ...fresh }, isNew: true };
}

// ---------- games ----------

function gamesCol(playerId: string) {
  return collection(db, 'players', playerId, 'games');
}

function gameRef(playerId: string, gameId: string) {
  return doc(db, 'players', playerId, 'games', gameId);
}

function seatName(seat: number, playerName: string) {
  return seat === 0 ? playerName : PLAYER_NAMES[seat];
}

// Called when a new hand is dealt. Returns the new game's id.
export async function startGame(playerId: string): Promise<string> {
  const ref = await addDoc(gamesCol(playerId), {
    status: 'in-progress',
    startedAt: serverTimestamp(),
    finishedAt: null,
    bids: [],
    winningBid: null,
    myTeamBid: null,
    bidWon: null,
    myBidWon: null,
    tricks: null,
    trump: null,
  });
  await updateDoc(playerRef(playerId), { lastPlayedAt: serverTimestamp() });
  return ref.id;
}

// Called once bidding is over: stores every bid and who won the bidding.
export async function saveBids(playerId: string, playerName: string, gameId: string, game: Game) {
  const bids: BidEntry[] = game.bids.map((amount, seat) => ({ seat, name: seatName(seat, playerName), amount: amount ?? 0 }));
  await updateDoc(gameRef(playerId, gameId), {
    bids,
    winningBid: { seat: game.bidder, name: seatName(game.bidder, playerName), amount: game.bid },
    myTeamBid: game.bidder % 2 === 0,
  });
  if ((game.bids[0] ?? 0) > 0) {
    await updateDoc(playerRef(playerId), { bidsPlaced: increment(1) });
  }
}

// Called when all 13 tricks are played: stores the result and updates the player's totals.
export async function finishGame(playerId: string, gameId: string, game: Game) {
  const bidWon = biddersWon(game);
  const myTeamBid = game.bidder % 2 === 0;
  const won = bidWon === myTeamBid;
  const myBidWon = game.bidder === 0 ? bidWon : null;

  await updateDoc(gameRef(playerId, gameId), {
    status: won ? 'won' : 'lost',
    finishedAt: serverTimestamp(),
    bidWon,
    myBidWon,
    tricks: { myTeam: game.tricks[0], opponents: game.tricks[1] },
    trump: game.trump,
  });
  await updateDoc(playerRef(playerId), {
    gamesPlayed: increment(1),
    gamesWon: increment(won ? 1 : 0),
    gamesLost: increment(won ? 0 : 1),
    bidsWon: increment(myBidWon ? 1 : 0),
    lastPlayedAt: serverTimestamp(),
  });
}

// Called when the player deals a new hand before finishing the current one.
export async function abandonGame(playerId: string, gameId: string) {
  await updateDoc(gameRef(playerId, gameId), { status: 'abandoned', finishedAt: serverTimestamp() });
}

function toDate(value: unknown) {
  return value instanceof Timestamp ? value.toDate() : null;
}

// The player's most recent games, newest first.
export async function getHistory(playerId: string, max = 50): Promise<GameRecord[]> {
  const snap = await getDocs(query(gamesCol(playerId), orderBy('startedAt', 'desc'), limit(max)));
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      status: data.status as GameStatus,
      startedAt: toDate(data.startedAt),
      finishedAt: toDate(data.finishedAt),
      bids: (data.bids ?? []) as BidEntry[],
      winningBid: (data.winningBid ?? null) as BidEntry | null,
      myTeamBid: data.myTeamBid ?? null,
      bidWon: data.bidWon ?? null,
      myBidWon: data.myBidWon ?? null,
      tricks: data.tricks ?? null,
      trump: data.trump ?? null,
    };
  });
}
