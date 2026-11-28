import { Redirect, useLocalSearchParams } from 'expo-router';

import HistoryScreen from '@/components/player/HistoryScreen';

// A player's saved games.
export default function HistoryRoute() {
  const { player } = useLocalSearchParams<{ player?: string }>();
  if (!player) return <Redirect href="/" />;
  return <HistoryScreen playerId={player} />;
}
