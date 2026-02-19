import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, StatusBar, Image, Alert, Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from '../../utils/LinearGradientSafe';
import { PermissionsAndroid } from 'react-native';
import AsyncStorage from '../../utils/AsyncStorageSafe';

type NavigationProp = StackNavigationProp<RootStackParamList, 'LocationPermission'>;

const LocationPermissionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to find nearby players.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        
        // Mark that we've shown the permission screen
        await AsyncStorage.setItem('locationPermissionShown', 'true');
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission granted - navigate to home
          navigation.reset({
            index: 0,
            routes: [{ name: 'UserMain' }],
          });
        } else {
          // Permission denied - still go to home
          navigation.reset({
            index: 0,
            routes: [{ name: 'UserMain' }],
          });
        }
      } else {
        // For iOS or other platforms
        await AsyncStorage.setItem('locationPermissionShown', 'true');
        navigation.reset({
          index: 0,
          routes: [{ name: 'UserMain' }],
        });
      }
    } catch (err) {
      console.warn('Permission error:', err);
      // Even on error, go to home
      await AsyncStorage.setItem('locationPermissionShown', 'true');
      navigation.reset({
        index: 0,
        routes: [{ name: 'UserMain' }],
      });
    }
  };

  const skipPermission = async () => {
    // Mark that we've shown the permission screen
    await AsyncStorage.setItem('locationPermissionShown', 'true');
    navigation.reset({
      index: 0,
      routes: [{ name: 'UserMain' }],
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
      
      <Animated.View 
        style={[
          styles.contentContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        {/* Location Icon Animation */}
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.iconCircle}>
            <Icon name="location" size={60} color="#4CAF50" />
          </View>
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>
          Enable Location
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          We need your location to find nearby players and matches in your area.
        </Text>

        {/* Features List */}
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Icon name="people" size={22} color="#4CAF50" />
            <Text style={styles.featureText}>Find players near you</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="map" size={22} color="#4CAF50" />
            <Text style={styles.featureText}>See nearby matches</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="navigate" size={22} color="#4CAF50" />
            <Text style={styles.featureText}>Get directions to venues</Text>
          </View>
        </View>

        {/* Allow Button */}
        <TouchableOpacity
          style={styles.allowButton}
          onPress={requestLocationPermission}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#4CAF50', '#43A047', '#4CAF50']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Icon name="location" size={20} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Allow Location</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Skip Button */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={skipPermission}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>

        {/* Privacy Note */}
        <Text style={styles.privacyNote}>
          Your location is only used to find nearby players and is never shared with others.
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    marginBottom: 30,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#C8E6C9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1B5E20',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#558B2F',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    opacity: 0.9,
  },
  featuresList: {
    width: '100%',
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  featureText: {
    fontSize: 15,
    color: '#2E7D32',
    marginLeft: 14,
    fontWeight: '500',
  },
  allowButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 16,
  },
  buttonGradient: {
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  skipText: {
    fontSize: 15,
    color: '#558B2F',
    fontWeight: '600',
  },
  privacyNote: {
    fontSize: 12,
    color: '#558B2F',
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 20,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});

export default LocationPermissionScreen;
