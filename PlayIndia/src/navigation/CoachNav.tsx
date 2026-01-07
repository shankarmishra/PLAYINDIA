import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Coach-specific screens
import CoachDashboardScreen from '../screens/coach/DashboardScreen';
import CoachProfileScreen from '../screens/coach/ProfileScreen';
import ManagePlayersScreen from '../screens/coach/ManagePlayersScreen';
import TrainingSessionsScreen from '../screens/coach/TrainingSessionsScreen';
import JoinRequestsScreen from '../screens/coach/JoinRequestsScreen';
import ManageTournamentsScreen from '../screens/coach/ManageTournamentsScreen';
import PlayerPerformanceScreen from '../screens/coach/PlayerPerformanceScreen';
import CreateTournamentScreen from '../screens/coach/CreateTournamentScreen';
import WalletScreen from '../screens/user/WalletScreen';
import SettingsScreen from '../screens/user/SettingsScreen';
import HelpSupportScreen from '../screens/user/HelpSupportScreen';
import NotificationsScreen from '../screens/user/NotificationsScreen';
import ChatScreen from '../screens/user/ChatScreen';

export type CoachTabParamList = {
  HomeTab: undefined;
  Dashboard: undefined;
  ManagePlayers: undefined;
  TrainingSessions: undefined;
  Profile: undefined;
  JoinRequests: undefined;
  ManageTournaments: undefined;
  PlayerPerformance: undefined;
  CreateTournament: undefined;
  Wallet: undefined;
  Settings: undefined;
  HelpSupport: undefined;
  Notifications: undefined;
  Chat: { userId?: string };
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<CoachTabParamList>();

// Tab Navigator Component for Coach
const CoachTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ManagePlayers') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'TrainingSessions') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1ED760',
        tabBarInactiveTintColor: 'gray',
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
      <Tab.Screen name="Dashboard" component={CoachDashboardScreen} />
      <Tab.Screen name="ManagePlayers" component={ManagePlayersScreen} />
      <Tab.Screen name="TrainingSessions" component={TrainingSessionsScreen} />
      <Tab.Screen name="Profile" component={CoachProfileScreen} />
    </Tab.Navigator>
  );
};

const CoachNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeTab" component={CoachTabNavigator} />
      <Stack.Screen name="JoinRequests" component={JoinRequestsScreen} />
      <Stack.Screen name="ManageTournaments" component={ManageTournamentsScreen} />
      <Stack.Screen name="PlayerPerformance" component={PlayerPerformanceScreen} />
      <Stack.Screen name="CreateTournament" component={CreateTournamentScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default CoachNav;