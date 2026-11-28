# Rang: Rules-to-Code Reference

This folder explains each rule of Rang and shows the code that implements it: the file, the function and the line numbers.
The rules come from the project [README](../README.md), which is based on [SuitSaga Arena, Rang Rules](https://502-game.vercel.app/rang-rules).

## Where the code lives

| Folder | What it holds |
|--------|---------------|
| [src/game/](../src/game/) | Pure game logic with no UI. Each function takes a `Game` and returns a new `Game`. |
| [src/components/game/](../src/components/game/) | React Native screens and widgets that show the game and pass taps to the logic. |
| [src/app/index.tsx](../src/app/index.tsx) | The Expo Router home route, which mounts `GameScreen`. |

## Concepts

| # | Concept | Main file |
|---|---------|-----------|
| 1 | [Players, teams, cards and game state](01-players-teams-state.md) | `types.ts` |
| 2 | [Shuffling and dealing](02-dealing.md) | `deal.ts` |
| 3 | [Bidding](03-bidding.md) | `bidding.ts` |
| 4 | [Choosing the rang (hidden trump)](04-choosing-rang.md) | `rang.ts` |
| 5 | [Playing tricks and following suit](05-playing-tricks.md) | `tricks.ts` |
| 6 | [Revealing the rang](06-revealing-rang.md) | `rang.ts` |
| 7 | [Who wins a trick](07-trick-winner.md) | `tricks.ts` |
| 8 | [Collecting tricks and the middle pile](08-pile-collection.md) | `tricks.ts` |
| 9 | [End of hand and winning](09-winning.md) | `tricks.ts`, `ResultCard.tsx` |
| 10 | [Computer players (bots)](10-bots.md) | `bots.ts` |
| 11 | [Game loop and UI wiring](11-game-loop-ui.md) | `GameScreen.tsx` |
| 12 | [Verification: rule-by-rule check](12-verification.md) | all |

## Game flow

```
newGame()                 phase 'bid'     deal.ts
  └─ placeBid() x4        phase 'trump'   bidding.ts
      └─ chooseTrump()    phase 'play'    rang.ts
          ├─ playCard() x4                tricks.ts
          ├─ revealRang() (optional)      rang.ts
          └─ finishTrick() x13 ──► phase 'over'   tricks.ts
                └─ biddersWon()           tricks.ts
```
