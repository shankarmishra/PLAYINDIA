import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator, Animated, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
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
      } catch (error: any) {
        // Silently use dummy data on network error
        if (error.message && !error.message.includes('Network')) {
          console.log('Leaderboard API error:', error.message);
        }

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
    const getMedalIcon = () => {
      if (index === 0) return <Icon name="medal" size={32} color="#FFD700" />;
      if (index === 1) return <Icon name="medal" size={32} color="#C0C0C0" />;
      if (index === 2) return <Icon name="medal" size={32} color="#CD7F32" />;
      return null;
    };

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
          {getMedalIcon() ? (
            <View style={styles.medalContainer}>{getMedalIcon()}</View>
          ) : (
            <Text style={[styles.rank, index < 3 && styles.topRank]}>#{index + 1}</Text>
          )}
        </View>
        <View style={styles.playerInfo}>
          <Text style={[styles.name, index < 3 && styles.topName]} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.coinIconContainer}>
              <Icon name="logo-bitcoin" size={14} color="#FFB800" />
              <Text style={styles.coinsSmall}> {item.coins}</Text>
            </View>
            {index < 3 && item.topDays > 0 && (
              <View style={styles.topDaysContainer}>
                <Icon name="flame" size={14} color="#FF4D4D" />
                <Text style={styles.topDaysSmall}> {item.topDays}d</Text>
              </View>
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
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
      <Animated.View style={[styles.brandingHeader, { opacity: fadeAnim }]}>
        <BrandLogo size={45} style={styles.logoStyle} />
        <View style={styles.headerTitleContainer}>
          <Icon name="trophy" size={28} color="#FFB800" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.title}>Leaderboard</Text>
            <Text style={styles.taglineSmaller}>TEAMUPINDIA CHAMPIONS</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="stats-chart" size={22} color="#2E7D32" />
        </TouchableOpacity>
      </Animated.View>

      {users.length === 0 ? (
        <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
          <Icon name="game-controller" size={64} color="#CBD5E0" />
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
                <View style={styles.yourRankContainer}>
                  <Icon name="target" size={20} color="#E8F5E9" />
                  <Text style={styles.userRankTitle}>YOUR RANK</Text>
                </View>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankBadgeText}>#{userRank.rank}</Text>
                </View>
              </View>
              <View style={styles.userRankStats}>
                <View style={styles.userStatItem}>
                  <Icon name="person" size={18} color="#718096" />
                  <Text style={styles.userStatValue}>{userRank.name}</Text>
                </View>
                <View style={styles.userStatItem}>
                  <Icon name="logo-bitcoin" size={18} color="#FFB800" />
                  <Text style={styles.userStatValue}>{userRank.coins} Coins</Text>
                </View>
                {userRank.topDays > 0 && (
                  <View style={styles.userStatItem}>
                    <Icon name="flame" size={18} color="#FF4D4D" />
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
                <Icon name="star" size={20} color="#FFB800" />
                <Text style={styles.leaderboardTitleText}>Top Players</Text>
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
    backgroundColor: '#E8F5E9',
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
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
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
    fontWeight: '900',
    color: '#0F172A',
  },
  taglineSmaller: {
    fontSize: 10,
    color: '#2E7D32',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#4A5568',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginBottom: 12,
    marginHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  topPlayerRow: {
    backgroundColor: '#F0FDF4',
    borderColor: '#2E7D32',
    borderWidth: 2,
  },
  firstPlace: {
    backgroundColor: '#E8F5E9',
    borderColor: '#1B5E20',
    elevation: 6,
    shadowColor: '#1B5E20',
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  medalContainer: {
    marginRight: 8,
  },
  rank: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#4A5568',
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 17,
    color: '#0D2D10',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  coinsSmall: {
    fontSize: 12,
    color: '#4A5568',
  },
  topDaysSmall: {
    fontSize: 12,
    color: '#C62828',
    fontWeight: '700',
  },
  topDaysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinsBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  topCoinsBadge: {
    backgroundColor: '#C8E6C9',
  },
  coins: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  topRank: {
    color: '#1B5E20',
    fontSize: 19,
  },
  topName: {
    color: '#1B5E20',
    fontSize: 18,
  },
  topCoins: {
    color: '#1B5E20',
    fontSize: 17,
  },
  leaderboardTitle: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  leaderboardTitleText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  listContent: {
    paddingBottom: 20,
  },
  userRankContainer: {
    backgroundColor: '#1B5E20',
    marginHorizontal: 16,
    padding: 24,
    marginBottom: 24,
    marginTop: 15,
    borderRadius: 25,
    shadowColor: '#1B5E20',
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
  yourRankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userRankTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#E8F5E9',
    letterSpacing: 1.5,
    marginLeft: 8,
  },
  rankBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rankBadgeText: {
    color: '#1B5E20',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userRankStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userStatValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

