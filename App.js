import * as React from 'react';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScreenStack } from 'react-native-screens';
import Home from './Screens/Home';
import * as SQLite from "expo-sqlite";
import FightEnemy from './Screens/FightEnemy';


export default function App() {

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Fight"
          component={FightEnemy}
          options={{ title: "Fighting" }}
        />

      </Stack.Navigator>

    </NavigationContainer>
  );
}
