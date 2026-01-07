import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import { theme } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Mock data for players
const mockPlayers = [
  {
    id: '1',
    name: 'Amit Patel',
    sport: 'Cricket',
    skillLevel: 'Pro',
    distance: '2.5 km',
    availability: 'Available',
    rating: 4.8,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    sport: 'Badminton',
    skillLevel: 'Intermediate',
    distance: '1.8 km',
    availability: 'Busy',
    rating: 4.5,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '3',
    name: 'Raj Kumar',
    sport: 'Football',
    skillLevel: 'Beginner',
    distance: '3.2 km',
    availability: 'Available',
    rating: 4.2,
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
  {
    id: '4',
    name: 'Sneha Nair',
    sport: 'Tennis',
    skillLevel: 'Intermediate',
    distance: '0.8 km',
    availability: 'Available',
    rating: 4.7,
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: '5',
    name: 'Vikram Singh',
    sport: 'Basketball',
    skillLevel: 'Pro',
    distance: '4.1 km',
    availability: 'Busy',
    rating: 4.9,
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
  },
];

const NearbyPlayersMap = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showListView, setShowListView] = useState(false);
  const [radius, setRadius] = useState(5); // in KM
  const [filters, setFilters] = useState({
    sport: '',
    skillLevel: '',
    availability: '',
  });

  const handlePlayerPress = (player: any) => {
    setSelectedPlayer(player);
  };

  const handleIncreaseRadius = () => {
    if (radius < 10) {
      setRadius(radius + 2);
    }
  };

  const handleDecreaseRadius = () => {
    if (radius > 1) {
      setRadius(radius - 2);
    }
  };

  const renderPlayerCard = ({ item }: any) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.playerCard}
      onPress={() => handlePlayerPress(item)}
    >
      <View style={styles.playerHeader}>
        <View style={[
          styles.availabilityBadge, 
          { 
            backgroundColor: item.availability === 'Available' 
              ? `${theme.colors.status.success}20` 
              : `${theme.colors.status.warning}20` 
          }
        ]}>
          <Text style={[
            styles.availabilityText, 
            { 
              color: item.availability === 'Available' 
                ? theme.colors.status.success 
                : theme.colors.status.warning 
            }
          ]}>
            {item.availability}
          </Text>
        </View>
        <Text style={styles.playerName}>{item.name}</Text>
      </View>
      <View style={styles.playerDetails}>
        <Text style={styles.playerSport}>{item.sport} • {item.skillLevel}</Text>
        <Text style={styles.playerDistance}>{item.distance}</Text>
      </View>
      <View style={styles.playerStats}>
        <View style={styles.statItem}>
          <Ionicons name="star" size={14} color={theme.colors.accent.orange} />
          <Text style={styles.statText}>{item.rating}</Text>
        </View>
      </View>
      <View style={styles.playerActions}>
        <TouchableOpacity style={[styles.actionButton, styles.inviteButton]}>
          <Text style={styles.actionButtonText}>Invite</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.chatButton]}>
          <Text style={styles.actionButtonText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.profileButton]}>
          <Text style={styles.actionButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={20} color={theme.colors.text.primary} />
          <Text style={styles.locationText}>New Delhi</Text>
          <Ionicons name="chevron-down" size={16} color={theme.colors.text.primary} />
        </View>
        <View style={styles.radiusContainer}>
          <Text style={styles.radiusText}>Radius: {radius} KM</Text>
          <TouchableOpacity style={styles.radiusButton} onPress={handleDecreaseRadius}>
            <Ionicons name="remove" size={16} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.radiusButton} onPress={handleIncreaseRadius}>
            <Ionicons name="add" size={16} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <FlatList
        data={mockPlayers}
        renderItem={renderPlayerCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.bottomButton} 
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="filter-outline" size={20} color={theme.colors.text.primary} />
          <Text style={styles.bottomButtonText}>Filters</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bottomButton} 
          onPress={() => setShowListView(!showListView)}
        >
          <Ionicons 
            name={showListView ? "map-outline" : "list-outline"} 
            size={20} 
            color={theme.colors.text.primary} 
          />
          <Text style={styles.bottomButtonText}>
            {showListView ? "Map View" : "List View"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bottomButton} 
          onPress={() => console.log('Refresh')}
        >
          <Ionicons name="refresh" size={20} color={theme.colors.text.primary} />
          <Text style={styles.bottomButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Player Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedPlayer}
        onRequestClose={() => setSelectedPlayer(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={[
                styles.availabilityBadge, 
                { 
                  backgroundColor: selectedPlayer?.availability === 'Available' 
                    ? `${theme.colors.status.success}20` 
                    : `${theme.colors.status.warning}20` 
                }
              ]}>
                <Text style={[
                  styles.availabilityText, 
                  { 
                    color: selectedPlayer?.availability === 'Available' 
                      ? theme.colors.status.success 
                      : theme.colors.status.warning 
                  }
                ]}>
                  {selectedPlayer?.availability}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedPlayer(null)}>
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.playerProfile}>
              <Text style={styles.playerName}>{selectedPlayer?.name}</Text>
              <Text style={styles.playerSport}>{selectedPlayer?.sport} • {selectedPlayer?.skillLevel}</Text>
              <Text style={styles.playerDistance}>{selectedPlayer?.distance}</Text>
              
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color={theme.colors.accent.orange} />
                <Text style={styles.ratingText}>{selectedPlayer?.rating}</Text>
              </View>
            </View>
            
            <View style={styles.playerActions}>
              <TouchableOpacity style={[styles.actionButton, styles.inviteButton]}>
                <Text style={styles.actionButtonText}>Invite to Play</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.chatButton]}>
                <Text style={styles.actionButtonText}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.profileButton]}>
                <Text style={styles.actionButtonText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Filters Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilters}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.filtersContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView>
              <Text style={styles.filterTitle}>Sport</Text>
              <View style={styles.chipContainer}>
                {['Cricket', 'Football', 'Badminton', 'Tennis', 'Basketball'].map((sport, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={[
                      styles.chip,
                      { backgroundColor: filters.sport === sport ? theme.colors.accent.neonGreen : theme.colors.background.secondary }
                    ]}
                    onPress={() => setFilters({...filters, sport: filters.sport === sport ? '' : sport})}
                  >
                    <Text style={[
                      styles.chipText,
                      { color: filters.sport === sport ? theme.colors.text.inverted : theme.colors.text.primary }
                    ]}>{sport}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.filterTitle}>Skill Level</Text>
              <View style={styles.chipContainer}>
                {['Beginner', 'Intermediate', 'Pro'].map((level, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={[
                      styles.chip,
                      { backgroundColor: filters.skillLevel === level ? theme.colors.accent.neonGreen : theme.colors.background.secondary }
                    ]}
                    onPress={() => setFilters({...filters, skillLevel: filters.skillLevel === level ? '' : level})}
                  >
                    <Text style={[
                      styles.chipText,
                      { color: filters.skillLevel === level ? theme.colors.text.inverted : theme.colors.text.primary }
                    ]}>{level}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.filterTitle}>Availability</Text>
              <View style={styles.chipContainer}>
                {['Available Now', 'Busy'].map((status, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={[
                      styles.chip,
                      { backgroundColor: filters.availability === status ? theme.colors.accent.neonGreen : theme.colors.background.secondary }
                    ]}
                    onPress={() => setFilters({...filters, availability: filters.availability === status ? '' : status})}
                  >
                    <Text style={[
                      styles.chipText,
                      { color: filters.availability === status ? theme.colors.text.inverted : theme.colors.text.primary }
                    ]}>{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TouchableOpacity 
                style={styles.applyButton} 
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Empty State */}
      {mockPlayers.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="person-remove-outline" size={60} color={theme.colors.text.secondary} />
          <Text style={styles.emptyStateTitle}>No players nearby</Text>
          <Text style={styles.emptyStateSubtitle}>Try increasing the radius or invite friends</Text>
          <TouchableOpacity style={styles.emptyStateButton}>
            <Text style={styles.emptyStateButtonText}>Increase Radius</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.emptyStateButton}>
            <Text style={styles.emptyStateButtonText}>Invite Friends</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background.card,
    ...theme.shadows.small,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginHorizontal: theme.spacing.sm,
  },
  radiusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radiusText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.sm,
  },
  radiusButton: {
    backgroundColor: theme.colors.background.secondary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: theme.spacing.xs,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.divider,
  },
  bottomButton: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  bottomButtonText: {
    fontSize: 12,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs,
  },
  playerCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    ...theme.shadows.small,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  playerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  playerSport: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  playerDistance: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  playerStats: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  statText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  playerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 0.3,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  actionButtonText: {
    color: theme.colors.text.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  availabilityBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.small,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.background.card,
    padding: theme.spacing.lg,
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
  },
  filtersContainer: {
    backgroundColor: theme.colors.background.card,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  playerProfile: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
  },
  inviteButton: {
    backgroundColor: theme.colors.accent.neonGreen,
  },
  chatButton: {
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  profileButton: {
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.md,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: theme.spacing.md,
  },
  chip: {
    borderRadius: theme.borderRadius.large,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: theme.colors.accent.neonGreen,
    paddingVertical: theme.spacing.md,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
  },
  applyButtonText: {
    color: theme.colors.text.inverted,
    fontWeight: '600',
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  emptyStateButton: {
    backgroundColor: theme.colors.accent.neonGreen,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    marginVertical: theme.spacing.sm,
  },
  emptyStateButtonText: {
    color: theme.colors.text.inverted,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default NearbyPlayersMap;