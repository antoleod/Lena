import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lena</Text>
      <Text style={styles.subtitle}>Bienvenida. Empieza tu aventura en móvil.</Text>
      <PrimaryButton label="Entrar" onPress={() => navigation.replace('Menu')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f6f2ff'
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 12,
    color: '#3b2a5b'
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 28,
    color: '#5f5188'
  }
});
