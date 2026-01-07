import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { Button, Card, Chip } from '../components/UIComponents';
import { theme } from '../theme/colors';
import BrandLogo from '../components/BrandLogo';
import useAuth from '../hooks/useAuth';
import { useNavigation, StackActions } from '@react-navigation/native';
import { StackScreenProps, StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  icon?: string;
}

const Input: React.FC<InputProps> = ({ label, placeholder, value, onChangeText, secureTextEntry = false }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
};

type Props = StackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const { register } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const sportsOptions = [
    'Cricket', 'Football', 'Badminton', 'Tennis', 'Basketball', 
    'Yoga', 'Gym', 'Swimming', 'Table Tennis', 'Chess'
  ];

  const toggleSport = (sport: string) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter(s => s !== sport));
    } else {
      setSelectedSports([...selectedSports, sport]);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !mobile || !password || !city || selectedSports.length === 0) {
      Alert.alert('Error', 'Please fill in all fields and select at least one sport');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const result = await register(name, email, password, mobile, 'user');
      if (result.success) {
        // Navigate to appropriate screen after successful registration
        navigation.dispatch(StackActions.replace('Login'));
      } else {
        Alert.alert('Registration Failed', result.message || 'An error occurred');
      }
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <BrandLogo size={80} />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join our sports community today</Text>
      </View>

      <Card style={styles.card}>
        {/* Step Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressStep}>
            <View style={styles.progressStepActive}>
              <Text style={styles.progressStepText}>1</Text>
            </View>
            <Text style={styles.progressLabel}>Info</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}>
            <View style={styles.progressStepInactive}>
              <Text style={styles.progressStepText}>2</Text>
            </View>
            <Text style={styles.progressLabel}>Sports</Text>
          </View>
          <View style={styles.progressLine} />
          <View style={styles.progressStep}>
            <View style={styles.progressStepInactive}>
              <Text style={styles.progressStepText}>3</Text>
            </View>
            <Text style={styles.progressLabel}>Complete</Text>
          </View>
        </View>

        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          icon="person-outline"
        />

        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          icon="mail-outline"
        />

        <Input
          label="Mobile Number"
          placeholder="Enter your mobile number"
          value={mobile}
          onChangeText={setMobile}
          icon="call-outline"
        />

        <Input
          label="Password"
          placeholder="Create a password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          icon="lock-closed-outline"
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          icon="lock-closed-outline"
        />

        <Input
          label="City"
          placeholder="Enter your city"
          value={city}
          onChangeText={setCity}
          icon="location-outline"
        />

        <Text style={styles.sectionTitle}>Favorite Sports</Text>
        <Text style={styles.sectionSubtitle}>Select the sports you enjoy</Text>

        <View style={styles.chipContainer}>
          {sportsOptions.map((sport, index) => (
            <Chip
              key={index}
              title={sport}
              selected={selectedSports.includes(sport)}
              onPress={() => toggleSport(sport)}
            />
          ))}
        </View>

        <Button 
          title="Create Account" 
          onPress={handleRegister} 
          disabled={loading}
          variant="primary"
          style={styles.button}
        />

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <Button 
            title="Google" 
            onPress={() => Alert.alert('Google Register')} 
            variant="secondary"
            style={styles.socialButton}
          />
          <Button 
            title="Facebook" 
            onPress={() => Alert.alert('Facebook Register')} 
            variant="secondary"
            style={styles.socialButton}
          />
        </View>
      </Card>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By registering, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  progressStep: {
    alignItems: 'center',
    zIndex: 1,
  },
  progressStepActive: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.accent.neonGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressStepInactive: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.ui.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressStepText: {
    color: theme.colors.text.inverted,
    fontWeight: 'bold',
    fontSize: 14,
  },
  progressLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.ui.border,
    marginHorizontal: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: theme.spacing.md,
  },
  button: {
    marginTop: theme.spacing.md,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.ui.divider,
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
    color: theme.colors.text.secondary,
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flex: 0.48,
  },
  footer: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  textInputContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 16,
    color: theme.colors.text.primary,
  },
});

export default RegisterScreen;