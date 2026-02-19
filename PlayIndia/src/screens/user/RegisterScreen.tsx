import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import axios from 'axios';
import { API_BASE_URL } from '../../config/constants';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from '../../utils/LinearGradientSafe';
import useAuth from '../../hooks/useAuth';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  city: string;
  preferredRadius: string;
  favoriteSports: string[];
  skillLevel: string;
  experience: string;
  preferredTime: string;
  availableDays: string;
  bio: string;
  emergencyContact: string;
  notificationsEnabled: boolean;
  darkMode: boolean;
  locationSharing: boolean;
  customSport: string;
  age: string;
}

interface StepConfig {
  id: number;
  title: string;
  label: string;
}

interface ErrorState {
  [key: string]: string;
}

type Props = StackScreenProps<RootStackParamList, 'Register'>;

const INITIAL_FORM_DATA: RegisterFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  gender: '',
  dateOfBirth: '',
  city: '',
  preferredRadius: '5',
  favoriteSports: [],
  skillLevel: 'Beginner',
  experience: '',
  preferredTime: '',
  availableDays: '',
  bio: '',
  emergencyContact: '',
  notificationsEnabled: true,
  darkMode: false,
  locationSharing: false,
  customSport: '',
  age: '',
};

const AVAILABLE_SPORTS = [
  'Badminton',
  'Cricket',
  'Football',
  'Volleyball',
  'Table Tennis',
  'Basketball',
  'Tennis',
];

const STEPS: StepConfig[] = [
  { id: 0, title: 'Personal', label: 'Personal Info' },
  { id: 1, title: 'Location', label: 'Location' },
  { id: 2, title: 'Sports', label: 'Sports' },
  { id: 3, title: 'Schedule', label: 'Schedule' },
  { id: 4, title: 'Profile', label: 'Profile' },
  { id: 5, title: 'Security', label: 'Security' },
];

const RegisterScreen: React.FC<Props> = React.memo(({ navigation }) => {
  const [formData, setFormData] = useState<RegisterFormData>(INITIAL_FORM_DATA);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<ErrorState>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { register } = useAuth();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  // Validation Regex Patterns
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_REGEX = /^[6-9]\d{9}$/;
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/])/;

  const validateEmail = useCallback((email: string): boolean => {
    return EMAIL_REGEX.test(email);
  }, []);

  const validatePhone = useCallback((phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return PHONE_REGEX.test(cleaned);
  }, []);

  const validatePassword = useCallback((password: string): boolean => {
    return password.length >= 8 && PASSWORD_REGEX.test(password);
  }, []);

  const getStepErrors = useCallback((): ErrorState => {
    const newErrors: ErrorState = {};

    switch (currentStep) {
      case 0: {
        // Personal Info
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'First name is required';
        }
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'Please enter a valid email';
        }
        if (!formData.phone.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(formData.phone)) {
          newErrors.phone = 'Please enter a valid 10-digit mobile number (6-9)';
        }
        if (!formData.age.trim()) {
          newErrors.age = 'Age is required';
        } else {
          const ageNum = parseInt(formData.age, 10);
          if (isNaN(ageNum) || ageNum < 5 || ageNum > 100) {
            newErrors.age = 'Please enter a valid age (5-100)';
          }
        }
        break;
      }

      case 1: {
        // Location
        if (!formData.city.trim()) {
          newErrors.city = 'City is required';
        }
        if (!formData.preferredRadius.trim()) {
          newErrors.preferredRadius = 'Preferred radius is required';
        } else {
          const radius = parseInt(formData.preferredRadius, 10);
          if (isNaN(radius) || radius <= 0) {
            newErrors.preferredRadius = 'Please enter a valid radius';
          }
        }
        break;
      }

      case 2: {
        // Sports
        if (formData.favoriteSports.length === 0) {
          newErrors.favoriteSports = 'Please select at least one sport';
        }
        break;
      }

      case 3: {
        // Schedule
        if (!formData.preferredTime.trim()) {
          newErrors.preferredTime = 'Preferred time is required';
        }
        if (!formData.availableDays.trim()) {
          newErrors.availableDays = 'Available days are required';
        }
        break;
      }

      case 4: {
        // Profile
        if (
          formData.emergencyContact &&
          !validatePhone(formData.emergencyContact)
        ) {
          newErrors.emergencyContact =
            'Please enter a valid 10-digit emergency contact';
        }
        break;
      }

      case 5: {
        // Security
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (!validatePassword(formData.password)) {
          newErrors.password =
            'Password must be 8+ chars with uppercase, lowercase, number, and special character';
        }
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;
      }

      default:
        break;
    }

    return newErrors;
  }, [currentStep, formData, validateEmail, validatePhone, validatePassword]);

  const validateCurrentStep = useCallback((): boolean => {
    const newErrors = getStepErrors();
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [getStepErrors]);

  const isStepValid = useCallback((): boolean => {
    return Object.keys(getStepErrors()).length === 0;
  }, [getStepErrors]);

  useEffect(() => {
    console.log('RegisterScreen mounted');
    StatusBar.setBarStyle('dark-content');

    const animations = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 12,
        friction: 8,
        useNativeDriver: true,
      }),
    ]);

    animations.start();

    return () => {
      console.log('RegisterScreen unmounted');
    };
  }, [fadeAnim, slideAnim]);

  const handleChange = useCallback(
    (name: keyof RegisterFormData, value: string | boolean | string[]) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleFocus = useCallback((fieldName: string) => {
    setFocusedField(fieldName);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedField(null);
  }, []);

  const toggleSport = useCallback(
    (sport: string) => {
      setSelectedSports((prevSelected) => {
        const newSelected = prevSelected.includes(sport)
          ? prevSelected.filter((s) => s !== sport)
          : [...prevSelected, sport];

        setFormData((prev) => ({ ...prev, favoriteSports: newSelected }));

        if (newSelected.length > 0 && errors.favoriteSports) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.favoriteSports;
            return newErrors;
          });
        }

        return newSelected;
      });
    },
    [errors.favoriteSports]
  );

  const addCustomSport = useCallback(() => {
    if (formData.customSport.trim() === '') {
      Alert.alert('Error', 'Please enter a sport name');
      return;
    }

    const newSport = formData.customSport.trim();

    if (newSport.length < 2) {
      Alert.alert('Error', 'Sport name must be at least 2 characters');
      return;
    }

    if (selectedSports.includes(newSport)) {
      Alert.alert('Info', 'This sport is already selected');
      return;
    }

    if (AVAILABLE_SPORTS.some((s) => s.toLowerCase() === newSport.toLowerCase())) {
      Alert.alert('Info', 'This sport is already in the list');
      return;
    }

    setSelectedSports((prevSelected) => {
      const newSelected = [...prevSelected, newSport];
      setFormData((prev) => ({ ...prev, favoriteSports: newSelected, customSport: '' }));

      if (errors.favoriteSports) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.favoriteSports;
          return newErrors;
        });
      }

      return newSelected;
    });
  }, [formData.customSport, selectedSports, errors.favoriteSports]);

  const handleNext = useCallback(() => {
    if (validateCurrentStep()) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      Alert.alert(
        'Incomplete Details',
        'Please complete all required fields on this step to move forward.'
      );
    }
  }, [currentStep, validateCurrentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleRegister = useCallback(async () => {
    if (!validateCurrentStep()) {
      Alert.alert('Error', 'Please fill all required fields correctly');
      return;
    }

    setIsLoading(true);
    try {
      const normalizedPhone = formData.phone.replace(/\D/g, '');
      const normalizedEmergency = formData.emergencyContact.replace(/\D/g, '');

      const additionalData = {
        city: formData.city,
        favoriteGames: formData.favoriteSports,
        gender: formData.gender || 'Not specified',
        dateOfBirth: formData.dateOfBirth,
        skillLevel: formData.skillLevel,
        experience: formData.experience,
        preferredTime: formData.preferredTime,
        availableDays: formData.availableDays,
        bio: formData.bio,
        emergencyContact: normalizedEmergency || '',
        preferredRadius: parseInt(formData.preferredRadius, 10) || 5,
        notificationsEnabled: formData.notificationsEnabled,
        locationSharing: formData.locationSharing,
        age: parseInt(formData.age, 10) || 0,
      };

      const result = await register(
        `${formData.firstName} ${formData.lastName}`.trim(),
        formData.email.toLowerCase().trim(),
        formData.password,
        normalizedPhone,
        'user',
        additionalData
      );

      if (result) {
        Alert.alert(
          'Success',
          'Account created successfully! Please login to continue.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login' as never),
            },
          ]
        );
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Registration failed. Please try again.';
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [formData, register, navigation, validateCurrentStep]);

  const renderStepContent = useCallback(() => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Text style={styles.sectionTitle}>Personal Details</Text>

            {/* First Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FIRST NAME *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  !!errors.firstName && styles.inputWrapperError,
                  focusedField === 'firstName' && styles.inputWrapperFocused,
                ]}
              >
                <Icon
                  name="person-outline"
                  size={18}
                  color="#4CAF50"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="John"
                  placeholderTextColor="#9E9E9E"
                  value={formData.firstName}
                  onChangeText={(text) => handleChange('firstName', text)}
                  onFocus={() => handleFocus('firstName')}
                  onBlur={handleBlur}
                  editable={!isLoading}
                />
              </View>
              {errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}
            </View>

            {/* Last Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>LAST NAME</Text>
              <View style={styles.inputWrapper}>
                <Icon
                  name="person-outline"
                  size={18}
                  color="#4CAF50"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Doe"
                  placeholderTextColor="#9E9E9E"
                  value={formData.lastName}
                  onChangeText={(text) => handleChange('lastName', text)}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL ADDRESS *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  !!errors.email && styles.inputWrapperError,
                  focusedField === 'email' && styles.inputWrapperFocused,
                ]}
              >
                <Icon
                  name="mail-outline"
                  size={18}
                  color="#4CAF50"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  placeholderTextColor="#9E9E9E"
                  value={formData.email}
                  onChangeText={(text) => handleChange('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  editable={!isLoading}
                />
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PHONE NUMBER *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  !!errors.phone && styles.inputWrapperError,
                  focusedField === 'phone' && styles.inputWrapperFocused,
                ]}
              >
                <Icon
                  name="call-outline"
                  size={18}
                  color="#4CAF50"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="9876543210"
                  placeholderTextColor="#9E9E9E"
                  value={formData.phone}
                  onChangeText={(text) => handleChange('phone', text)}
                  keyboardType="phone-pad"
                  onFocus={() => handleFocus('phone')}
                  onBlur={handleBlur}
                  editable={!isLoading}
                  maxLength={10}
                />
              </View>
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </View>

            {/* Gender */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>GENDER</Text>
              <View style={styles.pickerContainer}>
                {['Male', 'Female', 'Other'].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.pickerOption,
                      formData.gender === gender &&
                      styles.pickerOptionSelected,
                    ]}
                    onPress={() => handleChange('gender', gender)}
                    disabled={isLoading}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        formData.gender === gender &&
                        styles.selectedPickerText,
                      ]}
                    >
                      {gender}
                    </Text>
                    {formData.gender === gender && (
                      <Icon
                        name="checkmark-circle"
                        size={18}
                        color="#4CAF50"
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date of Birth */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>DATE OF BIRTH / AGE</Text>
              <View style={styles.inputWrapper}>
                <Icon
                  name="calendar-outline"
                  size={18}
                  color="#4CAF50"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="#9E9E9E"
                  value={formData.dateOfBirth}
                  onChangeText={(text) => {
                    if (
                      /^\d{0,2}[\/]?\d{0,2}[\/]?\d{0,4}$|^\d{0,2}$/.test(
                        text
                      ) ||
                      text === ''
                    ) {
                      handleChange('dateOfBirth', text);
                    }
                  }}
                  keyboardType="numeric"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Age */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>AGE *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  !!errors.age && styles.inputWrapperError,
                  focusedField === 'age' && styles.inputWrapperFocused,
                ]}
              >
                <Icon
                  name="calendar-outline"
                  size={18}
                  color="#4CAF50"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 25"
                  placeholderTextColor="#9E9E9E"
                  value={formData.age}
                  onChangeText={(text) => handleChange('age', text.replace(/[^0-9]/g, ''))}
                  onFocus={() => handleFocus('age')}
                  onBlur={handleBlur}
                  keyboardType="numeric"
                  maxLength={3}
                  editable={!isLoading}
                />
              </View>
              {errors.age && (
                <Text style={styles.errorText}>{errors.age}</Text>
              )}
            </View>

            {/* Navigation Buttons */}
            <View style={styles.stepButtons}>
              <TouchableOpacity
                style={[
                  styles.stepButton,
                  styles.secondaryButton,
                  currentStep === 0 && styles.buttonDisabled,
                ]}
                onPress={handlePrevious}
                disabled={currentStep === 0 || isLoading}
              >
                <Icon name="chevron-back" size={20} color="#000" />
                <Text style={[styles.buttonText, { color: '#000' }]}>
                  Previous
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.stepButton,
                  styles.primaryButton,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleNext}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#4CAF50', '#43A047']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Next</Text>
                  <Icon
                    name="chevron-forward"
                    size={20}
                    color="#FFF"
                    style={{ marginLeft: 8 }}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        );

      case 1:
        return (
          <>
            <Text style={styles.sectionTitle}>Location Details</Text>

            {/* City */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CITY / AREA *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  !!errors.city && styles.inputWrapperError,
                  focusedField === 'city' && styles.inputWrapperFocused,
                ]}
              >
                <Icon
                  name="location-outline"
                  size={18}
                  color="#4CAF50"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your city"
                  placeholderTextColor="#9E9E9E"
                  value={formData.city}
                  onChangeText={(text) => handleChange('city', text)}
                  onFocus={() => handleFocus('city')}
                  onBlur={handleBlur}
                  editable={!isLoading}
                />
              </View>
              {errors.city && (
                <Text style={styles.errorText}>{errors.city}</Text>
              )}
            </View>

            {/* Preferred Radius */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PREFERRED PLAYING RADIUS (KM)</Text>
              <View
                style={[
                  styles.inputWrapper,
                  !!errors.preferredRadius && styles.inputWrapperError,
                  focusedField === 'preferredRadius' &&
                  styles.inputWrapperFocused,
                ]}
              >
                <Icon
                  name="navigate-outline"
                  size={18}
                  color="#4CAF50"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="5"
                  placeholderTextColor="#9E9E9E"
                  value={formData.preferredRadius}
                  onChangeText={(text) => handleChange('preferredRadius', text)}
                  keyboardType="numeric"
                  onFocus={() => handleFocus('preferredRadius')}
                  onBlur={handleBlur}
                  editable={!isLoading}
                />
              </View>
              {errors.preferredRadius && (
                <Text style={styles.errorText}>{errors.preferredRadius}</Text>
              )}
            </View>

            {/* Navigation Buttons */}
            <View style={styles.stepButtons}>
              <TouchableOpacity
                style={[styles.stepButton, styles.secondaryButton]}
                onPress={handlePrevious}
                disabled={isLoading}
              >
                <Icon name="chevron-back" size={20} color="#000" />
                <Text style={[styles.buttonText, { color: '#000' }]}>
                  Previous
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.stepButton,
                  styles.primaryButton,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleNext}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#4CAF50', '#43A047']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Next</Text>
                  <Icon
                    name="chevron-forward"
                    size={20}
                    color="#FFF"
                    style={{ marginLeft: 8 }}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        );

      case 2:
        return (
          <>
            <Text style={styles.sectionTitle}>Sports Preferences</Text>

            {/* Favorite Sports */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FAVORITE SPORTS *</Text>
              {errors.favoriteSports && (
                <Text style={styles.errorText}>{errors.favoriteSports}</Text>
              )}
              <View style={styles.chipContainer}>
                {AVAILABLE_SPORTS.map((sport, index) => (
                  <TouchableOpacity
                    key={`${sport}-${index}`}
                    style={[
                      styles.chip,
                      selectedSports.includes(sport) && styles.chipSelected,
                    ]}
                    onPress={() => toggleSport(sport)}
                    disabled={isLoading}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedSports.includes(sport) &&
                        styles.chipTextSelected,
                      ]}
                    >
                      {sport}
                    </Text>
                    {selectedSports.includes(sport) && (
                      <Icon
                        name="checkmark"
                        size={14}
                        color="#FFF"
                        style={{ marginLeft: 4 }}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Custom Sport */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ADD CUSTOM SPORT</Text>
              <View style={styles.customSportInput}>
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter custom sport"
                    placeholderTextColor="#9E9E9E"
                    value={formData.customSport}
                    onChangeText={(text) => handleChange('customSport', text)}
                    editable={!isLoading}
                  />
                </View>
                <TouchableOpacity
                  style={[
                    styles.stepButton,
                    styles.primaryButton,
                    { minWidth: 80, marginLeft: 10 },
                  ]}
                  onPress={addCustomSport}
                  disabled={isLoading || !formData.customSport.trim()}
                >
                  <LinearGradient
                    colors={['#4CAF50', '#43A047']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>Add</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* Skill Level */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>SKILL LEVEL</Text>
              <View style={styles.pickerContainer}>
                {['Beginner', 'Intermediate', 'Professional'].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.pickerOption,
                      formData.skillLevel === level &&
                      styles.pickerOptionSelected,
                    ]}
                    onPress={() => handleChange('skillLevel', level)}
                    disabled={isLoading}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        formData.skillLevel === level &&
                        styles.selectedPickerText,
                      ]}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                    {formData.skillLevel === level && (
                      <Icon
                        name="checkmark-circle"
                        size={18}
                        color="#4CAF50"
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Experience */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PLAYING EXPERIENCE (YEARS)</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 2"
                  placeholderTextColor="#9E9E9E"
                  value={formData.experience}
                  onChangeText={(text) => handleChange('experience', text)}
                  keyboardType="numeric"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Navigation Buttons */}
            <View style={styles.stepButtons}>
              <TouchableOpacity
                style={[styles.stepButton, styles.secondaryButton]}
                onPress={handlePrevious}
                disabled={isLoading}
              >
                <Icon name="chevron-back" size={20} color="#000" />
                <Text style={[styles.buttonText, { color: '#000' }]}>
                  Previous
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.stepButton,
                  styles.primaryButton,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleNext}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#4CAF50', '#43A047']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Next</Text>
                  <Icon
                    name="chevron-forward"
                    size={20}
                    color="#FFF"
                    style={{ marginLeft: 8 }}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        );

      case 3:
        return (
          <>
            <Text style={styles.sectionTitle}>Availability</Text>

            {/* Preferred Time */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PREFERRED PLAYING TIME *</Text>
              {errors.preferredTime && (
                <Text style={styles.errorText}>{errors.preferredTime}</Text>
              )}
              <View style={styles.pickerContainer}>
                {['Morning', 'Evening', 'Weekend'].map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.pickerOption,
                      formData.preferredTime === time &&
                      styles.pickerOptionSelected,
                    ]}
                    onPress={() => handleChange('preferredTime', time)}
                    disabled={isLoading}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        formData.preferredTime === time &&
                        styles.selectedPickerText,
                      ]}
                    >
                      {time}
                    </Text>
                    {formData.preferredTime === time && (
                      <Icon
                        name="checkmark-circle"
                        size={18}
                        color="#4CAF50"
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Available Days */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>AVAILABLE DAYS *</Text>
              {errors.availableDays && (
                <Text style={styles.errorText}>{errors.availableDays}</Text>
              )}
              <View style={styles.pickerContainer}>
                {['Mon-Fri', 'Sat-Sun', 'Any Day'].map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.pickerOption,
                      formData.availableDays === day &&
                      styles.pickerOptionSelected,
                    ]}
                    onPress={() => handleChange('availableDays', day)}
                    disabled={isLoading}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        formData.availableDays === day &&
                        styles.selectedPickerText,
                      ]}
                    >
                      {day}
                    </Text>
                    {formData.availableDays === day && (
                      <Icon
                        name="checkmark-circle"
                        size={18}
                        color="#4CAF50"
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Navigation Buttons */}
            <View style={styles.stepButtons}>
              <TouchableOpacity
                style={[styles.stepButton, styles.secondaryButton]}
                onPress={handlePrevious}
                disabled={isLoading}
              >
                <Icon name="chevron-back" size={20} color="#000" />
                <Text style={[styles.buttonText, { color: '#000' }]}>
                  Previous
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.stepButton,
                  styles.primaryButton,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleNext}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#4CAF50', '#43A047']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Next</Text>
                  <Icon
                    name="chevron-forward"
                    size={20}
                    color="#FFF"
                    style={{ marginLeft: 8 }}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        );

      case 4:
        return (
          <>
            <Text style={styles.sectionTitle}>Profile Details</Text>

            {/* Bio */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>BIO / ABOUT ME</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor="#9E9E9E"
                  value={formData.bio}
                  onChangeText={(text) => handleChange('bio', text)}
                  multiline
                  numberOfLines={4}
                  editable={!isLoading}
                />
              </View>
            </View>

            <Text style={styles.sectionTitle}>Safety & Emergency</Text>

            {/* Emergency Contact */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMERGENCY CONTACT NUMBER</Text>
              <View
                style={[
                  styles.inputWrapper,
                  !!errors.emergencyContact && styles.inputWrapperError,
                ]}
              >
                <Icon
                  name="call-outline"
                  size={18}
                  color="#4CAF50"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Emergency contact number"
                  placeholderTextColor="#9E9E9E"
                  value={formData.emergencyContact}
                  onChangeText={(text) =>
                    handleChange('emergencyContact', text)
                  }
                  keyboardType="phone-pad"
                  editable={!isLoading}
                  maxLength={10}
                />
              </View>
              {errors.emergencyContact && (
                <Text style={styles.errorText}>{errors.emergencyContact}</Text>
              )}
            </View>

            {/* Location Sharing */}
            <View style={styles.checkboxGroup}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() =>
                  handleChange('locationSharing', !formData.locationSharing)
                }
                disabled={isLoading}
              >
                <View
                  style={[
                    styles.checkbox,
                    formData.locationSharing && styles.checkboxChecked,
                  ]}
                >
                  {formData.locationSharing && (
                    <Icon name="checkmark" size={14} color="#fff" />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>
                  Allow live location sharing
                </Text>
              </TouchableOpacity>
            </View>

            {/* Notifications */}
            <View style={styles.checkboxGroup}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() =>
                  handleChange('notificationsEnabled', !formData.notificationsEnabled)
                }
                disabled={isLoading}
              >
                <View
                  style={[
                    styles.checkbox,
                    formData.notificationsEnabled && styles.checkboxChecked,
                  ]}
                >
                  {formData.notificationsEnabled && (
                    <Icon name="checkmark" size={14} color="#fff" />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Enable notifications</Text>
              </TouchableOpacity>
            </View>

            {/* Navigation Buttons */}
            <View style={styles.stepButtons}>
              <TouchableOpacity
                style={[styles.stepButton, styles.secondaryButton]}
                onPress={handlePrevious}
                disabled={isLoading}
              >
                <Icon name="chevron-back" size={20} color="#000" />
                <Text style={[styles.buttonText, { color: '#000' }]}>
                  Previous
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.stepButton, styles.primaryButton]}
                onPress={handleNext}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#4CAF50', '#43A047']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Next</Text>
                  <Icon
                    name="chevron-forward"
                    size={20}
                    color="#FFF"
                    style={{ marginLeft: 8 }}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        );

      case 5:
        return (
          <>
            <Text style={styles.sectionTitle}>Account Security</Text>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PASSWORD *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  !!errors.password && styles.inputWrapperError,
                  focusedField === 'password' && styles.inputWrapperFocused,
                ]}
              >
                <Icon
                  name="lock-closed-outline"
                  size={18}
                  color="#4CAF50"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Min 8 chars with uppercase, lowercase, number & special"
                  placeholderTextColor="#9E9E9E"
                  secureTextEntry={!passwordVisible}
                  value={formData.password}
                  onChangeText={(text) => handleChange('password', text)}
                  autoCapitalize="none"
                  onFocus={() => handleFocus('password')}
                  onBlur={handleBlur}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={styles.eyeIcon}
                  disabled={isLoading}
                >
                  <Icon
                    name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                    size={18}
                    color="#757575"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CONFIRM PASSWORD *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  !!errors.confirmPassword && styles.inputWrapperError,
                  focusedField === 'confirmPassword' &&
                  styles.inputWrapperFocused,
                ]}
              >
                <Icon
                  name="lock-closed-outline"
                  size={18}
                  color="#4CAF50"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Repeat your password"
                  placeholderTextColor="#9E9E9E"
                  secureTextEntry={!confirmPasswordVisible}
                  value={formData.confirmPassword}
                  onChangeText={(text) =>
                    handleChange('confirmPassword', text)
                  }
                  autoCapitalize="none"
                  onFocus={() => handleFocus('confirmPassword')}
                  onBlur={handleBlur}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                  style={styles.eyeIcon}
                  disabled={isLoading}
                >
                  <Icon
                    name={
                      confirmPasswordVisible ? 'eye-outline' : 'eye-off-outline'
                    }
                    size={18}
                    color="#757575"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            {/* Password Hint */}
            <View style={styles.passwordStrengthHint}>
              <Icon name="information-circle" size={16} color="#4CAF50" />
              <Text style={styles.passwordHintText}>
                Password must include uppercase, lowercase, number & special char
              </Text>
            </View>

            {/* Navigation Buttons */}
            <View style={styles.stepButtons}>
              <TouchableOpacity
                style={[styles.stepButton, styles.secondaryButton]}
                onPress={handlePrevious}
                disabled={isLoading}
              >
                <Icon name="chevron-back" size={20} color="#000" />
                <Text style={[styles.buttonText, { color: '#000' }]}>
                  Previous
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.stepButton,
                  styles.primaryButton,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#4CAF50', '#43A047']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  {isLoading ? (
                    <>
                      <ActivityIndicator
                        size="small"
                        color="#FFF"
                        style={{ marginRight: 8 }}
                      />
                      <Text style={styles.buttonText}>Creating...</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.buttonText}>Create Account</Text>
                      <Icon
                        name="checkmark-done"
                        size={20}
                        color="#FFF"
                        style={{ marginLeft: 8 }}
                      />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        );

      default:
        return null;
    }
  }, [
    currentStep,
    formData,
    errors,
    focusedField,
    selectedSports,
    isLoading,
    handleChange,
    handleFocus,
    handleBlur,
    toggleSport,
    addCustomSport,
    handleNext,
    handlePrevious,
    handleRegister,
    validateCurrentStep,
    isStepValid,
    passwordVisible,
    confirmPasswordVisible,
  ]);

  return (
    <LinearGradient
      colors={['#E8F5E9', '#F1F8E9', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.mainContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              {/* Brand Header */}
              <View style={styles.brandHeader}>
                <View style={styles.logoContainer}>
                  <View style={styles.logoBadge}>
                    <Icon name="tennisball" size={36} color="#4CAF50" />
                  </View>
                </View>
                <Text style={styles.appNameSmaller}>PLAYINDIA</Text>
                <Text style={styles.taglineSmaller}>CONNECT • PLAY • WIN</Text>
              </View>

              {/* Title */}
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join our sports community today</Text>

              {/* Step Indicator */}
              <View style={styles.stepIndicator}>
                {STEPS.map((step, index) => (
                  <View key={step.id} style={styles.stepWrapper}>
                    <View
                      style={[
                        styles.stepCircle,
                        currentStep === step.id && styles.stepCircleActive,
                        currentStep > step.id && styles.stepCircleCompleted,
                      ]}
                    >
                      {currentStep > step.id ? (
                        <Icon name="checkmark" size={18} color="#FFF" />
                      ) : (
                        <Text style={styles.stepNumber}>{step.id + 1}</Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.stepLabel,
                        currentStep === step.id && styles.stepLabelActive,
                      ]}
                    >
                      {step.label}
                    </Text>
                    {index < STEPS.length - 1 && (
                      <View
                        style={[
                          styles.stepLine,
                          currentStep > step.id && styles.stepLineActive,
                        ]}
                      />
                    )}
                  </View>
                ))}
              </View>

              {/* Form Card */}
              <View style={styles.formCard}>
                <View style={styles.form}>
                  {renderStepContent()}
                </View>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Login' as never)}
                  disabled={isLoading}
                >
                  <Text style={styles.linkText}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
});

RegisterScreen.displayName = 'RegisterScreen';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  brandHeader: {
    alignItems: 'center',
    paddingTop: 40,
    marginBottom: 24,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#C8E6C9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  appNameSmaller: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2E7D32',
    letterSpacing: 1.5,
    marginTop: 8,
  },
  taglineSmaller: {
    fontSize: 10,
    color: '#558B2F',
    fontWeight: '600',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1B5E20',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#558B2F',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 24,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  stepWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  stepCircleCompleted: {
    backgroundColor: '#4CAF50',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  stepLabel: {
    fontSize: 11,
    color: '#757575',
    textAlign: 'center',
    fontWeight: '500',
  },
  stepLabelActive: {
    color: '#4CAF50',
    fontWeight: '700',
  },
  stepLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#E0E0E0',
    top: 18,
    left: -50,
    right: -50,
    zIndex: 1,
  },
  stepLineActive: {
    backgroundColor: '#4CAF50',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  form: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 20,
    marginBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: '#E8F5E9',
    paddingBottom: 8,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#424242',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputWrapperFocused: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputWrapperError: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
    paddingVertical: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  eyeIcon: {
    padding: 6,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    fontWeight: '500',
    marginTop: 6,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  pickerOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
  },
  pickerOptionSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  pickerText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  selectedPickerText: {
    color: '#4CAF50',
    fontWeight: '700',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chipSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  customSportInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  checkboxGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#FFF',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#424242',
    fontWeight: '500',
  },
  passwordStrengthHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
    gap: 10,
  },
  passwordHintText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
    flex: 1,
  },
  stepButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  stepButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    paddingHorizontal: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  primaryButton: {
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonGradient: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 16,
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
    marginLeft: 4,
  },
  contentContainer: {
    flex: 1,
  },
});

export default RegisterScreen;