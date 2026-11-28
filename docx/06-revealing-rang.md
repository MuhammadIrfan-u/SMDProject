# 6. Revealing the Rang

**File:** [src/game/rang.ts](../src/game/rang.ts)

## Rules

The rang can be revealed:

- by the **bidder at any time** during play, or
- by **any player who cannot follow the led suit**.

From that moment, rang cards beat all other suits (see [07](07-trick-winner.md)).

## Implementation

### `canReveal(game, player)`: [rang.ts:26-32](../src/game/rang.ts#L26-L32)

| Check | Line |
|-------|------|
| Only during play, and only once | [27](../src/game/rang.ts#L27) |
| The bidder can always reveal | [28](../src/game/rang.ts#L28) |
| Others need a card to have been led | [29-30](../src/game/rang.ts#L29-L30) |
| …and must have no card of the led suit | [31](../src/game/rang.ts#L31) |

### `revealRang(game, player)`: [rang.ts:35-48](../src/game/rang.ts#L35-L48)

- The face-down card goes back into the bidder's hand and the hand is re-sorted ([37-40](../src/game/rang.ts#L37-L40)).
- `hiddenCard = null`, `revealed = true` ([44-45](../src/game/rang.ts#L44-L45)).
- The message announces who revealed it and the suit.

### When the human sees the **Reveal the Rang** button: [GameScreen.tsx:50](../src/components/game/GameScreen.tsx#L50), [GameScreen.tsx:81](../src/components/game/GameScreen.tsx#L81)

```
phase is 'play'  AND  trick is not full
AND (you are the bidder  OR  it is your turn)
AND canReveal(game, 0)
```

- As the bidder you can reveal even when it is not your turn, which matches "at any time".
- As a non-bidder you can only reveal on your turn, when you cannot follow suit.

### Bot reveals: [bots.ts:47-49](../src/game/bots.ts#L47-L49)

A bot reveals whenever it cannot follow suit, whether it is the bidder or not. A bot bidder never reveals early just to trump in.

### Effect on cards already on the table

Each `Played` card stores `revealed` at the time it was played ([tricks.ts:21](../src/game/tricks.ts#L21)). If someone reveals in the middle of a trick, rang cards that were thrown off **before** the reveal do **not** become trumps. The rule says "from the moment of the reveal".
