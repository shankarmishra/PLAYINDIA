import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Platform,
  PermissionsAndroid,
  Button,
  Modal,
} from 'react-native';
import AsyncStorage from '../../utils/AsyncStorageSafe';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


// Define types
type RootStackParamList = {
  CoachLogin: undefined;
  CoachRegister: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

// Step 1: Personal Details
const Step1PersonalDetails = ({ formData, setFormData, nextStep }) => {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Step 1 of 4: Personal Details</Text>
      <View style={styles.progressIndicator}>
        <View style={[styles.progressStep, styles.activeStep]} />
        <View style={styles.progressStep} />
        <View style={styles.progressStep} />
        <View style={styles.progressStep} />
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={formData.name}
        onChangeText={(text) => setFormData({...formData, name: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={formData.mobile}
        onChangeText={(text) => setFormData({...formData, mobile: text})}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({...formData, email: text})}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => setFormData({...formData, password: text})}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={nextStep}>
        <Text style={styles.buttonText}>Next: Professional Details</Text>
      </TouchableOpacity>
    </View>
  );
};

// Step 2: Professional Details
const Step2ProfessionalDetails = ({ formData, setFormData, nextStep, prevStep }) => {
  const sportsOptions = ['Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton', 'Yoga', 'Boxing', 'Swimming'];
  const languagesOptions = ['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali'];
  
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Step 2 of 4: Professional Details</Text>
      <View style={styles.progressIndicator}>
        <View style={[styles.progressStep, styles.activeStep]} />
        <View style={[styles.progressStep, styles.activeStep]} />
        <View style={styles.progressStep} />
        <View style={styles.progressStep} />
      </View>
      
      <Text style={styles.label}>Sports Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
        {sportsOptions.map((sport, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.chip,
              formData.sports.includes(sport) && styles.selectedChip
            ]}
            onPress={() => {
              const newSports = formData.sports.includes(sport)
                ? formData.sports.filter(s => s !== sport)
                : [...formData.sports, sport];
              setFormData({...formData, sports: newSports});
            }}
          >
            <Text style={styles.chipText}>{sport}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <TextInput
        style={styles.input}
        placeholder="Experience (years)"
        value={formData.experience}
        onChangeText={(text) => setFormData({...formData, experience: text})}
        keyboardType="numeric"
      />
      
      <Text style={styles.label}>Coaching Type</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity 
          style={styles.radioOption}
          onPress={() => setFormData({...formData, coachingType: 'Personal'})}
        >
          <View style={[styles.radioCircle, formData.coachingType === 'Personal' && styles.selectedRadio]} />
          <Text style={styles.radioText}>Personal</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.radioOption}
          onPress={() => setFormData({...formData, coachingType: 'Group'})}
        >
          <View style={[styles.radioCircle, formData.coachingType === 'Group' && styles.selectedRadio]} />
          <Text style={styles.radioText}>Group</Text>
        </TouchableOpacity>
      </View>
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Bio (about coach)"
        value={formData.bio}
        onChangeText={(text) => setFormData({...formData, bio: text})}
        multiline
        numberOfLines={4}
      />
      
      <Text style={styles.label}>Languages Spoken</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
        {languagesOptions.map((lang, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.chip,
              formData.languages.includes(lang) && styles.selectedChip
            ]}
            onPress={() => {
              const newLanguages = formData.languages.includes(lang)
                ? formData.languages.filter(l => l !== lang)
                : [...formData.languages, lang];
              setFormData({...formData, languages: newLanguages});
            }}
          >
            <Text style={styles.chipText}>{lang}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.prevButton} onPress={prevStep}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={nextStep}>
          <Text style={styles.buttonText}>Next: Documents</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Step 3: Documents Upload
const Step3DocumentsUpload = ({ formData, setFormData, nextStep, prevStep, uploadImage }) => {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Step 3 of 4: Documents Upload</Text>
      <View style={styles.progressIndicator}>
        <View style={[styles.progressStep, styles.activeStep]} />
        <View style={[styles.progressStep, styles.activeStep]} />
        <View style={[styles.progressStep, styles.activeStep]} />
        <View style={styles.progressStep} />
      </View>
      
      <Text style={styles.label}>Upload Documents</Text>
      
      <TouchableOpacity style={styles.uploadContainer} onPress={() => uploadImage('aadhaar')}>
        <Text style={styles.uploadIcon}>📄</Text>
        <Text style={styles.uploadText}>Aadhaar / PAN</Text>
        {formData.aadhaar && <Text style={styles.uploadedText}>Uploaded ✓</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.uploadContainer} onPress={() => uploadImage('certificate')}>
        <Text style={styles.uploadIcon}>🎓</Text>
        <Text style={styles.uploadText}>Coaching Certificate</Text>
        {formData.certificate && <Text style={styles.uploadedText}>Uploaded ✓</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.uploadContainer} onPress={() => uploadImage('achievement')}>
        <Text style={styles.uploadIcon}>🏆</Text>
        <Text style={styles.uploadText}>Achievement Proof</Text>
        {formData.achievement && <Text style={styles.uploadedText}>Uploaded ✓</Text>}
      </TouchableOpacity>
      
      <Text style={styles.label}>Bank Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Account Number"
        value={formData.bankAccount}
        onChangeText={(text) => setFormData({...formData, bankAccount: text})}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="IFSC Code"
        value={formData.bankIFSC}
        onChangeText={(text) => setFormData({...formData, bankIFSC: text})}
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.prevButton} onPress={prevStep}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={nextStep}>
          <Text style={styles.buttonText}>Next: Location & Fees</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Step 4: Location & Fees
const Step4LocationFees = ({ formData, setFormData, submitRegistration, prevStep }) => {
  const daysOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Step 4 of 4: Location & Fees</Text>
      <View style={styles.progressIndicator}>
        <View style={[styles.progressStep, styles.activeStep]} />
        <View style={[styles.progressStep, styles.activeStep]} />
        <View style={[styles.progressStep, styles.activeStep]} />
        <View style={[styles.progressStep, styles.activeStep]} />
      </View>
      
      <Text style={styles.label}>Coaching Area (Map pin)</Text>
      <TouchableOpacity style={styles.mapContainer}>
        <Text style={styles.mapText}>Tap to select location on map</Text>
      </TouchableOpacity>
      
      <TextInput
        style={styles.input}
        placeholder="Preferred Radius (km)"
        value={formData.radius}
        onChangeText={(text) => setFormData({...formData, radius: text})}
        keyboardType="numeric"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Fee per session"
        value={formData.fee}
        onChangeText={(text) => setFormData({...formData, fee: text})}
        keyboardType="numeric"
      />
      
      <Text style={styles.label}>Available Days</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
        {daysOptions.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.chip,
              formData.days.includes(day) && styles.selectedChip
            ]}
            onPress={() => {
              const newDays = formData.days.includes(day)
                ? formData.days.filter(d => d !== day)
                : [...formData.days, day];
              setFormData({...formData, days: newDays});
            }}
          >
            <Text style={styles.chipText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.prevButton} onPress={prevStep}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={submitRegistration}>
          <Text style={styles.buttonText}>Submit Registration</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Status Screen
const StatusScreen = ({ status, message }) => {
  return (
    <View style={styles.statusContainer}>
      <Text style={styles.statusTitle}>Registration Status</Text>
      <Text style={styles.statusText}>{status}</Text>
      <Text style={styles.statusMessage}>{message}</Text>
      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>Check Status Later</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function CoachRegister() {
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationStatus, setRegistrationStatus] = useState<'pending' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    sports: [],
    experience: '',
    coachingType: 'Personal',
    bio: '',
    languages: [],
    aadhaar: '',
    certificate: '',
    achievement: '',
    bankAccount: '',
    bankIFSC: '',
    radius: '',
    fee: '',
    days: [],
  });
  
  const navigation = useNavigation<NavigationProp>();
  
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const uploadImage = (type) => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1000,
      maxHeight: 1000,
    };
    
    // Image picker functionality would go here
          // For now, simulating upload
          setTimeout(() => {
            const imageUri = 'simulated_image_uri';
            
            if (type === 'aadhaar') {
              setFormData({...formData, aadhaar: imageUri});
            } else if (type === 'certificate') {
              setFormData({...formData, certificate: imageUri});
            } else if (type === 'achievement') {
              setFormData({...formData, achievement: imageUri});
            }
          }, 500); // Simulate upload delay
    });
  };
  
  const submitRegistration = async () => {
    try {
      // Simulate registration submission
      const registrationData = {
        ...formData,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(`coach_registration_${formData.email}`, JSON.stringify(registrationData));
      
      // Set status screen
      setRegistrationStatus('pending');
      
      Alert.alert('Success', 'Registration submitted successfully! Please wait for verification.', [
        { text: 'OK', onPress: () => navigation.navigate('CoachLogin') }
      ]);
    } catch (error) {
      console.error('Registration submission error:', error);
      Alert.alert('Error', 'An error occurred during registration submission');
    }
  };
  
  if (registrationStatus) {
    return <StatusScreen status="Pending Verification" message="Your registration is under review. You will be notified once approved." />;
  }
  
  return (
    <ScrollView style={styles.container}>
      {currentStep === 1 && (
        <Step1PersonalDetails
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
        />
      )}
      {currentStep === 2 && (
        <Step2ProfessionalDetails
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      {currentStep === 3 && (
        <Step3DocumentsUpload
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
          prevStep={prevStep}
          uploadImage={uploadImage}
        />
      )}
      {currentStep === 4 && (
        <Step4LocationFees
          formData={formData}
          setFormData={setFormData}
          submitRegistration={submitRegistration}
          prevStep={prevStep}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  stepContainer: {
    padding: 20,
    flex: 1,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    width: '80%',
    alignSelf: 'center',
  },
  progressStep: {
    height: 8,
    flex: 1,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 2,
    borderRadius: 4,
  },
  activeStep: {
    backgroundColor: '#1ED760',
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  prevButton: {
    backgroundColor: '#6C757D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkText: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  chip: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedChip: {
    backgroundColor: '#1ED760',
  },
  chipText: {
    color: '#333',
    fontSize: 14,
  },
  selectedChipText: {
    color: '#fff',
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#BDBDBD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedRadio: {
    backgroundColor: '#1ED760',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  uploadContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  uploadIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  uploadedText: {
    color: '#1ED760',
    fontSize: 14,
    marginTop: 5,
  },
  mapContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mapText: {
    fontSize: 16,
    color: '#6B7280',
  },
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1ED760',
  },
  statusMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#6B7280',
  },
});
