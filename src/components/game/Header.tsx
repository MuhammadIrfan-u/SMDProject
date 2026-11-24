// Orange top bar with the title and the Restart button.
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ORANGE, WHITE } from './colors';

export default function Header({ onRestart }: { onRestart: () => void }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>RANG</Text>
      <Pressable onPress={onRestart} style={styles.restart}>
        <Text style={styles.restartText}>Restart</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: ORANGE, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  title: { color: WHITE, fontSize: 24, fontWeight: 'bold', letterSpacing: 4 },
  restart: { borderColor: WHITE, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  restartText: { color: WHITE, fontWeight: 'bold' },
});
