import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator, SafeAreaView, Animated, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '../../utils/AsyncStorageSafe';
import { API_ENDPOINTS } from '../../config/constants';
import BrandLogo from '../../components/BrandLogo';

type User = {
  id: string;
  name: string;
  coins: number;
  topDays: number;
};

type UserRank = {
  rank: number;
  name: string;
  coins: number;
  topDays: number;
};

const LeaderBoardScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userRank, setUserRank] = useState<UserRank | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');

        if (!token) {
          // Set dummy data for testing without token
          const dummyUsers: User[] = [
            { id: '1', name: 'Rajesh Kumar', coins: 1500, topDays: 15 },
            { id: '2', name: 'Priya Sharma', coins: 1350, topDays: 8 },
            { id: '3', name: 'Amit Patel', coins: 1200, topDays: 5 },
            { id: '4', name: 'Sneha Reddy', coins: 1100, topDays: 3 },
            { id: '5', name: 'Vikram Singh', coins: 980, topDays: 2 },
          ];
          
          setUsers(dummyUsers);
          setUserRank({ rank: 12, name: 'You', coins: 650, topDays: 0 });
          setIsLoading(false);
          return;
        }

        const response = await axios.get(API_ENDPOINTS.USERS.LEADERBOARD, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        });

        setUsers(response.data.leaderboard || []);
        setUserRank(response.data.userRank || null);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        
        // Set dummy data if API fails
        const dummyUsers: User[] = [
          { id: '1', name: 'Rajesh Kumar', coins: 1500, topDays: 15 },
          { id: '2', name: 'Priya Sharma', coins: 1350, topDays: 8 },
          { id: '3', name: 'Amit Patel', coins: 1200, topDays: 5 },
          { id: '4', name: 'Sneha Reddy', coins: 1100, topDays: 3 },
          { id: '5', name: 'Vikram Singh', coins: 980, topDays: 2 },
        ];
        
        setUsers(dummyUsers);
        setUserRank({ rank: 12, name: 'You', coins: 650, topDays: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const renderItem = ({ item, index }: { item: User; index: number }) => {
    const medalEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
    
    return (
      <Animated.View style={[
        styles.row,
        index < 3 && styles.topPlayerRow,
        index === 0 && styles.firstPlace,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}>
        <View style={styles.rankContainer}>
          {medalEmoji ? (
            <Text style={styles.medalEmoji}>{medalEmoji}</Text>
          ) : (
            <Text style={[styles.rank, index < 3 && styles.topRank]}>#{index + 1}</Text>
          )}
        </View>
        <View style={styles.playerInfo}>
          <Text style={[styles.name, index < 3 && styles.topName]} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.statsRow}>
            <Text style={styles.coinsSmall}>🪙 {item.coins}</Text>
            {index < 3 && item.topDays > 0 && (
              <Text style={styles.topDaysSmall}>🔥 {item.topDays}d</Text>
            )}
          </View>
        </View>
        <View style={[styles.coinsBadge, index < 3 && styles.topCoinsBadge]}>
          <Text style={[styles.coins, index < 3 && styles.topCoins]}>{item.coins}</Text>
        </View>
      </Animated.View>
    );
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
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Leaderboard 🏆</Text>
          <Text style={styles.tagline}>PLAYINDIA CHAMPIONS</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>📊</Text>
        </TouchableOpacity>
      </Animated.View>

      {users.length === 0 ? (
        <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
          <Text style={styles.emptyEmoji}>🎮</Text>
          <Text style={styles.emptyText}>No leaderboard data available.</Text>
          <Text style={styles.emptySubtext}>Start playing to see rankings!</Text>
        </Animated.View>
      ) : (
        <>
          {userRank && (
            <Animated.View style={[
              styles.userRankContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}>
              <View style={styles.userRankHeader}>
                <Text style={styles.userRankTitle}>🎯 YOUR RANK</Text>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankBadgeText}>#{userRank.rank}</Text>
                </View>
              </View>
              <View style={styles.userRankStats}>
                <View style={styles.userStatItem}>
                  <Text style={styles.userStatIcon}>👤</Text>
                  <Text style={styles.userStatValue}>{userRank.name}</Text>
                </View>
                <View style={styles.userStatItem}>
                  <Text style={styles.userStatIcon}>🪙</Text>
                  <Text style={styles.userStatValue}>{userRank.coins} Coins</Text>
                </View>
                {userRank.topDays > 0 && (
                  <View style={styles.userStatItem}>
                    <Text style={styles.userStatIcon}>🔥</Text>
                    <Text style={styles.userStatValue}>{userRank.topDays} {userRank.topDays === 1 ? 'Day' : 'Days'}</Text>
                  </View>
                )}
              </View>
            </Animated.View>
          )}

          <FlatList
            data={users}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            ListHeaderComponent={
              <Animated.View style={[styles.leaderboardTitle, { opacity: fadeAnim }]}>
                <Text style={styles.leaderboardTitleText}>🌟 Top Players</Text>
              </Animated.View>
            }
            contentContainerStyle={styles.listContent}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default LeaderBoardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  brandingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 15,
  },
  filterButton: {
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
  filterIcon: {
    fontSize: 18,
  },
  logoStyle: {
    padding: 0,
    marginRight: 10,
  },
  headerTitleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0D1B1E',
  },
  tagline: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#4A5568',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    marginBottom: 15,
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A5568',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginBottom: 12,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  topPlayerRow: {
    backgroundColor: '#F7FAFC',
    borderColor: '#00B8D4',
    borderWidth: 1.5,
  },
  firstPlace: {
    backgroundColor: '#E6FBFF',
    borderWidth: 2,
    borderColor: '#00B8D4',
    shadowColor: '#00B8D4',
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  medalEmoji: {
    fontSize: 28,
  },
  rank: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#718096',
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 17,
    color: '#0D1B1E',
    fontWeight: '600',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinsSmall: {
    fontSize: 12,
    color: '#718096',
    marginRight: 12,
  },
  topDaysSmall: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  coinsBadge: {
    backgroundColor: '#F7FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  topCoinsBadge: {
    backgroundColor: '#E6FBFF',
  },
  coins: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A5568',
  },
  topRank: {
    color: '#00B8D4',
    fontSize: 19,
  },
  topName: {
    color: '#00B8D4',
    fontSize: 18,
  },
  topCoins: {
    color: '#00B8D4',
    fontSize: 17,
  },
  leaderboardTitle: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  leaderboardTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D1B1E',
  },
  listContent: {
    paddingBottom: 20,
  },
  userRankContainer: {
    backgroundColor: '#0D1B1E',
    marginHorizontal: 20,
    padding: 25,
    marginBottom: 25,
    marginTop: 15,
    borderRadius: 25,
    shadowColor: '#00B8D4',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
  userRankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userRankTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#00B8D4',
    letterSpacing: 1.5,
  },
  rankBadge: {
    backgroundColor: '#00B8D4',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rankBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userRankStats: {
    gap: 12,
  },
  userStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userStatIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 28,
  },
  userStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

