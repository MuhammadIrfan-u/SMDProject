# 5. Playing Tricks and Following Suit

**File:** [src/game/tricks.ts](../src/game/tricks.ts)

## Rules

1. The bidder leads the first trick.
2. Play goes clockwise, one card per player.
3. You **must follow the suit led** if you can.
4. The **winner of each trick leads the next one**.

## Implementation

### `leadSuit(game)`: [tricks.ts:4-7](../src/game/tricks.ts#L4-L7)

Returns the suit of the first card on the table, or `''` if the table is empty.

### `legalCards(game, player)`: [tricks.ts:10-16](../src/game/tricks.ts#L10-L16)

| Situation | Result |
|-----------|--------|
| Leading (empty table) | Any card in hand |
| Holding the led suit | **Only** cards of the led suit |
| Not holding the led suit | Any card in hand |

Where it is used:

- the human can only play a legal card ([GameScreen.tsx:58-59](../src/components/game/GameScreen.tsx#L58-L59))
- illegal cards are dimmed ([GameScreen.tsx:87](../src/components/game/GameScreen.tsx#L87), [PlayerHand.tsx:29](../src/components/game/PlayerHand.tsx#L29))
- bots only choose from legal cards ([bots.ts:50](../src/game/bots.ts#L50))

> The bidder's face-down card is **not** in their hand while it is hidden, so it never counts for following suit.

### `playCard(game, player, card)`: [tricks.ts:18-27](../src/game/tricks.ts#L18-L27)

| Step | Lines |
|------|-------|
| Remove the card from the hand | [20](../src/game/tricks.ts#L20) |
| Add it to the trick, recording whether the rang was revealed at that moment | [21](../src/game/tricks.ts#L21) |
| 4th card: `turn = -1` (wait for collection) | [23-25](../src/game/tricks.ts#L23-L25) |
| Otherwise the next player clockwise | [26](../src/game/tricks.ts#L26) |

### Winner leads next: [tricks.ts:93](../src/game/tricks.ts#L93)

`finishTrick` sets `turn: winner`.
