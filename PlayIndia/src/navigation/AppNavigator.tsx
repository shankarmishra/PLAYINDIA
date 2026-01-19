import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '../utils/AsyncStorageSafe';

// Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/user/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import UserTabNavigator from './UserNav'; // User dashboard
import CoachNav from './CoachNav'; // Coach dashboard
import StoreNav from './StoreNav'; // Store dashboard
import StoreApprovalTrackingScreen from '../screens/store/StoreApprovalTrackingScreen';
import DeliveryNav from './DeliveryNav'; // Delivery dashboard
import AdminNav from './AdminNav'; // Admin dashboard

// Onboarding screens
import OnboardingOne from '../screens/SPLASH/OnboardingOne';
import OnboardingTwo from '../screens/SPLASH/OnboardingTwo';
import OnboardingThree from '../screens/SPLASH/OnboardingThree';
import LoginWelcome from '../screens/SPLASH/LoginWelcome';

// Define stack param list
export type RootStackParamList = {
  Splash: undefined;
  OnboardingOne: undefined;
  OnboardingTwo: undefined;
  OnboardingThree: undefined;
  LoginWelcome: undefined;
  Login: undefined;
  Register: undefined;
  UserMain: undefined;
  CoachMain: undefined;
  StoreMain: undefined;
  StoreApprovalTracking: undefined;
  DeliveryMain: undefined;
  AdminMain: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Splash');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Wait a bit for splash screen
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const token = await AsyncStorage.getItem('userToken');
        const userType = await AsyncStorage.getItem('userType');
        
        if (token && userType) {
          switch (userType) {
            case 'coach':
              setInitialRoute('CoachMain');
              break;
            case 'store':
            case 'seller':
              setInitialRoute('StoreMain');
              break;
            case 'delivery':
              setInitialRoute('DeliveryMain');
              break;
            case 'admin':
              setInitialRoute('AdminMain');
              break;
            default:
              setInitialRoute('UserMain');
          }
        } else {
          setInitialRoute('Splash');
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        setInitialRoute('Splash');
      } finally {
        setLoading(false);
      }
    };
    
    checkUserStatus();
  }, []);

  // Always render NavigationContainer, even during loading
  // The SplashScreen will handle the initial navigation
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="OnboardingOne" component={OnboardingOne} />
        <Stack.Screen name="OnboardingTwo" component={OnboardingTwo} />
        <Stack.Screen name="OnboardingThree" component={OnboardingThree} />
        <Stack.Screen name="LoginWelcome" component={LoginWelcome} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="UserMain" component={UserTabNavigator} />
        <Stack.Screen name="CoachMain" component={CoachNav} />
        <Stack.Screen name="StoreMain" component={StoreNav} />
        <Stack.Screen name="StoreApprovalTracking" component={StoreApprovalTrackingScreen} />
        <Stack.Screen name="DeliveryMain" component={DeliveryNav} />
        <Stack.Screen name="AdminMain" component={AdminNav} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;