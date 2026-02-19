import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

// Import your actual screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/user/LoginScreen';
import RegisterScreen from '../screens/user/RegisterScreen';
import UserHomeDashboard from '../screens/user/UserHomeDashboard';
import TournamentScreen from '../screens/user/TournamentScreen';
import ProfileScreen from '../screens/user/ProfileScreen';

const SimpleNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState('Splash');
  
  const navigation = {
    navigate: (screen: string) => setCurrentScreen(screen),
    goBack: () => {
      if (currentScreen === 'Login') setCurrentScreen('Splash');
      if (currentScreen === 'Register') setCurrentScreen('Splash');
      if (currentScreen === 'UserMain') setCurrentScreen('Splash');
    },
    dispatch: (action: any) => {
      // Handle navigation actions
      if (action.type === 'RESET' && action.payload?.routes?.[0]?.name) {
        setCurrentScreen(action.payload.routes[0].name);
      }
    }
  } as any;
  
  const route = { params: {} } as any;
  const screenProps = { navigation, route };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Splash':
        // @ts-ignore
        return <SplashScreen {...screenProps} />;
      case 'Login':
        // @ts-ignore
        return <LoginScreen {...screenProps} />;
      case 'Register':
        // @ts-ignore
        return <RegisterScreen {...screenProps} />;
      case 'UserMain':
        // @ts-ignore
        return <UserHomeDashboard {...screenProps} />;
      case 'Tournaments':
        // @ts-ignore
        return <TournamentScreen {...screenProps} />;
      case 'Profile':
        // @ts-ignore
        return <ProfileScreen {...screenProps} />;
      default:
        // @ts-ignore
        return <SplashScreen {...screenProps} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default SimpleNavigator;