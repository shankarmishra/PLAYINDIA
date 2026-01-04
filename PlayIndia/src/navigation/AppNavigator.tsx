import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import SplashScreen from '../screens/SPLASH/SplashScreen';
import OnboardingOne from '../screens/SPLASH/OnboardingOne';
import OnboardingTwo from '../screens/SPLASH/OnboardingTwo';
import OnboardingThree from '../screens/SPLASH/OnboardingThree';
import LoginWelcome from '../screens/SPLASH/LoginWelcome';
import UserNav from './UserNav';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="OnboardingOne" component={OnboardingOne} />
        <Stack.Screen name="OnboardingTwo" component={OnboardingTwo} />
        <Stack.Screen name="OnboardingThree" component={OnboardingThree} />
        <Stack.Screen name="Main" component={UserNav} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

