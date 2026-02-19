/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/contexts/CartContext';
import { LocationProvider } from './src/context/LocationContext';
import { FitnessProvider } from './src/contexts/FitnessContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <LocationProvider>
        <CartProvider>
          <FitnessProvider>
            <StatusBar />
            <AppNavigator />
          </FitnessProvider>
        </CartProvider>
      </LocationProvider>
    </SafeAreaProvider>
  );
}
