// The table: the other three players and the cards played in the current trick.
import { StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { Game, PLAYER_NAMES } from '@/game/types';
import CardView from './CardView';
import { ORANGE } from './colors';

export default function Table({ game }: { game: Game }) {
  return (
    <View style={styles.table}>
      <Text style={styles.seat}>North - {game.hands[2].length} cards</Text>
      <View style={styles.middle}>
        <Text style={styles.seatSide}>
          West{'\n'}
          {game.hands[1].length}
        </Text>
        <View style={styles.trickArea}>
          {game.trick.length === 0 && <Text style={styles.empty}>Table is empty</Text>}
          {/* each card sits on the side of the player who played it */}
          {game.trick.map((play) => (
            <View key={play.player} style={SIDES[play.player]} pointerEvents="none">
              <Animated.View entering={ZoomIn} style={styles.played}>
                <CardView card={play.card} />
                <Text style={styles.playedName}>{PLAYER_NAMES[play.player]}</Text>
              </Animated.View>
            </View>
          ))}
        </View>
        <Text style={styles.seatSide}>
          East{'\n'}
          {game.hands[3].length}
        </Text>
      </View>
      <Text style={styles.seat}>You</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  table: { width: '100%', maxWidth: 600, backgroundColor: '#fdeee8', borderRadius: 16, padding: 12, alignItems: 'center', gap: 8 },
  seat: { color: ORANGE, fontWeight: 'bold' },
  middle: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' },
  seatSide: { color: ORANGE, fontWeight: 'bold', textAlign: 'center', width: 48 },
  trickArea: { flex: 1, height: 270, justifyContent: 'center', alignItems: 'center' },
  empty: { color: '#aaa' },
  sideBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center' },
  sideLeft: { position: 'absolute', left: 0, top: 0, bottom: 0, justifyContent: 'center' },
  sideTop: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' },
  sideRight: { position: 'absolute', right: 0, top: 0, bottom: 0, justifyContent: 'center' },
  played: { alignItems: 'center' },
  playedName: { fontSize: 11, color: '#555' },
});

// Where each player's card goes: 0 = You (bottom), 1 = West (left), 2 = North (top), 3 = East (right)
const SIDES = [styles.sideBottom, styles.sideLeft, styles.sideTop, styles.sideRight];
