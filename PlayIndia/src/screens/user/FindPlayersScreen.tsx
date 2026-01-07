import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FindPlayersScreen = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [filter, setFilter] = useState('all');

  // Mock data for players
  const players = [
    {
      id: '1',
      name: 'Amit Patel',
      sport: 'Cricket',
      skillLevel: 'Pro',
      distance: '2.5 km',
      availability: 'Available',
      rating: 4.8,
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: '2',
      name: 'Priya Sharma',
      sport: 'Badminton',
      skillLevel: 'Intermediate',
      distance: '1.8 km',
      availability: 'Busy',
      rating: 4.5,
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: '3',
      name: 'Raj Kumar',
      sport: 'Football',
      skillLevel: 'Beginner',
      distance: '3.2 km',
      availability: 'Available',
      rating: 4.2,
      image: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
    {
      id: '4',
      name: 'Sneha Nair',
      sport: 'Tennis',
      skillLevel: 'Pro',
      distance: '0.8 km',
      availability: 'Available',
      rating: 4.9,
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
  ];

  const filterOptions = [
    { id: 'all', label: 'All Sports' },
    { id: 'cricket', label: 'Cricket' },
    { id: 'football', label: 'Football' },
    { id: 'badminton', label: 'Badminton' },
    { id: 'tennis', label: 'Tennis' },
  ];

  const renderPlayerCard = ({ item }: any) => (
    <View style={styles.playerCard}>
      <View style={styles.playerHeader}>
        <Image source={{ uri: item.image }} style={styles.playerImage} />
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.name}</Text>
          <Text style={styles.playerSport}>{item.sport} • {item.skillLevel}</Text>
          <View style={styles.playerStats}>
            <View style={styles.statItem}>
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text style={styles.statText}>{item.distance}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.statText}>{item.rating}</Text>
            </View>
          </View>
        </View>
        <View style={[
          styles.availabilityBadge, 
          { 
            backgroundColor: item.availability === 'Available' ? 
              '#10B98120' : 
              '#F59E0B20' 
          }
        ]}>
          <Text style={[
            styles.availabilityText, 
            { 
              color: item.availability === 'Available' ? 
                '#10B981' : 
                '#F59E0B' 
            }
          ]}>
            {item.availability}
          </Text>
        </View>
      </View>
      <View style={styles.playerActions}>
        <TouchableOpacity style={[styles.actionButton, styles.inviteButton]}>
          <Text style={styles.actionButtonText}>Send Invite</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.chatButton]}>
          <Text style={styles.actionButtonText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.profileButton]}>
          <Text style={styles.actionButtonText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.mapToggle}>
          <Ionicons name="map-outline" size={24} color="#1F2937" />
          <Text style={styles.mapToggleText}>Map View</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterToggle}>
          <Ionicons name="filter-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterChipsContainer}
        contentContainerStyle={styles.filterChipsContent}
      >
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.filterChip,
              filter === option.id && styles.filterChipActive
            ]}
            onPress={() => setFilter(option.id)}
          >
            <Text style={[
              styles.filterChipText,
              filter === option.id && styles.filterChipTextActive
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'list' && styles.activeTab]} 
          onPress={() => setActiveTab('list')}
        >
          <Ionicons 
            name="list-outline" 
            size={20} 
            color={activeTab === 'list' ? '#0B1C2D' : '#6B7280'} 
          />
          <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>List</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'map' && styles.activeTab]} 
          onPress={() => setActiveTab('map')}
        >
          <Ionicons 
            name="map-outline" 
            size={20} 
            color={activeTab === 'map' ? '#0B1C2D' : '#6B7280'} 
          />
          <Text style={[styles.tabText, activeTab === 'map' && styles.activeTabText]}>Map</Text>
        </TouchableOpacity>
      </View>

      {/* Player List */}
      <FlatList
        data={players}
        renderItem={renderPlayerCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.playerList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Off-white background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  mapToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12, // Medium border radius
  },
  mapToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  filterToggle: {
    padding: 8,
  },
  filterChipsContainer: {
    marginVertical: 16,
  },
  filterChipsContent: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16, // Large border radius
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: '#0B1C2D', // Dark Navy
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12, // Medium border radius
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // Medium border radius
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#0B1C2D', // Dark Navy
  },
  playerList: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Extra space for potential FAB
  },
  playerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16, // Large border radius
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  playerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  playerSport: {
    fontSize: 14,
    color: '#6B7280',
    marginVertical: 4,
  },
  playerStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8, // Small border radius
    alignSelf: 'flex-start',
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  playerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 0.3,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12, // Medium border radius
  },
  inviteButton: {
    backgroundColor: '#1ED760', // Neon Green
  },
  chatButton: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  profileButton: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonText: {
    color: '#1F2937',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default FindPlayersScreen;