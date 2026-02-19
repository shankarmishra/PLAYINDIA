import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface WelcomeCardProps {
  userName?: string;
  favoriteGames?: string[];
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ userName, favoriteGames }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.welcomeCard}>
      <View style={styles.welcomeContent}>
        <Text style={styles.welcomeText}>
          {getGreeting()} 👋
        </Text>
        <Text style={styles.userName}>{userName || 'Player'}</Text>
        <Text style={styles.welcomeSubtitle}>
          {favoriteGames && favoriteGames.length > 0
            ? `Ready to play ${favoriteGames[0]} today?`
            : 'Ready to play some sports today?'}
        </Text>
      </View>
      <View style={styles.welcomeIconContainer}>
        <Ionicons name="fitness" size={48} color="#1ED760" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#0891B2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
  },
});

export default WelcomeCard;
