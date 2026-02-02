import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';
import MenuScreen from './src/screens/MenuScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import GamesScreen from './src/screens/GamesScreen';
import LevelsScreen from './src/screens/LevelsScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import PlaceholderScreen from './src/screens/PlaceholderScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'Menú' }} />
        <Stack.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Cursos' }} />
        <Stack.Screen name="Games" component={GamesScreen} options={{ title: 'Juegos' }} />
        <Stack.Screen name="Levels" component={LevelsScreen} options={{ title: 'Niveles' }} />
        <Stack.Screen name="Exercise" component={ExerciseScreen} options={{ title: 'Ejercicio' }} />
        <Stack.Screen
          name="Profile"
          component={PlaceholderScreen}
          initialParams={{ title: 'Perfil', subtitle: 'Datos del jugador (pendiente de migración).' }}
          options={{ title: 'Perfil' }}
        />
        <Stack.Screen
          name="Achievements"
          component={PlaceholderScreen}
          initialParams={{ title: 'Logros', subtitle: 'Historial y premios (pendiente de migración).' }}
          options={{ title: 'Logros' }}
        />
        <Stack.Screen
          name="Shop"
          component={PlaceholderScreen}
          initialParams={{ title: 'Boutique', subtitle: 'Recompensas (pendiente de migración).' }}
          options={{ title: 'Boutique' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
