import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Animated,
} from 'react-native';
import AsyncStorage from '../../utils/AsyncStorageSafe';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserTabParamList } from '../../navigation/UserNav';
import { API_ENDPOINTS } from '../../config/constants';
import BrandLogo from '../../components/BrandLogo';

type NavigationProp = StackNavigationProp<UserTabParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [favoriteGames, setFavoriteGames] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState('');
  const [achievements, setAchievements] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        // Set dummy data for testing without token
        setUsername('Test User');
        setEmail('testuser@playindia.com');
        setFavoriteGames(['Cricket', 'Football', 'Badminton']);
        setSkillLevel('Intermediate');
        setAchievements(['First Tournament Win', 'Top 10 Player']);
        setIsLoading(false);
        return;
      }
      
      const response = await axios.get(API_ENDPOINTS.USERS.PROFILE, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      const {
        name,
        email: userEmail,
        profileImage: userProfileImage,
        favoriteGames: userFavoriteGames = [],
        skillLevel: userSkillLevel,
        achievements: userAchievements = [],
      } = response.data;

      setUsername(name || '');
      setEmail(userEmail || '');
      setProfileImage(userProfileImage || null);
      setFavoriteGames(userFavoriteGames);
      setSkillLevel(userSkillLevel || '');
      setAchievements(userAchievements);
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // Set dummy data if API fails
      setUsername('Test User');
      setEmail('testuser@playindia.com');
      setFavoriteGames(['Cricket', 'Football', 'Badminton']);
      setSkillLevel('Intermediate');
      setAchievements(['First Tournament Win', 'Top 10 Player']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.put(
        API_ENDPOINTS.USERS.PROFILE,
        {
          name: username,
          email,
          profileImage,
          favoriteGames,
          achievements,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userType');
    navigation.navigate('Login');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00B8D4" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.brandingHeader, { opacity: fadeAnim }]}>
        <BrandLogo size={45} style={styles.logoStyle} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile 👤</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutLink}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[
          styles.profileHeader,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}>
          <TouchableOpacity
            onPress={() => Alert.alert('Feature coming soon!', 'Profile photo upload will be available soon! 📸')}
            style={styles.imageWrapper}
          >
            <View style={styles.profileImageContainer}>
              <Text style={styles.profileImagePlaceholder}>👤</Text>
            </View>
            <View style={styles.editBadge}>
              <Text style={styles.editBadgeText}>✎</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>{username || 'Player'}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Wins</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>350</Text>
              <Text style={styles.statLabel}>Coins</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>⚙️ Account Settings</Text>
            <TouchableOpacity 
              onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              style={styles.editButton}
            >
              <Text style={styles.editActionText}>{isEditing ? '✔️ Save' : '✏️ Edit'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>👤 FULL NAME</Text>
            {isEditing ? (
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter your name"
                  placeholderTextColor="#A0AEC0"
                />
              </View>
            ) : (
              <Text style={styles.valueText}>{username || 'Not set'}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>📧 EMAIL ADDRESS</Text>
            {isEditing ? (
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  placeholderTextColor="#A0AEC0"
                />
              </View>
            ) : (
              <Text style={styles.valueText}>{email || 'Not set'}</Text>
            )}
          </View>
        </Animated.View>

        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.cardTitle}>⚽ Sports & Skills</Text>
          <View style={styles.skillRow}>
            <View style={styles.skillItem}>
              <Text style={styles.skillEmoji}>🎯</Text>
              <View>
                <Text style={styles.skillLabel}>Skill Level</Text>
                <Text style={styles.skillValue}>{skillLevel || 'Intermediate'}</Text>
              </View>
            </View>
            <View style={styles.skillItem}>
              <Text style={styles.skillEmoji}>📈</Text>
              <View>
                <Text style={styles.skillLabel}>Experience</Text>
                <Text style={styles.skillValue}>2 Years</Text>
              </View>
            </View>
          </View>

          <Text style={styles.inputLabel}>⭐ FAVORITE GAMES</Text>
          <View style={styles.tagContainer}>
            {favoriteGames.length > 0 ? (
              favoriteGames.map((game, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>{game}</Text>
                </View>
              ))
            ) : (
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>Add your favorite sports to get personalized recommendations!</Text>
              </View>
            )}
          </View>
        </Animated.View>

        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.cardTitle}>🏆 Achievements</Text>
          {achievements.length > 0 ? (
            achievements.map((ach, idx) => (
              <View key={idx} style={styles.achievementItem}>
                <View style={styles.achievementIconContainer}>
                  <Text style={styles.achievementIcon}>🏆</Text>
                </View>
                <Text style={styles.achievementText}>{ach}</Text>
              </View>
            ))
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderEmoji}>🎮</Text>
              <Text style={styles.placeholderText}>No achievements yet.</Text>
              <Text style={styles.placeholderSubtext}>Start playing to earn badges!</Text>
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 10,
  },
  logoStyle: {
    padding: 0,
    marginRight: 10,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D1B1E',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutLink: {
    color: '#FF4D4D',
    fontWeight: 'bold',
    fontSize: 15,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 25,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImageContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#00B8D4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  profileImagePlaceholder: {
    fontSize: 56,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00B8D4',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  profileName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D1B1E',
    marginTop: 15,
  },
  profileEmail: {
    fontSize: 14,
    color: '#718096',
    marginTop: 6,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00B8D4',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 25,
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#0D1B1E',
    marginBottom: 20,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editActionText: {
    color: '#00B8D4',
    fontWeight: 'bold',
    fontSize: 15,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#718096',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  valueText: {
    fontSize: 16,
    color: '#0D1B1E',
    fontWeight: '500',
  },
  inputWrapper: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: {
    fontSize: 16,
    color: '#0D1B1E',
    paddingVertical: 8,
  },
  skillRow: {
    flexDirection: 'row',
    marginBottom: 25,
    gap: 20,
  },
  skillItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skillEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  skillLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#718096',
    marginBottom: 4,
  },
  skillValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#00B8D4',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#E6FBFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#00B8D4',
  },
  tagText: {
    color: '#00B8D4',
    fontWeight: '600',
    fontSize: 14,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    backgroundColor: '#F7FAFC',
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  achievementIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E6FBFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementIcon: {
    fontSize: 22,
  },
  achievementText: {
    flex: 1,
    fontSize: 15,
    color: '#0D1B1E',
    fontWeight: '600',
  },
  placeholderContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  placeholderEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 15,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: 13,
    color: '#A0AEC0',
    textAlign: 'center',
  },
});

export default ProfileScreen;


