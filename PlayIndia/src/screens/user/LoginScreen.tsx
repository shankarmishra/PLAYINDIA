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
  ScrollView,
  StatusBar,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '../../utils/AsyncStorageSafe';
import { CommonActions } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import BrandLogo from '../../components/BrandLogo';
import Icon from 'react-native-vector-icons/Ionicons';
import useAuth from '../../hooks/useAuth';
import LinearGradient from '../../utils/LinearGradientSafe';

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
    StatusBar.setBarStyle('dark-content');
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
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo at Top - INSIDE ScrollView */}
          <View style={styles.logoContainerInside}>
            <Image
              source={require('../../assets/TeamupIndia.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          
          <Animated.View style={[
            styles.contentContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>
            
            {/* Form Card */}
            <View style={styles.formCard}>
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>EMAIL</Text>
                  <View style={styles.inputWrapper}>
                    <Icon name="mail-outline" size={18} color="#4CAF50" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor="#9E9E9E"
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
                    <Icon name="lock-closed-outline" size={18} color="#4CAF50" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter password"
                      placeholderTextColor="#9E9E9E"
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
                        size={18} 
                        color="#757575" 
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
                    colors={['#4CAF50', '#43A047', '#4CAF50']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Text>
                    {!isLoading && (
                      <Icon name="arrow-forward" size={18} color="#FFF" style={styles.buttonIcon} />
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
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

// Reusable Sub-components
// Removed unused components

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  keyboardView: {
    flex: 1,
  },
  logoContainerInside: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoImage: {
    width: 160,
    height: 160,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  contentContainer: { 
    flex: 1, 
  },
  welcomeSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#1B5E20',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: 14, 
    color: '#558B2F', 
    textAlign: 'center',
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  form: { 
    width: '100%',
  },
  inputGroup: { 
    marginBottom: 14,
  },
  labelRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: { 
    fontSize: 11, 
    fontWeight: '700', 
    color: '#424242', 
    letterSpacing: 0.5,
  },
  forgotText: { 
    fontSize: 11, 
    color: '#4CAF50', 
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: { 
    flex: 1, 
    fontSize: 14, 
    color: '#212121', 
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 4,
  },
  primaryButton: {
    height: 50,
    borderRadius: 14,
    marginTop: 6,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
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
    fontSize: 16, 
    fontWeight: '700',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 16, 
    paddingBottom: 24,
  },
  footerText: { 
    color: '#558B2F', 
    fontSize: 14,
    fontWeight: '500',
  },
  linkText: { 
    color: '#2E7D32', 
    fontWeight: '700', 
    fontSize: 14,
  },
});

export default LoginScreen;