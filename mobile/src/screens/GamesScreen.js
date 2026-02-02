import { FlatList, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { gamesByGrade } from '../data/games';

export default function GamesScreen({ route, navigation }) {
  const { grade } = route.params;
  const list = gamesByGrade(grade);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Juegos {grade}º</Text>
      <Text style={styles.subtitle}>Elige un juego para empezar.</Text>
      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PrimaryButton
            label={item.title}
            onPress={() => navigation.navigate('Levels', { gameId: item.id, grade })}
          />
        )}
      />
      {list.length === 0 && (
        <Text style={styles.empty}>Sin juegos cargados todavía.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f6f2ff'
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
    color: '#3b2a5b'
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 16,
    color: '#5f5188'
  },
  empty: {
    marginTop: 16,
    color: '#8b7bb1'
  }
});
