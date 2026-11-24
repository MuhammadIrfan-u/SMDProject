// Your own cards at the bottom of the screen.
import { StyleSheet, Text, View } from 'react-native';

import { Card, rankName } from '@/game/types';
import CardView from './CardView';

type Props = {
  cards: Card[];
  hiddenCard: Card | null; // your face-down rang card (only if you are the bidder)
  playable: Card[] | null; // cards you may play right now (null = no restriction shown)
  onCardPress: (card: Card) => void;
};

export default function PlayerHand({ cards, hiddenCard, playable, onCardPress }: Props) {
  return (
    <>
      <Text style={styles.title}>Your cards</Text>
      {hiddenCard && (
        <Text style={styles.hidden}>
          Face-down rang card: {rankName(hiddenCard.rank)}
          {hiddenCard.suit}
        </Text>
      )}
      <View style={styles.hand}>
        {cards.map((card) => (
          <CardView
            key={card.suit + card.rank}
            card={card}
            dimmed={playable !== null && !playable.some((c) => c.suit === card.suit && c.rank === card.rank)}
            onPress={() => onCardPress(card)}
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: { fontWeight: 'bold', color: '#555' },
  hidden: { color: '#aaa' },
  hand: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, maxWidth: 420 },
});
