# 4. Choosing the Rang (Hidden Trump)

**File:** [src/game/rang.ts](../src/game/rang.ts)

## Rules

- The bidder picks a trump suit and puts **one card of that suit face down**. That card marks the rang.
- **Nobody else knows the rang**, not even the bidder's partner.
- The remaining cards are dealt until everyone holds 13.
- The rang **cannot be changed**.
- The **bidder leads** the first trick.

## Implementation

### `chooseTrump(game, card)`: [rang.ts:7-22](../src/game/rang.ts#L7-L22)

| Rule | Lines | How |
|------|-------|-----|
| Card goes face down | [9](../src/game/rang.ts#L9), [16](../src/game/rang.ts#L16) | The card is removed from the bidder's hand and stored in `hiddenCard`. |
| Its suit is the rang | [17](../src/game/rang.ts#L17) | `trump: card.suit` |
| Deal the rest | [12](../src/game/rang.ts#L12) | All hands are re-sorted, so the last 8 cards become visible. The bidder now holds 12 cards plus the face-down one. |
| Bidder leads | [18-19](../src/game/rang.ts#L18-L19) | `phase: 'play'`, `turn: bidder` |
| Cannot be changed | n/a | No function changes `trump` after this point. |

### Which cards can be chosen?

- **Human:** during `'trump'` the hand shown is only `firstFive` ([GameScreen.tsx:45-46](../src/components/game/GameScreen.tsx#L45-L46)). Tapping a card calls `chooseTrump` ([GameScreen.tsx:53-56](../src/components/game/GameScreen.tsx#L53-L56)).
- **Bot:** `botTrump()` picks its most common suit in the first 5 and hides its lowest card of that suit ([bots.ts:26-42](../src/game/bots.ts#L26-L42)).

### Keeping it secret: [InfoBar.tsx:11-15](../src/components/game/InfoBar.tsx#L11-L15)

- During bidding the info bar shows `-`.
- If you are the bidder, it shows `♠ (only you know)`, and the face-down card is listed above your hand ([PlayerHand.tsx:18-23](../src/components/game/PlayerHand.tsx#L18-L23)).
- Everyone else sees `Hidden` until the rang is revealed or the hand is over.
- Bots never read `game.trump` until `game.revealed` is true ([bots.ts:60](../src/game/bots.ts#L60)). This includes the bidder's partner.

### Face-down card returns before the last trick: [tricks.ts:85-92](../src/game/tricks.ts#L85-L92)

If the rang is still hidden after 12 tricks, the bidder takes the face-down card back into their hand so they can play it in trick 13. The rang stays unrevealed.
