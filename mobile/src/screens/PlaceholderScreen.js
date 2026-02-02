import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';

export default function PlaceholderScreen({ route, navigation }) {
  const { title, subtitle } = route.params || {};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title || 'Pantalla'}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <PrimaryButton label="Volver" variant="secondary" onPress={() => navigation.goBack()} />
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
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    color: '#3b2a5b'
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 16,
    color: '#5f5188'
  }
});
