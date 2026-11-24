// One playing card on the screen.
import { Pressable, StyleSheet, Text } from 'react-native';

import { Card, rankName } from '@/game/types';
import { ORANGE, WHITE } from './colors';

type Props = { card: Card; dimmed?: boolean; onPress?: () => void };

export default function CardView({ card, dimmed, onPress }: Props) {
  const isRed = card.suit === '♥' || card.suit === '♦';
  const color = isRed ? ORANGE : '#222';
  return (
    <Pressable onPress={onPress} style={[styles.card, dimmed && { opacity: 0.35 }]}>
      <Text style={[styles.rank, { color }]}>{rankName(card.rank)}</Text>
      <Text style={[styles.suit, { color }]}>{card.suit}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 46, height: 66, backgroundColor: WHITE, borderColor: ORANGE, borderWidth: 1.5, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  rank: { fontSize: 18, fontWeight: 'bold' },
  suit: { fontSize: 20 },
});
