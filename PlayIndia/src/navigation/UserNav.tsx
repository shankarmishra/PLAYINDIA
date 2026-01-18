import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import UserHomeDashboard from '../screens/user/UserHomeDashboard';
import TournamentScreen from '../screens/user/TournamentScreen';
import TournamentDetailScreen from '../screens/user/TournamentDetailScreen';
import NearbyPlayersMap from '../screens/user/NearbyPlayersMap';
import ProfileScreen from '../screens/user/ProfileScreen';
import FindCoachScreen from '../screens/user/FindCoachScreen';
import CoachProfileScreen from '../screens/user/CoachProfileScreen';
import ShopHomeScreen from '../screens/user/ShopHomeScreen';
import ProductDetailScreen from '../screens/user/ProductDetailScreen';
import CartScreen from '../screens/user/CartScreen';
import OrderTrackingScreen from '../screens/user/OrderTrackingScreen';
import WalletScreen from '../screens/user/WalletScreen';
import SettingsScreen from '../screens/user/SettingsScreen';
import HelpSupportScreen from '../screens/user/HelpSupportScreen';
import NotificationsScreen from '../screens/user/NotificationsScreen';
import ChatScreen from '../screens/user/ChatScreen';
import LeaderBoardScreen from '../screens/user/LeaderBoardScreen';

export type UserTabParamList = {
  HomeTab: undefined;
  Home: undefined;
  Tournaments: undefined;
  TournamentDetail: { tournamentId: string };
  FindNearbyPlayers: undefined;
  ShopHome: undefined;
  FindCoach: undefined;
  Profile: undefined;
  CoachProfile: { coachId?: string };
  ProductDetail: { productId?: string };
  Cart: undefined;
  OrderTracking: { orderId?: string };
  Wallet: undefined;
  Settings: undefined;
  HelpSupport: undefined;
  Notifications: undefined;
  Chat: { userId?: string };
  NearbyPlayers: undefined; // Still accessible from stack, not as tab
  PlayersRank: undefined; // Still accessible from stack, not as tab
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
          } else if (route.name === 'Tournaments') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'FindNearbyPlayers') {
            iconName = focused ? 'location' : 'location-outline';
          } else if (route.name === 'ShopHome') {
            iconName = focused ? 'bag' : 'bag-outline';
          } else if (route.name === 'FindCoach') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1ED760',
        tabBarInactiveTintColor: '#9CA3AF',
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
          fontSize: 10,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={UserHomeDashboard}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Tournaments" 
        component={TournamentScreen}
        options={{ tabBarLabel: 'Tournaments' }}
      />
      <Tab.Screen 
        name="FindNearbyPlayers" 
        component={NearbyPlayersMap}
        options={{ tabBarLabel: 'Find Players' }}
      />
      <Tab.Screen 
        name="ShopHome" 
        component={ShopHomeScreen}
        options={{ tabBarLabel: 'Shop' }}
      />
      <Tab.Screen 
        name="FindCoach" 
        component={FindCoachScreen}
        options={{ tabBarLabel: 'Coach' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const UserNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeTab" component={TabNavigator} />
      <Stack.Screen name="TournamentDetail" component={TournamentDetailScreen} />
      <Stack.Screen name="NearbyPlayers" component={NearbyPlayersMap} />
      <Stack.Screen name="CoachProfile" component={CoachProfileScreen} />
      <Stack.Screen name="PlayersRank" component={LeaderBoardScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default UserNav;

