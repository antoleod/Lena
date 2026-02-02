import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';

export default function CategoriesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Juegos por curso</Text>
      <Text style={styles.subtitle}>Elige un curso para entrar.</Text>
      <PrimaryButton label="2º de primaria" onPress={() => navigation.navigate('Games', { grade: 2 })} />
      <PrimaryButton label="3º de primaria" onPress={() => navigation.navigate('Games', { grade: 3 })} />
      <PrimaryButton label="4º de primaria" onPress={() => navigation.navigate('Games', { grade: 4 })} />
      <PrimaryButton label="Volver al menú" variant="secondary" onPress={() => navigation.goBack()} />
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
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
    color: '#234b7a'
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 20,
    color: '#4872a8'
  }
});
