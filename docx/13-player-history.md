# 13. Player Name and Game History (Firebase)

**Files:**
- [src/firebase/config.ts](../src/firebase/config.ts): Firebase and Firestore setup
- [src/firebase/players.ts](../src/firebase/players.ts): every read and write
- [src/hooks/use-game-recorder.ts](../src/hooks/use-game-recorder.ts): saves the game as it moves through its phases
- [src/components/player/NameScreen.tsx](../src/components/player/NameScreen.tsx): asks for the name
- [src/components/player/HistoryScreen.tsx](../src/components/player/HistoryScreen.tsx): shows totals and past games
- Routes: [src/app/index.tsx](../src/app/index.tsx) (name), [src/app/game.tsx](../src/app/game.tsx) (game), [src/app/history.tsx](../src/app/history.tsx) (history)

## Rules

- The player enters a name before the game starts.
- The name is **unique**: one name is one player. There is no login. Entering a name that already exists continues that player's history.
- A player has **many games**. For each game we store its status, every bid, the winning bid, and whether that bid was made.

## Names: [players.ts](../src/firebase/players.ts)

| Function | What it does |
|----------|--------------|
| `validateName()` | 2–20 characters: letters, numbers, spaces, `-` and `_` |
| `playerIdFromName()` | Builds the unique id from the trimmed name, lower-cased, with spaces turned into `-`. `"Irfan"`, `" irfan "` and `"IRFAN"` all become `irfan`. |
| `getOrCreatePlayer()` | Reads `players/{id}`. If it exists, the player is returning. Otherwise it creates the document with all totals at 0. |

## Firestore structure

```
players/{playerId}
  name            "Irfan"        (spelling of the first sign-up)
  createdAt, lastPlayedAt
  gamesPlayed     finished games
  gamesWon
  gamesLost
  bidsPlaced      games where you bid (did not pass)
  bidsWon         games where you were the bidder and your team made the bid

players/{playerId}/games/{gameId}
  status          'in-progress' | 'won' | 'lost' | 'abandoned'
  startedAt, finishedAt
  bids            [{ seat: 0, name: "Irfan", amount: 9 }, { seat: 1, name: "West", amount: 0 }, ...]   0 = pass
  winningBid      { seat, name, amount }
  myTeamBid       true if you or your partner won the bidding
  bidWon          did the bidding team reach its bid?
  myBidWon        same as bidWon, but only when you were the bidder (otherwise null)
  tricks          { myTeam, opponents }
  trump           the rang suit
```

## When each write happens: [use-game-recorder.ts](../src/hooks/use-game-recorder.ts)

| Moment | Function | Writes |
|--------|----------|--------|
| A new hand is dealt | `startGame()` | A new game document with `status: 'in-progress'` |
| Bidding ends (phase leaves `'bid'`) | `saveBids()` | `bids`, `winningBid`, `myTeamBid`. Adds 1 to `bidsPlaced` if you bid. |
| All 13 tricks are played | `finishGame()` | `status` won or lost, `bidWon`, `myBidWon`, `tricks`, `trump`. Updates the player's totals with `increment()`. |
| Restart or Play Again before the hand ends | `abandonGame()` | `status: 'abandoned'` |

A game you close without finishing stays `'in-progress'`.

The hook keeps a ref for the current hand, so each write happens only once, even when React re-runs effects.
If Firebase can't be reached, the game still plays and the error is only logged.

## Screens

1. **Name screen** (`/`): type a name, then **Continue**. You see either *Welcome* or *Welcome back* with your totals, then **Start Game**, **View History**, or **Not you?**
2. **Game** (`/game?player=…&name=…`): the header shows your name and has **History** and **Restart** buttons.
3. **History** (`/history?player=…`): your totals, then your games newest first, each with its status, every bid, the winning bid and whether it was made, and the tricks and rang.

## Firestore setup (one-time, in the Firebase console)

1. Create a **Firestore Database** in project `rang-9934a`.
2. With no authentication, the security rules must allow these paths without a sign-in:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /players/{playerId} {
      allow read, create, update: if true;
      allow delete: if false;
      match /games/{gameId} {
        allow read, create, update: if true;
        allow delete: if false;
      }
    }
  }
}
```

> Without login, anyone who knows a name can play as that player. That is the trade-off of "unique name, no authentication".

## Analytics

`getAnalytics()` is only enabled where `isSupported()` returns true, which means web browsers. The Firebase JS SDK does not support Analytics on iOS or Android.
