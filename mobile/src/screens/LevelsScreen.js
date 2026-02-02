import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { getGame } from '../data/games';
import { isLevelCompleted, loadProgress } from '../storage/progress';

export default function LevelsScreen({ route, navigation }) {
  const { gameId, grade } = route.params;
  const game = useMemo(() => getGame(gameId), [gameId]);
  const levels = useMemo(() => (game?.levels || []).filter(level => level.grade === grade), [game, grade]);
  const [completedMap, setCompletedMap] = useState({});

  const refresh = useCallback(async () => {
    const progress = await loadProgress();
    setCompletedMap(progress?.[gameId]?.completed || {});
  }, [gameId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', refresh);
    refresh();
    return unsubscribe;
  }, [navigation, refresh]);

  const renderItem = useCallback(({ item }) => {
    const done = !!completedMap[item.level];
    return (
      <PrimaryButton
        label={`Nivel ${item.level}${done ? ' ?' : ''}`}
        onPress={() => navigation.navigate('Exercise', { gameId, level: item.level })}
      />
    );
  }, [completedMap, gameId, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{game?.title || 'Juego'}</Text>
      <Text style={styles.subtitle}>Elige un nivel</Text>
      <FlatList
        data={levels}
        keyExtractor={(item) => `${item.level}`}
        renderItem={renderItem}
        initialNumToRender={8}
        windowSize={5}
        removeClippedSubviews
      />
      {levels.length === 0 && (
        <Text style={styles.empty}>No hay niveles para este curso.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff8ef'
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    color: '#4b2f1b'
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
    color: '#7a5b47'
  },
  empty: {
    marginTop: 16,
    color: '#9b7a64'
  }
});
