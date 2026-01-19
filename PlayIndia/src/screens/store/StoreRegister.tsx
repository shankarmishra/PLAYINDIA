import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import useAuth from '../../hooks/useAuth';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function StoreRegister() {
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const { register } = useAuth();

  const handleRegister = async () => {
    // Validate all fields are filled
    if (!storeName || !ownerName || !email || !mobile || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Validate owner name (2-50 characters)
    const trimmedOwnerName = ownerName.trim();
    if (trimmedOwnerName.length < 2 || trimmedOwnerName.length > 50) {
      Alert.alert('Error', 'Owner name must be between 2 and 50 characters');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please provide a valid email address');
      return;
    }

    // Validate mobile number (10 digits)
    const mobileDigits = mobile.replace(/\D/g, '');
    if (mobileDigits.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    // Validate password length (minimum 8 characters)
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    // Validate password complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      Alert.alert(
        'Password Requirements',
        'Password must contain at least:\n• One uppercase letter\n• One lowercase letter\n• One number\n• One special character'
      );
      return;
    }

    try {
      setLoading(true);
      
      // Register with backend API
      const registerData = {
        name: ownerName,
        email: email.trim().toLowerCase(),
        mobile: mobile.trim(),
        password,
        role: 'seller',
        storeName: storeName.trim(),
        ownerName: ownerName.trim(),
      };

      await register(
        ownerName,
        email.trim().toLowerCase(),
        password,
        mobile.trim(),
        'seller',
        { city: '' }
      );

      // After successful registration, navigate to tracking page
      Alert.alert(
        'Registration Successful',
        'Your store registration has been submitted. Please wait for admin approval.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to tracking screen
              navigation.replace('StoreApprovalTracking');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Failed',
        error.message || 'An error occurred during registration. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Store Registration</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Store Name"
        value={storeName}
        onChangeText={setStoreName}
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Owner Name (2-50 characters)"
        value={ownerName}
        onChangeText={setOwnerName}
        editable={!loading}
        maxLength={50}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password (min 8 chars, with uppercase, lowercase, number & special)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      <Text style={styles.helperText}>
        Password must be at least 8 characters and contain uppercase, lowercase, number, and special character
      </Text>
      
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
        <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        disabled={loading}
      >
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#1ED760',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkText: {
    color: '#1ED760',
    textAlign: 'center',
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: -10,
    marginBottom: 15,
    paddingHorizontal: 4,
  },
});
