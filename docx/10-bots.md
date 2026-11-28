# 10. Computer Players (Bots)

**File:** [src/game/bots.ts](../src/game/bots.ts)

West (1), North (2) and East (3) are bots. They only look at **their own cards** and the public table. They never look at other hands or at a hidden rang.

## `botBid(game)`: [bots.ts:10-23](../src/game/bots.ts#L10-L23)

This follows the README tip: "Bid 8 only with at least two high cards in one suit".

- It counts the high cards (J, Q, K, A) in the first 5 cards.
- With no suit holding 2 or more high cards, it passes ([line 19](../src/game/bots.ts#L19)).
- Otherwise it bids 8, plus 1 for every high card from the 4th on ([line 20](../src/game/bots.ts#L20)). For example, 4 high cards → 9 and 5 high cards → 10.
- It only bids when that beats the current highest bid. Otherwise it passes ([lines 21-22](../src/game/bots.ts#L21-L22)).

## `botTrump(game)`: [bots.ts:26-42](../src/game/bots.ts#L26-L42)

It picks its most common suit among the first 5 cards (ties go to the first suit in ♠ ♥ ♣ ♦ order) and hides its **lowest** card of that suit.

## `botMove(game)`: [bots.ts:45-68](../src/game/bots.ts#L45-L68)

| Situation | Action | Lines |
|-----------|--------|-------|
| Cannot follow suit and is allowed to reveal | Reveals the rang first | [47-49](../src/game/bots.ts#L47-L49) |
| Leading, or following suit | Plays its **highest** legal card | [53-57](../src/game/bots.ts#L53-L57) |
| Cannot follow and the rang is known | Plays its **lowest trump**, or its lowest card if it has no trump | [58-66](../src/game/bots.ts#L58-L66) |

Bots don't track partners. A bot may trump a trick its partner is already winning, or play high when its partner has already won the trick.
