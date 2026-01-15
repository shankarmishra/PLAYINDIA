import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '../utils/AsyncStorageSafe';
import { theme } from '../theme/colors';
import BrandLogo from '../components/BrandLogo';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width, height } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 15,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Check authentication and redirect
    const checkAuthAndNavigate = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2500)); // Minimum splash duration
        
        const token = await AsyncStorage.getItem('userToken');
        const userType = await AsyncStorage.getItem('userType');
        
        if (token && userType) {
          // Navigate based on user type
          switch (userType) {
            case 'coach':
              navigation.replace('CoachMain');
              break;
            case 'store':
            case 'seller':
              navigation.replace('StoreMain');
              break;
            case 'delivery':
              navigation.replace('DeliveryMain');
              break;
            case 'admin':
              navigation.replace('AdminMain');
              break;
            default:
              navigation.replace('UserMain');
          }
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        navigation.replace('Login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndNavigate();
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary.navy} />
      
      {/* Background gradient effect */}
      <View style={styles.background} />
      
      {/* App logo with animations */}
      <Animated.View 
        style={[
          styles.logoContainer,
          { 
            opacity: fadeAnim, 
            transform: [{ scale: scaleAnim }] 
          }
        ]}
      >
        <BrandLogo size={120} />
      </Animated.View>
      
      {/* App name */}
      <Animated.View 
        style={[
          styles.textContainer,
          { opacity: fadeAnim }
        ]}
      >
        <Text style={styles.appName}>PLAYINDIA</Text>
        <Text style={styles.tagline}>IND'S PREMIER SPORTS NETWORK</Text>
      </Animated.View>
      
      {/* Loading indicator */}
      <Animated.View 
        style={[
          styles.footer,
          { opacity: fadeAnim }
        ]}
      >
        <Text style={styles.footerText}>CONNECT. PLAY. COMPETE.</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.navy,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary.navy,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: theme.colors.text.inverted,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: theme.spacing.sm,
  },
  tagline: {
    fontSize: 14,
    color: theme.colors.accent.neonGreen,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    letterSpacing: 2,
    fontWeight: '600',
  },
});

export default SplashScreen;