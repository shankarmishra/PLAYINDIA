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
import { API_ENDPOINTS } from '../../config/constants';
import BrandLogo from '../../components/BrandLogo';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  age: string;
  gender: string;
  sport: string;
  position: string;
  height: string;
  weight: string;
  team: string;
  experience: string;
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
    age: '',
    gender: '',
    sport: '',
    position: '',
    height: '',
    weight: '',
    team: '',
    experience: '',
  });
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

    setIsLoading(true);
    try {
      await axios.post(API_ENDPOINTS.USERS.REGISTER, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        age: formData.age ? parseInt(formData.age, 10) : undefined,
        gender: formData.gender,
        sport: formData.sport,
        position: formData.position,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        team: formData.team,
        experience: formData.experience
          ? parseInt(formData.experience, 10)
          : undefined,
      });

      Alert.alert('Success', 'Account registered successfully', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
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

  const handleSkipForTesting = () => {
    Alert.alert(
      'Test Mode',
      'Skip registration and go directly to Home?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Skip',
          onPress: () => navigation.navigate('HomeTab' as any),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.brandingHeader, { opacity: fadeAnim }]}>
          <BrandLogo size={50} />
          <View style={styles.header}>
            <Text style={styles.appName}>PLAYINDIA</Text>
            <Text style={styles.tagline}>IND'S PREMIER SPORTS NETWORK</Text>
          </View>
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleSkipForTesting}
          >
            <Text style={styles.skipButtonText}>Skip 🚀</Text>
          </TouchableOpacity>
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
                <Text style={styles.eyeText}>
                  {passwordVisible ? '👁️' : '👁️‍🗨️'}
                </Text>
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
                <Text style={styles.eyeText}>
                  {confirmPasswordVisible ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputSection, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>AGE</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 25"
                  placeholderTextColor="#718096"
                  value={formData.age}
                  onChangeText={text => handleChange('age', text)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={[styles.inputSection, { flex: 1 }]}>
              <Text style={styles.label}>GENDER</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Male/Female/Other"
                  placeholderTextColor="#718096"
                  value={formData.gender}
                  onChangeText={text => handleChange('gender', text)}
                />
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputSection, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>SPORT</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="football, cricket..."
                  placeholderTextColor="#718096"
                  value={formData.sport}
                  onChangeText={text => handleChange('sport', text)}
                />
              </View>
            </View>
            <View style={[styles.inputSection, { flex: 1 }]}>
              <Text style={styles.label}>POSITION</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Forward"
                  placeholderTextColor="#718096"
                  value={formData.position}
                  onChangeText={text => handleChange('position', text)}
                />
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputSection, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>HEIGHT (CM)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 175"
                  placeholderTextColor="#718096"
                  value={formData.height}
                  onChangeText={text => handleChange('height', text)}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
            <View style={[styles.inputSection, { flex: 1 }]}>
              <Text style={styles.label}>WEIGHT (KG)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 70"
                  placeholderTextColor="#718096"
                  value={formData.weight}
                  onChangeText={text => handleChange('weight', text)}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputSection, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>TEAM</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Your team name"
                  placeholderTextColor="#718096"
                  value={formData.team}
                  onChangeText={text => handleChange('team', text)}
                />
              </View>
            </View>
            <View style={[styles.inputSection, { flex: 1 }]}>
              <Text style={styles.label}>EXPERIENCE (YRS)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 2"
                  placeholderTextColor="#718096"
                  value={formData.experience}
                  onChangeText={text => handleChange('experience', text)}
                  keyboardType="numeric"
                />
              </View>
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
  skipButton: {
    backgroundColor: '#00B8D4',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 'auto',
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
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
  eyeText: {
    fontSize: 18,
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


