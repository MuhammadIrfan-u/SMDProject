// Pass and 8-13 buttons shown while it is your turn to bid.
import { StyleSheet, View } from 'react-native';

import GameButton from './GameButton';

type Props = { highest: number; onBid: (amount: number) => void };

export default function BidButtons({ highest, onBid }: Props) {
  return (
    <View style={styles.row}>
      <GameButton text="Pass" onPress={() => onBid(0)} />
      {[8, 9, 10, 11, 12, 13].map((n) => (
        <GameButton key={n} text={String(n)} disabled={n <= highest} onPress={() => onBid(n)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 6 },
});
