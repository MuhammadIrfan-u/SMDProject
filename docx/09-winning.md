# 9. End of Hand and Winning

**Files:** [src/game/tricks.ts](../src/game/tricks.ts), [src/components/game/ResultCard.tsx](../src/components/game/ResultCard.tsx)

## Rules

- A hand has 13 tricks.
- The **bidding team wins** if it takes **at least** as many tricks as it bid. Otherwise the defending team wins.

## Implementation

| Rule | Code |
|------|------|
| End after 13 tricks | [tricks.ts:79-84](../src/game/tricks.ts#L79-L84): `phase: 'over'` |
| Bidding team wins on `tricks >= bid` | `biddersWon()` [tricks.ts:97-99](../src/game/tricks.ts#L97-L99) |
| Show the result | `ResultCard` [ResultCard.tsx:10-25](../src/components/game/ResultCard.tsx#L10-L25) |
| "You Win" if your team (0) is on the winning side | [ResultCard.tsx:11-13](../src/components/game/ResultCard.tsx#L11-L13): `bidderWon === (bidder % 2 === 0)` |
| Rang shown after the hand | [InfoBar.tsx:14](../src/components/game/InfoBar.tsx#L14) |
| Play again | `newGame()` from the ResultCard button or the header restart ([GameScreen.tsx:68](../src/components/game/GameScreen.tsx#L68), [GameScreen.tsx:82](../src/components/game/GameScreen.tsx#L82)) |

Each game is a single hand. There is no running score across hands.
