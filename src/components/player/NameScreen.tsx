// First screen: asks for the player's name before the game starts.
// The name is the player's unique id, so entering a known name continues that player's history.
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getOrCreatePlayer, NAME_MAX, Player, validateName } from '@/firebase/players';
import { ORANGE, WHITE } from '../game/colors';
import GameButton from '../game/GameButton';

export default function NameScreen() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState<{ player: Player; isNew: boolean } | null>(null);

  async function onContinue() {
    const problem = validateName(name);
    if (problem) {
      setError(problem);
      return;
    }
    setError('');
    setLoading(true);
    try {
      setFound(await getOrCreatePlayer(name));
    } catch (err) {
      console.warn(err);
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  function onPlay() {
    if (!found) return;
    router.replace({ pathname: '/game', params: { player: found.player.id, name: found.player.name } });
  }

  function onHistory() {
    if (!found) return;
    router.push({ pathname: '/history', params: { player: found.player.id } });
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.center}>
        <Text style={styles.title}>RANG</Text>
        <Text style={styles.subtitle}>Enter your name to start</Text>

        {!found ? (
          <View style={styles.form}>
            <TextInput
              value={name}
              onChangeText={(t) => {
                setName(t);
                setError('');
              }}
              placeholder="Your name"
              maxLength={NAME_MAX}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="go"
              onSubmitEditing={onContinue}
              editable={!loading}
              style={styles.input}
            />
            {error !== '' && <Text style={styles.error}>{error}</Text>}
            {loading ? <ActivityIndicator color={ORANGE} /> : <GameButton text="Continue" onPress={onContinue} />}
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.welcome}>
              {found.isNew ? `Welcome, ${found.player.name}!` : `Welcome back, ${found.player.name}!`}
            </Text>
            {!found.isNew && (
              <Text style={styles.stats}>
                {found.player.gamesPlayed} played · {found.player.gamesWon} won · {found.player.bidsWon} bids won
              </Text>
            )}
            <GameButton text="Start Game" onPress={onPlay} />
            {!found.isNew && <GameButton text="View History" onPress={onHistory} />}
            <Text style={styles.link} onPress={() => setFound(null)}>
              Not you? Use another name
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: WHITE },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  title: { fontSize: 40, fontWeight: 'bold', color: ORANGE, letterSpacing: 8 },
  subtitle: { fontSize: 15, color: '#555', marginBottom: 12 },
  form: { width: '100%', maxWidth: 320, gap: 12, alignItems: 'stretch' },
  input: {
    borderColor: ORANGE,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#222',
  },
  error: { color: '#c62828', fontSize: 13, textAlign: 'center' },
  welcome: { fontSize: 18, fontWeight: 'bold', color: '#222', textAlign: 'center' },
  stats: { fontSize: 13, color: '#666', textAlign: 'center' },
  link: { color: ORANGE, textAlign: 'center', textDecorationLine: 'underline', marginTop: 4 },
});
