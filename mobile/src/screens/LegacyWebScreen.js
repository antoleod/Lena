import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { WEB_BASE_URL } from '../constants/config';

export default function LegacyWebScreen({ route }) {
  const { path } = route.params || { path: '' };
  const uri = path ? `${WEB_BASE_URL}${path}` : WEB_BASE_URL;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#7b5bff" />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  }
});
