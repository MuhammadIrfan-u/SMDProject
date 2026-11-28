# 8. Collecting Tricks and the Middle Pile

**File:** [src/game/tricks.ts](../src/game/tricks.ts), `finishTrick()` [lines 54-94](../src/game/tricks.ts#L54-L94)

## Rules

- **Before the reveal:** each trick goes straight to the winning team.
- **After the reveal:** won tricks pile up in the middle. They are collected only when **the same player wins two tricks in a row**. That player's team takes the **whole pile**.

## Implementation

| Rule | Lines | How |
|------|-------|-----|
| Find the winner and their team | [55-56](../src/game/tricks.ts#L55-L56) | `team = winner % 2` |
| Before reveal: credit straight away | [62-64](../src/game/tricks.ts#L62-L64) | `tricks[team] += 1` |
| After reveal: add to the pile | [67](../src/game/tricks.ts#L67) | `pile += 1` |
| Same **player** won the previous pile trick | [68-73](../src/game/tricks.ts#L68-L73) | The team takes the whole pile. Then `pile = 0` and `lastPileWinner = -1`. |
| Otherwise remember this winner | [74-76](../src/game/tricks.ts#L74-L76) | `lastPileWinner = winner` |
| Leftover pile after trick 13 | [80-83](../src/game/tricks.ts#L80-L83) | Goes to the team that won the last trick (see the note below). |

### Details

- "Two in a row" compares **players**, not teams. If North wins and then you win, that does **not** collect the pile, even though you are partners. This follows the rule text: "the same player".
- `lastPileWinner` starts at `-1` and is only set by tricks played **after** the reveal. A trick won before the reveal never counts as the first of the two.
- After a pile is collected, `lastPileWinner` resets to `-1`. Winning a third trick in a row starts a new count, so one player needs two **more** wins to collect again.
- The **leftover pile** rule is not in the official rules. It is a house rule this app adds so that all 13 tricks are always scored.

The pile size is shown live in the info bar ([InfoBar.tsx:23](../src/components/game/InfoBar.tsx#L23)).
