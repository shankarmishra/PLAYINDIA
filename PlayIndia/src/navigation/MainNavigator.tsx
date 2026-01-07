import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// User Screens
import UserHomeDashboard from '../screens/user/UserHomeDashboard';
import FindPlayersScreen from '../screens/user/FindPlayersScreen';
import TournamentScreen from '../screens/user/TournamentScreen';
import ProfileScreen from '../screens/user/ProfileScreen';

// Common Screens
// import LoginScreen from '../screens/user/LoginScreen';
// import RegisterScreen from '../screens/user/RegisterScreen';
import SplashScreen from '../screens/SplashScreen';

// Navigation components
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// User Tab Navigator
const UserTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Tournaments') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Find Players') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1ED760', // Neon green accent
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={UserHomeDashboard} />
      <Tab.Screen name="Tournaments" component={TournamentScreen} />
      <Tab.Screen name="Find Players" component={FindPlayersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Main Navigator
const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }} 
        />
        {/* 
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }} 
        />
        */}
        <Stack.Screen 
          name="UserDashboard" 
          component={UserTabNavigator} 
          options={{ headerShown: false }} 
        />
        {/* Coach Dashboard */}
        <Stack.Screen 
          name="CoachDashboard" 
          component={UserTabNavigator} // Using same tab navigator for now
          options={{ headerShown: false }} 
        />
        {/* Store Dashboard */}
        <Stack.Screen 
          name="StoreDashboard" 
          component={UserTabNavigator} // Using same tab navigator for now
          options={{ headerShown: false }} 
        />
        {/* Delivery Dashboard */}
        <Stack.Screen 
          name="DeliveryDashboard" 
          component={UserTabNavigator} // Using same tab navigator for now
          options={{ headerShown: false }} 
        />
        {/* Admin Dashboard */}
        <Stack.Screen 
          name="AdminDashboard" 
          component={UserTabNavigator} // Using same tab navigator for now
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;