import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import AsyncStorage from '../../utils/AsyncStorageSafe';
import { CommonActions } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import BrandLogo from '../../components/BrandLogo';
import Icon from 'react-native-vector-icons/Ionicons';
import useAuth from '../../hooks/useAuth';
import LinearGradient from '../../utils/LinearGradientSafe';
import { theme } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

type Props = StackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  // Premium Animation Refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 15,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Required', 'Please fill in all fields to continue.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await login(formData.email, formData.password);
      const { token, user } = response;
      
      // Store user type separately for navigation
      await AsyncStorage.setItem('userType', user.role || 'user');
      
      // Check if user is seller/store and status is pending - redirect to tracking
      if ((user.role === 'seller' || user.role === 'store') && user.status === 'pending') {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'StoreApprovalTracking' }],
          }),
        );
        return;
      }
      
      // Determine the correct main route based on user type
      let mainRouteName: string;
      switch(user.role) {
        case 'coach':
          mainRouteName = 'CoachMain';
          break;
        case 'store':
        case 'seller':
          mainRouteName = 'StoreMain';
          break;
        case 'delivery':
          mainRouteName = 'DeliveryMain';
          break;
        case 'admin':
          mainRouteName = 'AdminMain';
          break;
        default:
          mainRouteName = 'UserMain';
      }
      
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: mainRouteName }],
        }),
      );
    } catch (error: any) {
      // Check if error is about pending approval
      if (error.message && error.message.includes('pending approval')) {
        // Redirect to tracking page
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'StoreApprovalTracking' }],
          }),
        );
      } else {
        Alert.alert('Access Denied', error.message || 'Invalid credentials. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80',
      }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Gradient Overlay */}
      <LinearGradient
        colors={['rgba(11, 28, 45, 0.95)', 'rgba(11, 28, 45, 0.92)', 'rgba(11, 28, 45, 0.95)']}
        style={styles.gradientOverlay}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardView}
          >
            {/* Top Header Section with Logo */}
            <Animated.View style={[styles.brandingHeader, { opacity: fadeAnim }]}>
              <View style={styles.logoContainer}>
                <View style={styles.logoWrapper}>
                  <View style={styles.logoGlow} />
                  <BrandLogo size={70} style={styles.logoStyle} />
                </View>
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.appName}>PLAYINDIA</Text>
                <Text style={styles.tagline}>IND'S PREMIER SPORTS NETWORK</Text>
              </View>
            </Animated.View>

            <Animated.View style={[
              styles.contentContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}>
              {/* Welcome Section */}
              <View style={styles.welcomeSection}>
                <Text style={styles.title}>Welcome Back! 👋</Text>
                <Text style={styles.subtitle}>Sign in to continue your sports journey</Text>
              </View>
              
              {/* Form Card */}
              <View style={styles.formCard}>
                {/* Form Fields */}
                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>EMAIL ADDRESS</Text>
                    <View style={styles.inputWrapper}>
                      <View style={styles.iconContainer}>
                        <Icon name="mail-outline" size={22} color="#FFFFFF" />
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="name@example.com"
                        placeholderTextColor="#94A3B8"
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <View style={styles.labelRow}>
                      <Text style={styles.label}>PASSWORD</Text>
                      <TouchableOpacity>
                        <Text style={styles.forgotText}>Forgot?</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.inputWrapper}>
                      <View style={styles.iconContainer}>
                        <Icon name="lock-closed-outline" size={22} color="#FFFFFF" />
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor="#94A3B8"
                        secureTextEntry={!passwordVisible}
                        value={formData.password}
                        onChangeText={(text) => setFormData({ ...formData, password: text })}
                      />
                      <TouchableOpacity 
                        onPress={() => setPasswordVisible(!passwordVisible)}
                        style={styles.eyeIcon}
                      >
                        <Icon 
                          name={passwordVisible ? 'eye-outline' : 'eye-off-outline'} 
                          size={22} 
                          color={theme.colors.accent.neonGreen} 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryButton, isLoading && styles.disabledButton]}
                    onPress={handleLogin}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[theme.colors.accent.neonGreen, '#10B981', theme.colors.accent.neonGreen]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.buttonText}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                      </Text>
                      {!isLoading && (
                        <Icon name="arrow-forward" size={20} color="#FFF" style={styles.buttonIcon} />
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>New here? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.linkText}>Create Account</Text>
                </TouchableOpacity>
              </View>

              {/* Decorative Stickers */}
              <View style={styles.stickersContainer}>
                <View style={[styles.sticker, styles.sticker1]}>
                  <Icon name="football" size={32} color={theme.colors.accent.neonGreen} />
                </View>
                <View style={[styles.sticker, styles.sticker2]}>
                  <Icon name="basketball" size={28} color={theme.colors.accent.neonGreen} />
                </View>
                <View style={[styles.sticker, styles.sticker3]}>
                  <Icon name="trophy" size={30} color={theme.colors.status.warning} />
                </View>
                <View style={[styles.sticker, styles.sticker4]}>
                  <Icon name="medal" size={26} color={theme.colors.status.error} />
                </View>
                <View style={[styles.sticker, styles.sticker5]}>
                  <Icon name="fitness" size={24} color={theme.colors.accent.neonGreen} />
                </View>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

// Reusable Sub-components
// Removed unused components

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  gradientOverlay: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: { 
    flex: 1,
  },
  keyboardView: { 
    flex: 1,
  },
  brandingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    marginBottom: 30,
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
  },
  logoStyle: {
    zIndex: 2,
  },
  logoGlow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: `rgba(30, 215, 96, 0.25)`,
    top: -5,
    left: -5,
    shadowColor: theme.colors.accent.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 1,
  },
  headerTextContainer: { 
    marginLeft: 16, 
    flex: 1,
  },
  appName: { 
    fontSize: 26, 
    fontWeight: '900', 
    color: '#FFFFFF', 
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  tagline: { 
    fontSize: 12, 
    color: '#E0F2FE', 
    fontWeight: '700', 
    letterSpacing: 1,
    marginTop: 4,
    opacity: 0.95,
  },
  contentContainer: { 
    flex: 1, 
    paddingHorizontal: 24, 
    paddingTop: 10, 
    justifyContent: 'center',
  },
  welcomeSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
    letterSpacing: 0.5,
  },
  subtitle: { 
    fontSize: 15, 
    color: theme.colors.text.inverted, 
    textAlign: 'center',
    fontWeight: '600',
    opacity: 0.85,
    letterSpacing: 0.3,
  },
  formCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  form: { 
    width: '100%',
  },
  inputGroup: { 
    marginBottom: 20,
  },
  labelRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: theme.colors.text.secondary, 
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  forgotText: { 
    fontSize: 12, 
    color: theme.colors.accent.neonGreen, 
    fontWeight: '700',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    borderWidth: 2,
    borderColor: theme.colors.ui.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.accent.neonGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: theme.colors.accent.neonGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  input: { 
    flex: 1, 
    fontSize: 16, 
    color: theme.colors.text.primary, 
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 4,
  },
  primaryButton: {
    height: 60,
    borderRadius: 16,
    marginTop: 10,
    overflow: 'hidden',
    shadowColor: theme.colors.accent.neonGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  buttonGradient: {
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  disabledButton: { 
    opacity: 0.6,
  },
  buttonText: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 10,
  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 24, 
    paddingBottom: 20,
  },
  footerText: { 
    color: theme.colors.text.inverted, 
    fontSize: 15,
    fontWeight: '500',
    opacity: 0.9,
  },
  linkText: { 
    color: theme.colors.accent.neonGreen, 
    fontWeight: '800', 
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  stickersContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: -1,
  },
  sticker: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `rgba(30, 215, 96, 0.2)`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: `rgba(30, 215, 96, 0.4)`,
    shadowColor: theme.colors.accent.neonGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sticker1: {
    top: '15%',
    right: '10%',
    transform: [{ rotate: '15deg' }],
  },
  sticker2: {
    top: '25%',
    left: '8%',
    transform: [{ rotate: '-20deg' }],
  },
  sticker3: {
    bottom: '25%',
    right: '12%',
    transform: [{ rotate: '25deg' }],
  },
  sticker4: {
    bottom: '35%',
    left: '10%',
    transform: [{ rotate: '-15deg' }],
  },
  sticker5: {
    top: '50%',
    right: '5%',
    transform: [{ rotate: '10deg' }],
  },
});

export default LoginScreen;