# 11. Game Loop and UI Wiring

**File:** [src/components/game/GameScreen.tsx](../src/components/game/GameScreen.tsx)

## State

`GameScreen` keeps the whole game in a single `useState(newGame())` ([line 22](../src/components/game/GameScreen.tsx#L22)). Every move replaces it with a new `Game` returned by a logic function.

The home route delays mounting until after the first render, so the random deal does not cause a server/client mismatch on web ([src/app/index.tsx:8-17](../src/app/index.tsx#L8-L17)).

## Automatic moves: `useEffect` [lines 25-42](../src/components/game/GameScreen.tsx#L25-L42)

| Condition | After | Calls |
|-----------|-------|-------|
| 4 cards on the table | 1.5 s | `finishTrick` |
| `turn >= 1` (a bot), phase `'bid'` | 0.9 s | `placeBid(g, botBid(g))` |
| `turn >= 1`, phase `'trump'` | 0.9 s | `chooseTrump(g, botTrump(g))` |
| `turn >= 1`, phase `'play'` | 0.9 s | `botMove(g)` |
| phase `'over'` | n/a | stops |

## Human actions

| Action | Shown when | Lines |
|--------|-----------|-------|
| Bid buttons | phase `'bid'` and your turn | [77-79](../src/components/game/GameScreen.tsx#L77-L79) |
| Tap a card to hide it as the rang | phase `'trump'` and your turn | [48](../src/components/game/GameScreen.tsx#L48), [53-56](../src/components/game/GameScreen.tsx#L53-L56) |
| Tap a card to play it | phase `'play'`, your turn, trick not full, card is legal | [47](../src/components/game/GameScreen.tsx#L47), [57-59](../src/components/game/GameScreen.tsx#L57-L59) |
| Reveal button | see [06](06-revealing-rang.md) | [50](../src/components/game/GameScreen.tsx#L50), [81](../src/components/game/GameScreen.tsx#L81) |

## Components

| Component | Purpose |
|-----------|---------|
| [Header.tsx](../src/components/game/Header.tsx) | Title and restart |
| [InfoBar.tsx](../src/components/game/InfoBar.tsx) / [InfoBox.tsx](../src/components/game/InfoBox.tsx) | Bid, rang (hidden or shown), team tricks, pile |
| [Table.tsx](../src/components/game/Table.tsx) | Card counts of the other players and the current trick |
| [PlayerHand.tsx](../src/components/game/PlayerHand.tsx) | Your hand, with illegal cards dimmed and your face-down rang card listed |
| [CardView.tsx](../src/components/game/CardView.tsx) | A single card |
| [BidButtons.tsx](../src/components/game/BidButtons.tsx) | Pass and 8–13 |
| [ResultCard.tsx](../src/components/game/ResultCard.tsx) | End-of-hand result |
| [GameButton.tsx](../src/components/game/GameButton.tsx) | Shared button |
| [colors.ts](../src/components/game/colors.ts) | Theme colours |
