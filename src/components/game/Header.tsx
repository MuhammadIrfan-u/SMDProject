// Orange top bar with the title, the player's name, and the History and Restart buttons.
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ORANGE, WHITE } from './colors';

type Props = { playerName: string; onRestart: () => void; onHistory: () => void };

export default function Header({ playerName, onRestart, onHistory }: Props) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>RANG</Text>
        <Text style={styles.player} numberOfLines={1}>
          {playerName}
        </Text>
      </View>
      <View style={styles.buttons}>
        <Pressable onPress={onHistory} style={styles.restart}>
          <Text style={styles.restartText}>History</Text>
        </Pressable>
        <Pressable onPress={onRestart} style={styles.restart}>
          <Text style={styles.restartText}>Restart</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: ORANGE, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  title: { color: WHITE, fontSize: 24, fontWeight: 'bold', letterSpacing: 4 },
  player: { color: WHITE, fontSize: 12, opacity: 0.9, maxWidth: 160 },
  buttons: { flexDirection: 'row', gap: 8 },
  restart: { borderColor: WHITE, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  restartText: { color: WHITE, fontWeight: 'bold' },
});
