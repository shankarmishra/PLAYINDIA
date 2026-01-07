import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Store-specific screens
import StoreDashboardScreen from '../screens/store/DashboardScreen';
import StoreProfileScreen from '../screens/store/ProfileScreen';
import ManageProductsScreen from '../screens/store/ManageProductsScreen';
import OrdersScreen from '../screens/store/OrdersScreen';
import ListProductScreen from '../screens/store/ListProductScreen';
import WalletScreen from '../screens/user/WalletScreen';
import SettingsScreen from '../screens/user/SettingsScreen';
import HelpSupportScreen from '../screens/user/HelpSupportScreen';
import NotificationsScreen from '../screens/user/NotificationsScreen';
import ChatScreen from '../screens/user/ChatScreen';

export type StoreTabParamList = {
  HomeTab: undefined;
  Dashboard: undefined;
  ManageProducts: undefined;
  Orders: undefined;
  Profile: undefined;
  ListProduct: undefined;
  Wallet: undefined;
  Settings: undefined;
  HelpSupport: undefined;
  Notifications: undefined;
  Chat: { userId?: string };
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<StoreTabParamList>();

// Tab Navigator Component for Store
const StoreTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ManageProducts') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'cart' : 'cart-outline';
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
      <Tab.Screen name="Dashboard" component={StoreDashboardScreen} />
      <Tab.Screen name="ManageProducts" component={ManageProductsScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={StoreProfileScreen} />
    </Tab.Navigator>
  );
};

const StoreNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeTab" component={StoreTabNavigator} />
      <Stack.Screen name="ListProduct" component={ListProductScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default StoreNav;