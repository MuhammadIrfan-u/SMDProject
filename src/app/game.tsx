import { Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import GameScreen from '@/components/game/GameScreen';

// The game route. It needs the player chosen on the name screen.
export default function GameRoute() {
  const { player, name } = useLocalSearchParams<{ player?: string; name?: string }>();
  const [ready, setReady] = useState(false);

  // The cards are shuffled randomly, so we only deal them after the screen has loaded.
  // (Dealing during the first render makes the web server and browser disagree.)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, []);

  if (!player || !name) return <Redirect href="/" />;
  if (!ready) return <View style={{ flex: 1, backgroundColor: 'white' }} />;
  return <GameScreen playerId={player} playerName={name} />;
}
