import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, StatusBar, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ApiService from '../../services/ApiService';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserTabParamList } from '../../navigation/types';

type NavigationProp = StackNavigationProp<UserTabParamList>;

const TournamentScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [tournaments, setTournaments] = useState<any>({
    upcoming: [],
    live: [],
    past: [],
  });

  useEffect(() => {
    loadTournaments();
  }, [activeTab]);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      const response = await ApiService.tournaments.getAll({
        status: activeTab === 'upcoming' ? 'upcoming' : activeTab === 'live' ? 'live' : 'completed',
        limit: 20
      });

      if (response.data && response.data.success && response.data.data) {
        const fetchedTournaments = response.data.data;
        if (activeTab === 'upcoming') {
          setTournaments({ ...tournaments, upcoming: fetchedTournaments });
        } else if (activeTab === 'live') {
          setTournaments({ ...tournaments, live: fetchedTournaments });
        } else {
          setTournaments({ ...tournaments, past: fetchedTournaments });
        }
      }
    } catch (error: any) {
      console.log('Tournament API error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTournaments = () => {
    const currentList = tournaments[activeTab as keyof typeof tournaments] || [];
    if (!searchQuery) return currentList;
    return currentList.filter((item: any) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location?.city || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderTournamentCard = ({ item }: any) => {
    const slotsLeft = (item.maxTeams || 0) - (item.registeredTeams || 0);
    const startDate = item.dates?.tournamentStart
      ? new Date(item.dates.tournamentStart).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      : item.date || 'TBA';
    const venue = item.location?.address || item.location?.city || item.venue || 'TBA';
    const entryFee = item.entryFee ? `₹${item.entryFee}` : 'Free';
    const imageUrl = item.banner || item.image || 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';

    return (
      <TouchableOpacity
        style={styles.tournamentCard}
        onPress={() => navigation.navigate('TournamentDetail', { tournamentId: item._id || item.id })}
        activeOpacity={0.8}
      >
        <Image source={{ uri: imageUrl }} style={styles.tournamentImage} />
        <View style={styles.tournamentInfo}>
          <View style={styles.tournamentHeader}>
            <View style={styles.tournamentCategory}>
              <Ionicons name="trophy" size={16} color="#F59E0B" />
              <Text style={styles.tournamentCategoryText}>{item.category || 'Tournament'}</Text>
            </View>
            <View style={[styles.slotsBadge, slotsLeft <= 5 && styles.slotsBadgeWarning]}>
              <Text style={styles.slotsText}>
                {slotsLeft > 0 ? `${slotsLeft} slots` : 'Full'}
              </Text>
            </View>
          </View>
          <Text style={styles.tournamentName}>{item.name}</Text>
          <View style={styles.tournamentDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color="#64748B" />
              <Text style={styles.detailText}>{startDate}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color="#64748B" />
              <Text style={styles.detailText}>{venue}</Text>
            </View>
          </View>
          <View style={styles.tournamentStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Entry Fee</Text>
              <Text style={styles.statValue}>{entryFee}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Teams</Text>
              <Text style={styles.statValue}>
                {item.registeredTeams || 0}/{item.maxTeams || 0}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('TournamentDetail', { tournamentId: item._id || item.id })}
          >
            <Text style={styles.registerButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredTournaments = getFilteredTournaments();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
      {/* Header */}
      <View style={styles.header}>
        {isSearching ? (
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#64748B" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tournaments..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity onPress={() => { setIsSearching(false); setSearchQuery(''); }}>
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.headerTitle}>Tournaments</Text>
            <TouchableOpacity style={styles.searchButton} onPress={() => setIsSearching(true)}>
              <Ionicons name="search-outline" size={24} color="#0F172A" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'live' && styles.activeTab]}
          onPress={() => setActiveTab('live')}
        >
          <Text style={[styles.tabText, activeTab === 'live' && styles.activeTabText]}>Live</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>Past</Text>
        </TouchableOpacity>
      </View>

      {/* Tournament List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Loading tournaments...</Text>
        </View>
      ) : filteredTournaments.length > 0 ? (
        <FlatList
          data={filteredTournaments}
          renderItem={renderTournamentCard}
          keyExtractor={(item) => item._id || item.id}
          contentContainerStyle={styles.tournamentList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="trophy-outline" size={64} color="#C8E6C9" />
          <Text style={styles.emptyText}>{searchQuery ? 'No matches found' : 'No tournaments found'}</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery
              ? `Try searching for something else or clear the search.`
              : activeTab === 'upcoming'
                ? 'Check back soon for upcoming tournaments!'
                : activeTab === 'live'
                  ? 'No live tournaments at the moment.'
                  : 'No past tournaments to display.'}
          </Text>
          {searchQuery && (
            <TouchableOpacity style={styles.clearSearchBtn} onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearchText}>Clear Search</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    height: 70,
    backgroundColor: '#E8F5E9',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    elevation: 2,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 54,
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 6,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#2E7D32',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tournamentList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  tournamentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  tournamentImage: {
    width: '100%',
    height: 140,
  },
  tournamentInfo: {
    padding: 20,
  },
  tournamentName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    lineHeight: 24,
  },
  tournamentDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
    fontWeight: '500',
  },
  tournamentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0FDF4',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1B5E20',
  },
  registerButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tournamentCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tournamentCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
    marginLeft: 4,
  },
  slotsBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  slotsBadgeWarning: {
    backgroundColor: '#FEF2F2',
  },
  slotsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '800',
    color: '#1B5E20',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  clearSearchBtn: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#C8E6C9',
  },
  clearSearchText: {
    color: '#1B5E20',
    fontWeight: '700',
  },
});

export default TournamentScreen;