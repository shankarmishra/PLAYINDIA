import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

// Delivery-specific screens
import DeliveryDashboardScreen from '../screens/delivery/DashboardScreen';
import DeliveryProfileScreen from '../screens/delivery/ProfileScreen';
import DeliveryOrdersScreen from '../screens/delivery/OrdersScreen';
import ActiveDeliveryScreen from '../screens/delivery/ActiveDeliveryScreen';
import WalletScreen from '../screens/user/WalletScreen';
import SettingsScreen from '../screens/user/SettingsScreen';
import HelpSupportScreen from '../screens/user/HelpSupportScreen';
import NotificationsScreen from '../screens/user/NotificationsScreen';
import ChatScreen from '../screens/user/ChatScreen';

export type DeliveryTabParamList = {
  HomeTab: undefined;
  Dashboard: undefined;
  Orders: undefined;
  ActiveDelivery: undefined;
  Profile: undefined;
  Wallet: undefined;
  Settings: undefined;
  HelpSupport: undefined;
  Notifications: undefined;
  Chat: { userId?: string };
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<DeliveryTabParamList>();

// Tab Navigator Component for Delivery
const DeliveryTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'ActiveDelivery') {
            iconName = focused ? 'bicycle' : 'bicycle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6A00', // Orange for delivery
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
      <Tab.Screen name="Dashboard" component={DeliveryDashboardScreen} />
      <Tab.Screen name="Orders" component={DeliveryOrdersScreen} />
      <Tab.Screen name="ActiveDelivery" component={ActiveDeliveryScreen} />
      <Tab.Screen name="Profile" component={DeliveryProfileScreen} />
    </Tab.Navigator>
  );
};

const DeliveryNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeTab" component={DeliveryTabNavigator} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default DeliveryNav;