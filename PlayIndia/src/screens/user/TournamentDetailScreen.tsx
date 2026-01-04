import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, Animated } from 'react-native';

const TournamentDetailScreen = ({ route, navigation }: any) => {
  const { tournamentId } = route.params || {};
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [scaleAnim] = React.useState(new Animated.Value(0.9));

  React.useEffect(() => {
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

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tournament Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareButtonText}>🔗</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[
          styles.heroSection,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}>
          <View style={styles.heroLogo}>
            <Text style={styles.heroLogoText}>🏆</Text>
          </View>
          <Text style={styles.title}>Championship Cup</Text>
          <Text style={styles.subtitle}>Tournament ID: {tournamentId || 'N/A'}</Text>
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>32</Text>
              <Text style={styles.statLabel}>Teams</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>₹50K</Text>
              <Text style={styles.statLabel}>Prize Pool</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>15</Text>
              <Text style={styles.statLabel}>Days Left</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📌 Event Information</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Open</Text>
            </View>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📅</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>March 15-20, 2026</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📍</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>Mumbai Sports Arena</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>⚽</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Sport</Text>
                <Text style={styles.infoValue}>Football</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🎯</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Skill Level</Text>
                <Text style={styles.infoValue}>Intermediate</Text>
              </View>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.descriptionTitle}>About Tournament</Text>
          <Text style={styles.placeholderText}>
            This tournament brings together the best local talent for an unforgettable competition. Participants will compete in a knockout format with exciting prizes for winners. Don't miss this opportunity to showcase your skills!
          </Text>
        </Animated.View>

        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.cardTitle}>👥 Registered Teams (8/32)</Text>
          <View style={styles.teamsList}>
            {['Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta'].map((team, index) => (
              <View key={index} style={styles.teamItem}>
                <View style={styles.teamAvatar}>
                  <Text style={styles.teamAvatarText}>{team.charAt(5)}</Text>
                </View>
                <Text style={styles.teamName}>{team}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <TouchableOpacity style={styles.registerButton} onPress={() => Alert.alert('Success! 🎉', 'Registration request sent. We\'ll notify you soon!')}>
          <Text style={styles.registerButtonText}>Register Now 🚀</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Share with Team 📤</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  backButtonText: {
    fontSize: 22,
    color: '#0D1B1E',
    fontWeight: 'bold',
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  shareButtonText: {
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#0D1B1E',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  heroLogo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#00B8D4',
    shadowColor: '#00B8D4',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
  heroLogoText: {
    fontSize: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0D1B1E',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#718096',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 20,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00B8D4',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#718096',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 25,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 20,
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
  },
  infoGrid: {
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 32,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#0D1B1E',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D1B1E',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FBFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00B8D4',
    marginRight: 6,
  },
  statusText: {
    color: '#00B8D4',
    fontSize: 12,
    fontWeight: 'bold',
  },
  placeholderText: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 24,
  },
  teamsList: {
    marginTop: 15,
  },
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
  },
  teamAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6FBFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  teamAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00B8D4',
  },
  teamName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0D1B1E',
  },
  registerButton: {
    backgroundColor: '#00B8D4',
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#00B8D4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#00B8D4',
  },
  secondaryButtonText: {
    color: '#00B8D4',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default TournamentDetailScreen;
