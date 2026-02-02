import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { getGame } from '../data/games';
import { markLevelCompleted } from '../storage/progress';

function normalize(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('fr-FR');
}

export default function ExerciseScreen({ route, navigation }) {
  const { gameId, level } = route.params;
  const game = useMemo(() => getGame(gameId), [gameId]);
  const levelData = useMemo(() => game?.levels.find(l => l.level === level), [game, level]);
  const exercises = levelData?.exercises || [];
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const feedbackAnim = useRef(new Animated.Value(0)).current;
  const nextTimerRef = useRef(null);

  const current = exercises[index];
  const progress = exercises.length ? (index + 1) / exercises.length : 0;

  useEffect(() => {
    return () => {
      if (nextTimerRef.current) {
        clearTimeout(nextTimerRef.current);
      }
    };
  }, []);

  const resetState = useCallback(() => {
    setSelected(null);
    setInputValue('');
    setFeedback(null);
    setIsLocked(false);
    feedbackAnim.setValue(0);
  }, [feedbackAnim]);

  const showFeedback = useCallback((message, kind) => {
    setFeedback({ message, kind });
    setIsLocked(true);
    feedbackAnim.setValue(0);
    Animated.sequence([
      Animated.timing(feedbackAnim, { toValue: 1, duration: 160, useNativeDriver: true }),
      Animated.delay(700),
      Animated.timing(feedbackAnim, { toValue: 0, duration: 120, useNativeDriver: true })
    ]).start();
  }, [feedbackAnim]);

  const next = useCallback(async () => {
    if (index + 1 >= exercises.length) {
      await markLevelCompleted(gameId, level);
      navigation.goBack();
      return;
    }
    setIndex(index + 1);
    resetState();
  }, [exercises.length, gameId, index, level, navigation, resetState]);

  const scheduleNext = useCallback(() => {
    if (nextTimerRef.current) {
      clearTimeout(nextTimerRef.current);
    }
    nextTimerRef.current = setTimeout(() => {
      next();
    }, 550);
  }, [next]);

  const selectOption = useCallback((option) => {
    if (isLocked) return;
    setSelected(option);
    if (!current) return;
    if (option === current.answer) {
      showFeedback('Bravo !', 'success');
      scheduleNext();
    } else {
      showFeedback('R\u00e9essaie', 'error');
      setIsLocked(false);
    }
  }, [current, isLocked, scheduleNext, showFeedback]);

  const handleInputChange = useCallback((value) => {
    setInputValue(value);
    if (isLocked) return;
    if (!current) return;
    const expected = String(current.answer || '').trim();
    const normalized = normalize(value);
    if (normalized === normalize(expected)) {
      showFeedback('Bravo !', 'success');
      scheduleNext();
      return;
    }
    if (value.trim().length >= expected.length && expected.length > 0) {
      showFeedback('R\u00e9essaie', 'error');
      setIsLocked(false);
    }
  }, [current, isLocked, scheduleNext, showFeedback]);

  if (!current) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Aucun exercice</Text>
        <PrimaryButton label="Volver" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const feedbackStyle = [
    styles.feedback,
    feedback?.kind === 'success' && styles.feedbackSuccess,
    feedback?.kind === 'error' && styles.feedbackError,
    {
      opacity: feedbackAnim,
      transform: [{ scale: feedbackAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }]
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{game?.title}</Text>
      <Text style={styles.subtitle}>Nivel {level} \u00b7 Exercice {index + 1}/{exercises.length}</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>
      <View style={styles.card}>
        <Text style={styles.prompt}>{current.prompt}</Text>
        {current.hint && <Text style={styles.hint}>\uD83D\uDCA1 {current.hint}</Text>}
      </View>

      {current.type === 'input' ? (
        <View style={styles.inputArea}>
          <TextInput
            value={inputValue}
            onChangeText={handleInputChange}
            placeholder="\u00c9cris ici"
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLocked}
          />
        </View>
      ) : (
        <View style={styles.options}>
          {(current.options || []).map(option => (
            <PrimaryButton
              key={option}
              label={option}
              variant={selected === option ? 'secondary' : 'primary'}
              onPress={() => selectOption(option)}
              disabled={isLocked}
            />
          ))}
        </View>
      )}

      {feedback && (
        <Animated.View style={feedbackStyle}>
          <Text style={styles.feedbackText}>{feedback.message}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#eef7ff'
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
    color: '#234b7a'
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 12,
    color: '#4c78a8'
  },
  progressBar: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#d7e3f6',
    overflow: 'hidden',
    marginBottom: 12
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7b5bff'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  prompt: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d2d3a'
  },
  hint: {
    marginTop: 8,
    color: '#6b7f99'
  },
  options: {
    marginBottom: 12
  },
  inputArea: {
    marginBottom: 12
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d7e2',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  feedback: {
    marginBottom: 12,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center'
  },
  feedbackSuccess: {
    backgroundColor: '#e6f8ee'
  },
  feedbackError: {
    backgroundColor: '#ffe8ee'
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d2d2d'
  }
});
