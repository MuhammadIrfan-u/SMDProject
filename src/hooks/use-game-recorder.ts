// Saves the current game to Firebase as it moves through its phases:
// a new deal creates a game record, the end of bidding saves the bids,
// and the end of the hand saves the result.
import { useCallback, useEffect, useRef } from 'react';

import { abandonGame, finishGame, saveBids, startGame } from '@/firebase/players';
import { Game } from '@/game/types';

type Tracked = { id: Promise<string | null>; bidsSaved: boolean; finished: boolean };

function warn(err: unknown) {
  console.warn('Could not save game history:', err);
}

export function useGameRecorder(playerId: string, playerName: string, game: Game) {
  const record = useRef<Tracked | null>(null);

  useEffect(() => {
    // first render of a new deal: create its record
    if (record.current === null) {
      record.current = {
        id: startGame(playerId).catch((err) => {
          warn(err);
          return null;
        }),
        bidsSaved: false,
        finished: false,
      };
    }
    const r = record.current;
    if (!r.bidsSaved && game.phase !== 'bid') {
      r.bidsSaved = true;
      r.id.then((id) => (id ? saveBids(playerId, playerName, id, game) : undefined)).catch(warn);
    }
    if (!r.finished && game.phase === 'over') {
      r.finished = true;
      r.id.then((id) => (id ? finishGame(playerId, id, game) : undefined)).catch(warn);
    }
  }, [game, playerId, playerName]);

  // Call before dealing a new hand. An unfinished hand is marked as abandoned.
  const beginNewDeal = useCallback(() => {
    const r = record.current;
    if (r && !r.finished) {
      r.id.then((id) => (id ? abandonGame(playerId, id) : undefined)).catch(warn);
    }
    record.current = null;
  }, [playerId]);

  return beginNewDeal;
}
