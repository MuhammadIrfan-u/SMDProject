// A simple orange button used everywhere in the game.
import { Pressable, StyleSheet, Text } from 'react-native';

import { ORANGE, WHITE } from './colors';

type Props = { text: string; onPress: () => void; disabled?: boolean };

export default function GameButton({ text, onPress, disabled }: Props) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.button, disabled && { opacity: 0.3 }]}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: ORANGE, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, minWidth: 48, alignItems: 'center' },
  text: { color: WHITE, fontWeight: 'bold', fontSize: 16 },
});
