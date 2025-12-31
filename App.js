import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Menu from './src/screens/Menu';
import GrandMastersTemple from './src/screens/GrandMastersTemple';
import WorkingMemory from './src/components/games/WorkingMemory/WorkingMemory';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Menu">
          <Stack.Screen name="Menu" component={Menu} />
          <Stack.Screen name="GrandMastersTemple" component={GrandMastersTemple} />
          <Stack.Screen name="WorkingMemory" component={WorkingMemory} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
