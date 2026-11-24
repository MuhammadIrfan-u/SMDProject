// Row showing the bid, the rang, the tricks of each team and the middle pile.
import { StyleSheet, View } from 'react-native';

import { highestBid } from '@/game/bidding';
import { Game, PLAYER_NAMES } from '@/game/types';
import InfoBox from './InfoBox';

export default function InfoBar({ game }: { game: Game }) {
  const bidText = game.phase === 'bid' ? highestBid(game) || '-' : game.bid + ' (' + PLAYER_NAMES[game.bidder] + ')';

  // Only the bidder knows the rang until it is revealed
  let rangText = 'Hidden';
  if (game.phase === 'bid') rangText = '-';
  else if (game.revealed || game.phase === 'over') rangText = game.trump;
  else if (game.bidder === 0) rangText = game.trump + ' (only you know)';

  return (
    <View style={styles.bar}>
      <InfoBox label="Bid" value={bidText} />
      <InfoBox label="Rang" value={rangText} />
      <InfoBox label="You + North" value={game.tricks[0]} />
      <InfoBox label="West + East" value={game.tricks[1]} />
      <InfoBox label="Pile" value={game.pile} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'center' },
});
