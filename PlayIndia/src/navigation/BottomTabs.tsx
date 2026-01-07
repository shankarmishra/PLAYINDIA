import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';

import HomeScreen from '../pages/user/HomeScreen';
import BookingScreen from '../pages/user/BookingScreen';
import LeaderBoardScreen from '../pages/user/LeaderBoardScreen';
import ProfileScreen from '../pages/user/ProfileScreen';

const Tab = createBottomTabNavigator();

const getTabIcon = (routeName: string, focused: boolean) => {
  let iconName = '';

  switch (routeName) {
    case 'Home':
      iconName = focused ? '🏠' : '🏡';
      break;
    case 'Bookings':
      iconName = focused ? '📅' : '📆';
      break;
    case 'Leaderboard':
      iconName = focused ? '🏆' : '🥇';
      break;
    case 'Profile':
      iconName = focused ? '👤' : '👥';
      break;
    default:
      iconName = '❓';
  }

  return <Text style={styles.icon}>{iconName}</Text>;
};

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => getTabIcon(route.name, focused),
        tabBarActiveTintColor: '#2A2E5B',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
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

const styles = StyleSheet.create({
  icon: {
    fontSize: 20,
  },
});

export default BottomTabs;
