// A player's totals and the list of their games, read from Firebase.
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GameRecord, getHistory, getPlayer, Player } from '@/firebase/players';
import { ORANGE, WHITE } from '../game/colors';
import GameButton from '../game/GameButton';
import InfoBox from '../game/InfoBox';

const STATUS_TEXT: Record<GameRecord['status'], string> = {
  'in-progress': 'Not finished',
  won: 'Won',
  lost: 'Lost',
  abandoned: 'Abandoned',
};

function bidsText(game: GameRecord) {
  if (game.bids.length === 0) return 'No bids yet';
  return game.bids.map((b) => `${b.name}: ${b.amount === 0 ? 'pass' : b.amount}`).join(' · ');
}

function GameRow({ game }: { game: GameRecord }) {
  const color = game.status === 'won' ? '#2e7d32' : game.status === 'lost' ? '#c62828' : '#888';
  return (
    <View style={styles.row}>
      <View style={styles.rowTop}>
        <Text style={[styles.status, { color }]}>{STATUS_TEXT[game.status]}</Text>
        <Text style={styles.date}>{game.startedAt ? game.startedAt.toLocaleString() : ''}</Text>
      </View>
      <Text style={styles.detail}>Bids: {bidsText(game)}</Text>
      {game.winningBid && (
        <Text style={styles.detail}>
          Winning bid: {game.winningBid.name} {game.winningBid.amount}
          {game.bidWon !== null ? (game.bidWon ? ' · bid made' : ' · bid failed') : ''}
        </Text>
      )}
      {game.tricks && (
        <Text style={styles.detail}>
          Tricks: your team {game.tricks.myTeam} – {game.tricks.opponents} opponents · rang {game.trump}
        </Text>
      )}
    </View>
  );
}

export default function HistoryScreen({ playerId }: { playerId: string }) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [games, setGames] = useState<GameRecord[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([getPlayer(playerId), getHistory(playerId)])
      .then(([p, g]) => {
        if (cancelled) return;
        setPlayer(p);
        setGames(g);
      })
      .catch((err) => {
        console.warn(err);
        if (!cancelled) setError('Could not load history.');
      });
    return () => {
      cancelled = true;
    };
  }, [playerId]);

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>{player ? player.name : 'History'}</Text>
        <Text style={styles.back} onPress={goBack}>
          Back
        </Text>
      </View>

      {error !== '' && <Text style={styles.error}>{error}</Text>}
      {games === null && error === '' && <ActivityIndicator color={ORANGE} style={{ marginTop: 24 }} />}

      {player && (
        <View style={styles.stats}>
          <InfoBox label="Played" value={player.gamesPlayed} />
          <InfoBox label="Won" value={player.gamesWon} />
          <InfoBox label="Lost" value={player.gamesLost} />
          <InfoBox label="Bids placed" value={player.bidsPlaced} />
          <InfoBox label="Bids won" value={player.bidsWon} />
        </View>
      )}

      {games && (
        <FlatList
          data={games}
          keyExtractor={(g) => g.id}
          renderItem={({ item }) => <GameRow game={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No games yet.</Text>}
        />
      )}

      <View style={styles.footer}>
        <GameButton text="Switch Player" onPress={() => router.replace('/')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: WHITE },
  header: { backgroundColor: ORANGE, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  title: { color: WHITE, fontSize: 22, fontWeight: 'bold' },
  back: { color: WHITE, fontWeight: 'bold', borderColor: WHITE, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center', padding: 12 },
  list: { padding: 12, gap: 10, alignItems: 'stretch', width: '100%', maxWidth: 600, alignSelf: 'center' },
  row: { borderColor: ORANGE, borderWidth: 1, borderRadius: 10, padding: 10, gap: 3 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between' },
  status: { fontWeight: 'bold', fontSize: 15 },
  date: { color: '#888', fontSize: 12 },
  detail: { color: '#333', fontSize: 13 },
  empty: { textAlign: 'center', color: '#888', marginTop: 24 },
  error: { color: '#c62828', textAlign: 'center', marginTop: 16 },
  footer: { padding: 12, alignItems: 'center' },
});
