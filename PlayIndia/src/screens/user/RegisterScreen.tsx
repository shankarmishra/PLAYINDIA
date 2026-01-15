import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  Animated,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { UserTabParamList } from '../../navigation/UserNav';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '../../config/constants';
import BrandLogo from '../../components/BrandLogo';
import Icon from 'react-native-vector-icons/Ionicons';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

type Props = StackScreenProps<UserTabParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  // Only user registration allowed from app
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleChange = (name: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    const requiredFields: (keyof RegisterFormData)[] = [
      'firstName',
      'email',
      'password',
      'confirmPassword',
      'phone',
    ];
    if (requiredFields.some(field => !formData[field])) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    // Validate mobile number
    const mobileRegex = /^[6-9]\d{9}$/;
    const normalizedPhone = formData.phone.replace(/\D/g, '');
    if (!mobileRegex.test(normalizedPhone)) {
      Alert.alert('Invalid Mobile', 'Please enter a valid 10-digit Indian mobile number');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        mobile: normalizedPhone,
        role: 'user', // Only user registration allowed from app
      });

      Alert.alert(
        'Success', 
        'Account registered successfully! Please login to continue.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login' as any),
          },
        ]
      );
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Registration failed. Please try again.';
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContainer, { flexGrow: 1, justifyContent: 'center' }]} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.brandingHeader, { opacity: fadeAnim, position: 'absolute', top: 20, left: 0, right: 0, zIndex: 1 }]}>
          <BrandLogo size={50} />
          <View style={styles.header}>
            <Text style={styles.appName}>PLAYINDIA</Text>
            <Text style={styles.tagline}>IND'S PREMIER SPORTS NETWORK</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join thousands of athletes near you.</Text>

          <View style={styles.row}>
            <View style={[styles.inputSection, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>FIRST NAME *</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="John"
                  placeholderTextColor="#718096"
                  value={formData.firstName}
                  onChangeText={text => handleChange('firstName', text)}
                />
              </View>
            </View>
            <View style={[styles.inputSection, { flex: 1 }]}>
              <Text style={styles.label}>LAST NAME</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Doe"
                  placeholderTextColor="#718096"
                  value={formData.lastName}
                  onChangeText={text => handleChange('lastName', text)}
                />
              </View>
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>EMAIL ADDRESS *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="#718096"
                value={formData.email}
                onChangeText={text => handleChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>PHONE NUMBER *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="00000 00000"
                placeholderTextColor="#718096"
                value={formData.phone}
                onChangeText={text => handleChange('phone', text)}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>PASSWORD *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="At least 6 characters"
                placeholderTextColor="#718096"
                secureTextEntry={!passwordVisible}
                value={formData.password}
                onChangeText={text => handleChange('password', text)}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={styles.eyeIcon}
              >
                <Icon name={passwordVisible ? 'eye' : 'eye-off'} size={20} color="#718096" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>CONFIRM PASSWORD *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Repeat your password"
                placeholderTextColor="#718096"
                secureTextEntry={!confirmPasswordVisible}
                value={formData.confirmPassword}
                onChangeText={text => handleChange('confirmPassword', text)}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                style={styles.eyeIcon}
              >
                <Icon name={confirmPasswordVisible ? 'eye' : 'eye-off'} size={20} color="#718096" />
              </TouchableOpacity>
            </View>
          </View>

          

          <TouchableOpacity
            style={[styles.button, isLoading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Creating Account...' : 'Create Account →'}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  brandingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 10,
  },
  header: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00B8D4',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: '#718096',
  },
  contentContainer: {
    paddingHorizontal: 30,
    paddingTop: 10,
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0D1B1E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 25,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
  },
  inputSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#718096',
    marginBottom: 8,
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    height: 54,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0D1B1E',
  },
  eyeIcon: {
    padding: 10,
  },

  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#00B8D4',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 25,
    shadowColor: '#00B8D4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#4A5568',
  },
  link: {
    fontSize: 14,
    color: '#00B8D4',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;


