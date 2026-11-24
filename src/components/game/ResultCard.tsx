// End-of-game box: who won and a Play Again button.
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { biddersWon } from '@/game/tricks';
import { Game, PLAYER_NAMES } from '@/game/types';
import { ORANGE, WHITE } from './colors';
import GameButton from './GameButton';

export default function ResultCard({ game, onPlayAgain }: { game: Game; onPlayAgain: () => void }) {
  const bidderWon = biddersWon(game);
  const bidderIsMyTeam = game.bidder % 2 === 0;
  const iWon = bidderWon === bidderIsMyTeam;

  return (
    <Animated.View entering={FadeInDown} style={styles.box}>
      <Text style={styles.title}>{iWon ? 'You Win!' : 'You Lose'}</Text>
      <Text style={styles.text}>
        {PLAYER_NAMES[game.bidder]} bid {game.bid} and the bidding team took {game.tricks[game.bidder % 2]}.
      </Text>
      <Text style={styles.text}>{bidderWon ? 'The bidding team wins.' : 'The defending team wins.'}</Text>
      <GameButton text="Play Again" onPress={onPlayAgain} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: WHITE, borderColor: ORANGE, borderWidth: 2, borderRadius: 16, padding: 16, alignItems: 'center', gap: 8, width: '100%', maxWidth: 400 },
  title: { fontSize: 28, fontWeight: 'bold', color: ORANGE },
  text: { textAlign: 'center', color: '#333' },
});
