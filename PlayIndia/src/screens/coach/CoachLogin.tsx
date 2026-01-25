import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;

// This screen redirects to the unified Login screen
// All users (store, seller, user, coach, delivery, admin) use the same login page
export default function CoachLogin() {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    // Redirect to the unified login screen
    navigation.replace('Login');
  }, [navigation]);

  return null; // This component just redirects, doesn't render anything
}
