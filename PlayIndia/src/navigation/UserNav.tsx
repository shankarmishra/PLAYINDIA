import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import useAuth from '../hooks/useAuth';
import LoginScreen from '../screens/user/LoginScreen';
import RegisterScreen from '../screens/user/RegisterScreen';
import HomeScreen from '../screens/user/HomeScreen';
import BookingScreen from '../screens/user/BookingScreen';
import LeaderBoardScreen from '../screens/user/LeaderBoardScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import TournamentDetailScreen from '../screens/user/TournamentDetailScreen';

export type UserTabParamList = {
  HomeTab: undefined;
  Home: undefined;
  Bookings: undefined;
  Leaderboard: undefined;
  Profile: undefined;
  TournamentDetail: { tournamentId?: string };
  Login: undefined;
  Register: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<UserTabParamList>();

// Tab Navigator Component
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Leaderboard') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00B8D4',
        tabBarInactiveTintColor: '#718096',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bookings" component={BookingScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderBoardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const UserNav = () => {
  const { user } = useAuth();

  // If user is authenticated, start with HomeTab, otherwise start with Login
  const initialRoute = user ? 'HomeTab' : 'Login';

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="HomeTab" component={TabNavigator} />
      <Stack.Screen
        name="TournamentDetail"
        component={TournamentDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default UserNav;

