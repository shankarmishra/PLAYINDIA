import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { UserTabParamList } from './types';

import UserHomeDashboard from '../screens/user/UserHomeDashboard';
import TournamentScreen from '../screens/user/TournamentScreen';
import TournamentDetailScreen from '../screens/user/TournamentDetailScreen';
import NearbyPlayersMap from '../screens/user/NearbyPlayersMap';
import ProfileScreen from '../screens/user/ProfileScreen';
import CoachProfileScreen from '../screens/user/CoachProfileScreen';
import ShopHomeScreen from '../screens/user/ShopHomeScreen';
import ProductDetailScreen from '../screens/user/ProductDetailScreen';
import CartScreen from '../screens/user/CartScreen';
import CheckoutScreen from '../screens/user/CheckoutScreen';
import OrderTrackingScreen from '../screens/user/OrderTrackingScreen';
import MyOrdersScreen from '../screens/user/MyOrdersScreen';
import WalletScreen from '../screens/user/WalletScreen';
import UserSettingsScreen from '../screens/user/SettingsScreen';
import HelpSupportScreen from '../screens/user/HelpSupportScreen';
import NotificationsScreen from '../screens/user/NotificationsScreen';
import ChatScreen from '../screens/user/ChatScreen';
import LeaderBoardScreen from '../screens/user/LeaderBoardScreen';
import FindPlayersFormScreen from '../screens/user/FindPlayersFormScreen';
import LiveSearchMapScreen from '../screens/user/LiveSearchMapScreen';
import LiveMapScreen from '../screens/user/LiveMapScreen';
import EditProfileScreen from '../screens/user/EditProfileScreen';
import MyBookingsScreen from '../screens/user/MyBookingsScreen';

// Missing settings screens
import SecurityScreen from '../screens/user/SecurityScreen';
import AboutScreen from '../screens/user/AboutScreen';
import TermsScreen from '../screens/user/TermsScreen';
import PrivacyPolicyScreen from '../screens/user/PrivacyPolicyScreen';


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
          } else if (route.name === 'FindPlayers') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'ShopHome') {
            iconName = focused ? 'bag' : 'bag-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E8F5E9',
          elevation: 20,
          shadowColor: '#2E7D32',
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.12,
          shadowRadius: 15,
          position: 'absolute',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
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
        options={{ tabBarLabel: 'Events' }}
      />
      <Tab.Screen
        name="FindPlayers"
        component={FindPlayersFormScreen}
        options={{ tabBarLabel: 'Search' }}
      />
      <Tab.Screen
        name="ShopHome"
        component={ShopHomeScreen}
        options={{ tabBarLabel: 'Shop' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Me' }}
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
      <Stack.Screen name="FindPlayersForm" component={FindPlayersFormScreen} />
      <Stack.Screen name="LiveSearchMap" component={LiveSearchMapScreen} />
      <Stack.Screen name="LiveMap" component={LiveMapScreen} />
      <Stack.Screen name="CoachProfile" component={CoachProfileScreen} />
      <Stack.Screen name="PlayersRank" component={LeaderBoardScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Settings" component={UserSettingsScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Bookings" component={MyBookingsScreen} />
    </Stack.Navigator>
  );
};

export default UserNav;
