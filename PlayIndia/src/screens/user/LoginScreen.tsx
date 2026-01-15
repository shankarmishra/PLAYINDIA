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
} from 'react-native';
import AsyncStorage from '../../utils/AsyncStorageSafe';
import { CommonActions } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import BrandLogo from '../../components/BrandLogo';
import Icon from 'react-native-vector-icons/Ionicons';
import useAuth from '../../hooks/useAuth';

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
      Alert.alert('Access Denied', 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        {/* Top Header Section */}
        <Animated.View style={[styles.brandingHeader, { opacity: fadeAnim }]}>
          <BrandLogo size={42} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.appName}>PLAYINDIA</Text>
            <Text style={styles.tagline}>IND'S PREMIER SPORTS NETWORK</Text>
          </View>
        </Animated.View>

        <Animated.View style={[
          styles.contentContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <Text style={styles.title}>Welcome Back! 👋</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
          
          {/* Form Fields */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <View style={styles.inputWrapper}>
                <Icon name="mail-outline" size={20} color="#94A3B8" />
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
                <TouchableOpacity><Text style={styles.forgotText}>Forgot?</Text></TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <Icon name="lock-closed-outline" size={20} color="#94A3B8" />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!passwordVisible}
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  <Icon name={passwordVisible ? 'eye-outline' : 'eye-off-outline'} size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, isLoading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Processing...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New here? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Reusable Sub-components
// Removed unused components

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  keyboardView: { flex: 1 },
  brandingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 15,
    marginBottom: 10,
  },
  headerTextContainer: { marginLeft: 12, flex: 1 },
  appName: { fontSize: 22, fontWeight: '900', color: '#0891B2', letterSpacing: -0.5 },
  tagline: { fontSize: 10, color: '#64748B', fontWeight: '700', letterSpacing: 0.5 },
  contentContainer: { flex: 1, paddingHorizontal: 24, paddingTop: 10, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  subtitle: { fontSize: 15, color: '#64748B', marginTop: 4, marginBottom: 25 },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
    marginBottom: 25,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: '800', color: '#0891B2' },
  statLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase' },
  statDivider: { width: 1, backgroundColor: '#F1F5F9' },
  form: { width: '100%' },
  inputGroup: { marginBottom: 18 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 11, fontWeight: '700', color: '#475569', marginBottom: 8, letterSpacing: 0.5 },
  forgotText: { fontSize: 11, color: '#0891B2', fontWeight: '700' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 15,
    height: 56,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 15, color: '#1E293B', fontWeight: '500' },
  primaryButton: {
    backgroundColor: '#0891B2',
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#0891B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: { opacity: 0.6 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  dividerBox: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  line: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  orText: { marginHorizontal: 10, fontSize: 11, fontWeight: '700', color: '#94A3B8' },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 52,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialBtnText: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30, paddingBottom: 20 },
  footerText: { color: '#64748B', fontSize: 14 },
  linkText: { color: '#0891B2', fontWeight: '700', fontSize: 14 },
});

export default LoginScreen;