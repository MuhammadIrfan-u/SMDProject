# 12. Verification: Rule-by-Rule Check

The code was checked against the rules in [README.md](../README.md). This was a code review; nothing was played on a device.

| # | Rule | Status | Where |
|---|------|--------|-------|
| 1 | 4 players, partners opposite | ✅ Correct | `player % 2` |
| 2 | 52 cards, A high | ✅ Correct | [deal.ts:6-11](../src/game/deal.ts#L6-L11) |
| 3 | Bid on the first 5 cards only | ✅ Correct | `firstFive` in the UI and bots |
| 4 | Bids 8–13, the highest wins | ✅ Correct | [bidding.ts:28-35](../src/game/bidding.ts#L28-L35), [BidButtons.tsx:13](../src/components/game/BidButtons.tsx#L13) |
| 5 | All pass → first player bids 8 | ✅ Correct | [bidding.ts:25-26](../src/game/bidding.ts#L25-L26) |
| 6 | Bidder hides 1 card, its suit is the rang | ✅ Correct | [rang.ts:7-22](../src/game/rang.ts#L7-L22) |
| 7 | Nobody else knows the rang (partner included) | ✅ Correct | [InfoBar.tsx:11-15](../src/components/game/InfoBar.tsx#L11-L15), [bots.ts:60](../src/game/bots.ts#L60) |
| 8 | Deal the rest to 13 cards | ✅ Correct (simulated by hiding the last 8) | [deal.ts:19-25](../src/game/deal.ts#L19-L25) |
| 9 | Rang cannot be changed | ✅ Correct | no code changes `trump` |
| 10 | Bidder leads first | ✅ Correct | [rang.ts:19](../src/game/rang.ts#L19) |
| 11 | Clockwise play | ✅ Correct | [tricks.ts:26](../src/game/tricks.ts#L26) |
| 12 | Must follow suit | ✅ Correct | [tricks.ts:10-16](../src/game/tricks.ts#L10-L16) |
| 13 | Hidden rang: highest card of the led suit wins | ✅ Correct | [tricks.ts:38](../src/game/tricks.ts#L38) |
| 14 | Winner leads next | ✅ Correct | [tricks.ts:93](../src/game/tricks.ts#L93) |
| 15 | Bidder may reveal at any time | ✅ Correct | [rang.ts:28](../src/game/rang.ts#L28), [GameScreen.tsx:50](../src/components/game/GameScreen.tsx#L50) |
| 16 | Others may reveal only when they cannot follow | ✅ Correct | [rang.ts:29-31](../src/game/rang.ts#L29-L31) |
| 17 | After reveal, any rang card beats other suits | ✅ Correct | [tricks.ts:38-41](../src/game/tricks.ts#L38-L41) |
| 18 | Highest rang card wins among rang cards | ✅ Correct | [tricks.ts:42-43](../src/game/tricks.ts#L42-L43) |
| 19 | Before reveal, tricks are credited straight away | ✅ Correct | [tricks.ts:62-64](../src/game/tricks.ts#L62-L64) |
| 20 | After reveal, a pile is collected by the same player winning twice in a row | ✅ Correct | [tricks.ts:66-77](../src/game/tricks.ts#L66-L77) |
| 21 | Bidding team wins if tricks ≥ bid | ✅ Correct | [tricks.ts:97-99](../src/game/tricks.ts#L97-L99) |

## Choices the rules don't settle

These are not bugs. Each is a judgement call the rules leave open, and the code picks a reasonable answer:

1. **Leftover pile after trick 13** goes to the winner of the last trick ([tricks.ts:80-83](../src/game/tricks.ts#L80-L83)). The rules don't say what happens to it.
2. **Rang cards discarded before a mid-trick reveal** don't count as trumps in that trick ([tricks.ts:21](../src/game/tricks.ts#L21), [tricks.ts:38](../src/game/tricks.ts#L38)).
3. **The face-down card returns to the bidder before trick 13** if the rang was never revealed ([tricks.ts:85-92](../src/game/tricks.ts#L85-L92)). Without this the bidder would have no card for the last trick.
4. **"Two in a row" is counted per player**, not per team, following the rule wording.
5. **One round of bidding only**: each player bids once, starting with you.

## Minor issues found

| Issue | Where | Effect | Suggested fix |
|-------|-------|--------|---------------|
| The face-down card returned at trick 12 is pushed without re-sorting | [tricks.ts:90](../src/game/tricks.ts#L90) | The card appears at the end of the hand instead of with its suit. This is cosmetic only. | Call `sortHand(hands[game.bidder])` after the push. |
| A bot bidder never reveals on purpose | [bots.ts:47-49](../src/game/bots.ts#L47-L49) | It is legal but weak play. The bot only reveals when it cannot follow suit. | Optional AI improvement. |
| Bots ignore their partner when choosing a card | [bots.ts:53-66](../src/game/bots.ts#L53-L66) | Bots waste high cards or trump their partner's winning trick. | Optional AI improvement. |
