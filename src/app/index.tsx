import { useEffect, useState } from 'react';
import { View } from 'react-native';

import GameScreen from '@/components/game/GameScreen';

// The cards are shuffled randomly, so we only deal them after the screen has loaded.
// (Dealing during the first render makes the web server and browser disagree.)
export default function HomeScreen() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, []);

  if (!ready) return <View style={{ flex: 1, backgroundColor: 'white' }} />;
  return <GameScreen />;
}
