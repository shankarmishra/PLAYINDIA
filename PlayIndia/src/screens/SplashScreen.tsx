import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions } from 'react-native';
import useAuth from '../hooks/useAuth';
import { theme } from '../theme/colors';
import BrandLogo from '../components/BrandLogo';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }: any) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [playerPosition] = useState(new Animated.ValueXY({ x: -100, y: height / 2 }));
  
  const { user, loading } = useAuth();

  // Animation for logo fade in
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Animation for player running effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(playerPosition, {
          toValue: { x: width + 100, y: height / 2 },
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(playerPosition, {
          toValue: { x: -100, y: height / 2 },
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Check authentication and redirect after delay
    const timer = setTimeout(() => {
      if (!loading) {
        if (user) {
          // Redirect based on user role
          switch (user.role) {
            case 'user':
              navigation.replace('UserDashboard');
              break;
            case 'coach':
              navigation.replace('CoachDashboard');
              break;
            case 'seller':
            case 'delivery':
              navigation.replace('StoreDashboard');
              break;
            case 'admin':
              navigation.replace('AdminDashboard');
              break;
            default:
              navigation.replace('UserDashboard');
          }
        } else {
          navigation.replace('Login');
        }
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, playerPosition, navigation, user, loading]);

  return (
    <View style={styles.container}>
      {/* Gradient background */}
      <View style={styles.background} />
      
      {/* Sports animation - running players */}
      <Animated.View
        style={[
          styles.player,
          {
            transform: [{ translateX: playerPosition.x }, { translateY: playerPosition.y }],
          },
        ]}
      >
        <Text style={styles.playerIcon}>🏃‍♂️</Text>
      </Animated.View>
      
      {/* App logo with fade animation */}
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: fadeAnim }] }}>
        <BrandLogo size={120} />
      </Animated.View>
      
      {/* App name */}
      <Animated.View style={{ opacity: fadeAnim, marginTop: theme.spacing.lg }}>
        <Text style={styles.appName}>TeamUp India</Text>
      </Animated.View>
      
      {/* Tagline */}
      <Animated.View style={{ opacity: fadeAnim, marginTop: theme.spacing.sm }}>
        <Text style={styles.tagline}>Connect. Play. Win.</Text>
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
  player: {
    position: 'absolute',
    zIndex: 1,
  },
  playerIcon: {
    fontSize: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.inverted,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: theme.colors.accent.neonGreen,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default SplashScreen;