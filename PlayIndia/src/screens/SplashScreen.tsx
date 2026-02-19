import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '../utils/AsyncStorageSafe';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    
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
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
      
      <View style={styles.overlay}>
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
          <Image
            source={require('../assets/TeamupIndia.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>
        
        {/* App name */}
        <Animated.View 
          style={[
            styles.textContainer,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.appNameSmaller}>TEAMUPINDIA</Text>
          <Text style={styles.taglineSmaller}>IND'S PREMIER SPORTS NETWORK</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 180,
    height: 180,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#2E7D32',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 12,
    color: '#558B2F',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 1,
  },
  appNameSmaller: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2E7D32',
    letterSpacing: 1,
    marginTop: 12,
  },
  taglineSmaller: {
    fontSize: 9,
    color: '#558B2F',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#558B2F',
    letterSpacing: 2,
    fontWeight: '600',
  },
});

export default SplashScreen;