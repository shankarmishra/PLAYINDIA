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

export type UserTabParamList = {
  HomeTab: undefined;
  Home: undefined;
  Tournaments: undefined;
  TournamentDetail: { tournamentId: string };
  NearbyPlayers: undefined;
  Profile: undefined;
  FindCoach: undefined;
  CoachProfile: { coachId?: string };
  ShopHome: undefined;
  ProductDetail: { productId?: string };
  Cart: undefined;
  OrderTracking: { orderId?: string };
  Wallet: undefined;
  Settings: undefined;
  HelpSupport: undefined;
  Notifications: undefined;
  Chat: { userId?: string };
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
          } else if (route.name === 'NearbyPlayers') {
            iconName = focused ? 'people' : 'people-outline';
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
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Home" component={UserHomeDashboard} />
      <Tab.Screen name="Tournaments" component={TournamentScreen} />
      <Tab.Screen name="NearbyPlayers" component={NearbyPlayersMap} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
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
      <Stack.Screen name="FindCoach" component={FindCoachScreen} />
      <Stack.Screen name="CoachProfile" component={CoachProfileScreen} />
      <Stack.Screen name="ShopHome" component={ShopHomeScreen} />
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

