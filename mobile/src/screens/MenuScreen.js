import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';

export default function MenuScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú</Text>
      <Text style={styles.subtitle}>Acceso rápido a juegos y secciones.</Text>
      <PrimaryButton label="Juegos por curso" onPress={() => navigation.navigate('Categories')} />
      <PrimaryButton label="Perfil" variant="secondary" onPress={() => navigation.navigate('Profile')} />
      <PrimaryButton label="Logros" variant="secondary" onPress={() => navigation.navigate('Achievements')} />
      <PrimaryButton label="Boutique" variant="secondary" onPress={() => navigation.navigate('Shop')} />
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
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    color: '#4b2f1b'
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 20,
    color: '#7a5b47'
  }
});
