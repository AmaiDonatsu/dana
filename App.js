import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { View, ActivityIndicator } from 'react-native';

// Pantallas Principales
import Menu from './src/screens/Menu';
import GrandMastersTemple from './src/screens/GrandMastersTemple';
import WorkingMemory from './src/components/games/WorkingMemory/WorkingMemory';
import Duel from './src/components/Duel';

// Pantallas de Auth
import Login from './src/screens/auth/Login';
import SignIng from './src/screens/auth/SignIng';
import UserProfile from './src/screens/auth/User';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function handleAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const auth = getAuth();
    const subscriber = onAuthStateChanged(auth, handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            // Auth Stack
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="SignIng" component={SignIng} />
            </>
          ) : (
            // App Stack
            <>
              <Stack.Screen name="Menu" component={Menu} />
              <Stack.Screen name="GrandMastersTemple" component={GrandMastersTemple} />
              <Stack.Screen name="Duel" component={Duel} />
              <Stack.Screen name="UserProfile" component={UserProfile} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
