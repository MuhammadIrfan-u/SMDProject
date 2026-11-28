# 2. Shuffling and Dealing

**File:** [src/game/deal.ts](../src/game/deal.ts)

## Rules

- Each player first gets **5 cards** and bids using only those.
- After the rang is chosen, the rest of the cards are dealt until everyone holds **13**.

## Implementation

### `newGame()`: [deal.ts:5-43](../src/game/deal.ts#L5-L43)

| Step | Lines | What happens |
|------|-------|--------------|
| Build the deck | [6-11](../src/game/deal.ts#L6-L11) | 4 suits × ranks 2–14 = 52 cards |
| Shuffle | [13-18](../src/game/deal.ts#L13-L18) | Fisher–Yates shuffle, which is unbiased |
| Deal | [19-25](../src/game/deal.ts#L19-L25) | Each player gets 13 cards up front, stored as **first 5 (sorted) + remaining 8**. |
| Initial state | [26-42](../src/game/deal.ts#L26-L42) | `phase: 'bid'`, `turn: 0`, all bids `null`, `tricks: [0, 0]` |

> **Design choice:** All 13 cards are dealt at once. The "deal the rest later" rule is simulated by only *showing* the first 5 during bidding and rang selection.

### `firstFive(hand)`: [deal.ts:54-56](../src/game/deal.ts#L54-L56)

Returns `hand.slice(0, 5)`. It is used by:

- the UI, so you only see 5 cards before play ([GameScreen.tsx:45-46](../src/components/game/GameScreen.tsx#L45-L46))
- the bots, so their bids and rang choices only look at 5 cards ([bots.ts:11](../src/game/bots.ts#L11), [bots.ts:27](../src/game/bots.ts#L27))

### `sortHand(hand)`: [deal.ts:46-51](../src/game/deal.ts#L46-L51)

Sorts cards in place, by suit (♠ ♥ ♣ ♦) and then from high to low. It is called on the first 5 cards at deal time, and on all hands once the rang is chosen ([rang.ts:12](../src/game/rang.ts#L12)). That is the moment the "remaining 8" mix into the visible hand.
