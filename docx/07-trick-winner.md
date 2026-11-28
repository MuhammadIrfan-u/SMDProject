# 7. Who Wins a Trick

**File:** [src/game/tricks.ts](../src/game/tricks.ts), `trickWinner()` [lines 32-51](../src/game/tricks.ts#L32-L51) (private)

## Rules

- **While the rang is hidden:** the highest card of the led suit wins.
- **After the reveal:** every rang card beats every other suit. Even the 2 of the rang suit beats an Ace of another suit.
- With several rang cards in one trick, the **highest rang card wins**.

## Implementation

A card counts as a trump when ([line 38](../src/game/tricks.ts#L38)):

```ts
card.suit === game.trump && (play.revealed || card.suit === lead)
```

In words: it is a rang card **and** either the rang was revealed when it was played, or the rang suit was led. If the rang suit is led, it wins on rank as the led suit anyway.

The trick is scanned left to right, keeping the best card so far:

| Current card vs best | Result | Lines |
|----------------------|--------|-------|
| trump vs non-trump | the current card wins | [40-41](../src/game/tricks.ts#L40-L41) |
| trump vs trump | the higher rank wins | [42-43](../src/game/tricks.ts#L42-L43) |
| led suit vs off-suit (no trumps) | the led suit wins | [44-45](../src/game/tricks.ts#L44-L45) |
| led suit vs led suit | the higher rank wins | [46-47](../src/game/tricks.ts#L46-L47) |
| off-suit, non-trump | can never win | n/a |

## Examples

| Rang | Revealed? | Trick (lead first) | Winner |
|------|-----------|--------------------|--------|
| ♥ | no | ♠K, ♠A, ♥2, ♠3 | ♠A (♥2 is only a discard) |
| ♥ | yes | ♠K, ♠A, ♥2, ♠3 | ♥2 |
| ♥ | yes | ♠K, ♥5, ♥J, ♠A | ♥J |
| ♥ | revealed by the 4th player | ♠K, ♥9 (before the reveal), ♠2, ♥3 (reveal) | ♥3, because ♥9 was played before the reveal |
