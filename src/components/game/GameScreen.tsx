// The whole game screen. It keeps the game state and lets the computer players move.
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { highestBid, placeBid } from '@/game/bidding';
import { botBid, botMove, botTrump } from '@/game/bots';
import { firstFive, newGame } from '@/game/deal';
import { canReveal, chooseTrump, revealRang } from '@/game/rang';
import { finishTrick, legalCards, playCard } from '@/game/tricks';
import { Card, PLAYER_NAMES } from '@/game/types';
import { useGameRecorder } from '@/hooks/use-game-recorder';
import BidButtons from './BidButtons';
import { ORANGE, WHITE } from './colors';
import GameButton from './GameButton';
import Header from './Header';
import InfoBar from './InfoBar';
import PlayerHand from './PlayerHand';
import ResultCard from './ResultCard';
import Table from './Table';

type Props = { playerId: string; playerName: string };

export default function GameScreen({ playerId, playerName }: Props) {
  const [game, setGame] = useState(newGame());
  // saves this game's status, bids and result to the player's history in Firebase
  const beginNewDeal = useGameRecorder(playerId, playerName, game);

  function deal() {
    beginNewDeal();
    setGame(newGame());
  }

  // The computer players move here, after a short pause.
  useEffect(() => {
    if (game.phase === 'over') return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (game.trick.length === 4) {
      // 4 cards on the table: collect the trick
      timer = setTimeout(() => setGame((g) => finishTrick(g)), 1500);
    } else if (game.turn >= 1) {
      timer = setTimeout(() => {
        setGame((g) => {
          if (g.phase === 'bid') return placeBid(g, botBid(g));
          if (g.phase === 'trump') return chooseTrump(g, botTrump(g));
          return botMove(g);
        });
      }, 900);
    }
    return () => clearTimeout(timer);
  }, [game]);

  const myTurn = game.turn === 0;
  const showAll = game.phase === 'play' || game.phase === 'over';
  const myHand = showAll ? game.hands[0] : firstFive(game.hands[0]);
  const canPlay = game.phase === 'play' && myTurn && game.trick.length < 4;
  const choosingRang = game.phase === 'trump' && myTurn;
  // the bidder can reveal at any time during play; others only on their turn when they cannot follow suit
  const showReveal = game.phase === 'play' && game.trick.length < 4 && (game.bidder === 0 || myTurn) && canReveal(game, 0);

  function onCardPress(card: Card) {
    if (choosingRang) {
      setGame(chooseTrump(game, card));
      return;
    }
    if (!canPlay) return;
    const allowed = legalCards(game, 0).some((c) => c.suit === card.suit && c.rank === card.rank);
    if (allowed) setGame(playCard(game, 0, card));
  }

  let turnText = '';
  if (game.trick.length === 4) turnText = 'Collecting trick...';
  else if (game.turn >= 0) turnText = PLAYER_NAMES[game.turn] + (game.turn === 0 ? ' - your turn' : ' is thinking...');

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        playerName={playerName}
        onRestart={deal}
        onHistory={() => router.push({ pathname: '/history', params: { player: playerId } })}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <InfoBar game={game} />
        <Table game={game} />

        <Text style={styles.message}>{game.message}</Text>
        {game.phase !== 'over' && <Text style={styles.turnText}>{turnText}</Text>}

        {game.phase === 'bid' && myTurn && (
          <BidButtons highest={highestBid(game)} onBid={(amount) => setGame(placeBid(game, amount))} />
        )}
        {choosingRang && <Text style={styles.turnText}>Tap one of your cards to place it face down. Its suit is the rang.</Text>}
        {showReveal && <GameButton text="Reveal the Rang" onPress={() => setGame(revealRang(game, 0))} />}
        {game.phase === 'over' && <ResultCard game={game} onPlayAgain={deal} />}

        <PlayerHand
          cards={myHand}
          hiddenCard={game.bidder === 0 ? game.hiddenCard : null}
          playable={canPlay ? legalCards(game, 0) : null}
          onCardPress={onCardPress}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: WHITE },
  content: { padding: 12, alignItems: 'center', gap: 12 },
  message: { fontSize: 15, textAlign: 'center', color: '#222' },
  turnText: { fontSize: 14, textAlign: 'center', color: ORANGE, fontWeight: 'bold' },
});
