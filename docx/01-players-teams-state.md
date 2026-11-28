# 1. Players, Teams, Cards and Game State

**File:** [src/game/types.ts](../src/game/types.ts)

## Rules

- Exactly 4 players in 2 teams of 2. Partners sit opposite each other.
- One standard 52-card deck.
- Card ranks from high to low: A, K, Q, J, 10 … 2.
- Play moves clockwise.

## Implementation

| Rule | Code | How it works |
|------|------|--------------|
| 4 seats | [types.ts:2](../src/game/types.ts#L2), `PLAYER_NAMES` [types.ts:28](../src/game/types.ts#L28) | 0 = You (bottom), 1 = West, 2 = North (your partner), 3 = East. |
| Partners sit opposite | [types.ts:3](../src/game/types.ts#L3) | Team = `player % 2`. Players 0 and 2 form team 0; players 1 and 3 form team 1. |
| Clockwise play | [tricks.ts:26](../src/game/tricks.ts#L26) | The next player is `(player + 1) % 4`. |
| 4 suits | `SUITS` [types.ts:27](../src/game/types.ts#L27) | `['♠', '♥', '♣', '♦']` |
| Rank order | `Card.rank` [types.ts:5](../src/game/types.ts#L5) | Ranks are numbers 2–14 (J = 11, Q = 12, K = 13, A = 14), so a higher number is a stronger card. |
| Rank display | `rankName()` [types.ts:30-36](../src/game/types.ts#L30-L36) | Turns 11–14 into J, Q, K, A. |

## The `Game` state object ([types.ts:9-25](../src/game/types.ts#L9-L25))

| Field | Meaning |
|-------|---------|
| `phase` | `'bid'` → `'trump'` → `'play'` → `'over'` |
| `hands` | 4 arrays of cards, one per player |
| `turn` | Whose turn it is. `-1` means a full trick is waiting to be collected. |
| `bids` | One bid per player: `null` = not bid yet, `0` = pass, `8`–`13` = bid |
| `bidder`, `bid` | The winner of the bidding and the bid amount |
| `trump` | The rang suit. It is stored from the start but kept secret in the UI. |
| `hiddenCard` | The bidder's face-down card |
| `revealed` | Whether the rang has been revealed |
| `trick` | Cards on the table. Each `Played` entry also records `revealed`, meaning whether the rang was known when that card was played ([types.ts:7](../src/game/types.ts#L7)). |
| `pile`, `lastPileWinner` | The middle pile after the reveal (see [08](08-pile-collection.md)) |
| `tricks` | Tricks won: `[team0, team1]` |
| `tricksPlayed` | 0–13 |
| `message` | The status text shown to the user |
