# 3. Bidding

**File:** [src/game/bidding.ts](../src/game/bidding.ts)
**UI:** [src/components/game/BidButtons.tsx](../src/components/game/BidButtons.tsx)

## Rules

1. Looking only at their first 5 cards, each player passes or bids **8–13**.
2. The **highest bidder** becomes the bidder. Their team is the bidding team.
3. If **all four pass**, the **first player** becomes the bidder with a bid of **8**.

## Implementation

### `highestBid(game)`: [bidding.ts:4-10](../src/game/bidding.ts#L4-L10)

Returns the highest bid so far, or `0` if there is none. It is used to:

- disable bid buttons that are not higher than the current bid ([BidButtons.tsx:13](../src/components/game/BidButtons.tsx#L13))
- make bots bid only above the current high bid ([bots.ts:21](../src/game/bots.ts#L21))
- show the current bid in the info bar ([InfoBar.tsx:9](../src/components/game/InfoBar.tsx#L9))

### `placeBid(game, amount)`: [bidding.ts:13-45](../src/game/bidding.ts#L13-L45)

`amount = 0` means pass.

| Rule | Lines | How |
|------|-------|-----|
| Record the bid | [14-15](../src/game/bidding.ts#L14-L15) | `bids[turn] = amount` |
| Next player bids | [20-22](../src/game/bidding.ts#L20-L22) | Players bid in order 0 → 1 → 2 → 3. There is **one round** of bidding. |
| Find the highest bidder | [28-35](../src/game/bidding.ts#L28-L35) | Strict `>` comparison. If two bids are equal, the earlier player keeps it, though the UI and bots never allow an equal bid. |
| All pass → player 0 bids 8 | [25-26](../src/game/bidding.ts#L25-L26) | The defaults are `bidder = 0` and `bid = 8`. If no bid is greater than 0, they stay. |
| Move to the rang phase | [36-44](../src/game/bidding.ts#L36-L44) | `phase: 'trump'`, and the turn goes to the bidder |

### Bid buttons: [BidButtons.tsx:8-17](../src/components/game/BidButtons.tsx#L8-L17)

Shows **Pass** plus 8–13. Buttons `<= highest` are disabled, so a human can never make an illegal bid.
