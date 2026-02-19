import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const ManagePlayersScreen = () => {
  const navigation = useNavigation();

  const players = [
    { id: '1', name: 'John Doe', position: 'Forward', rating: 4.5, image: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: '2', name: 'Mike Smith', position: 'Midfielder', rating: 4.2, image: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: '3', name: 'David Johnson', position: 'Defender', rating: 4.0, image: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { id: '4', name: 'Chris Williams', position: 'Goalkeeper', rating: 4.3, image: 'https://randomuser.me/api/portraits/men/4.jpg' },
    { id: '5', name: 'Tom Brown', position: 'Forward', rating: 4.1, image: 'https://randomuser.me/api/portraits/men/5.jpg' },
  ];

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Forward': return '#FF6B6B';
      case 'Midfielder': return '#4ECDC4';
      case 'Defender': return '#45B7D1';
      case 'Goalkeeper': return '#96CEB4';
      default: return '#95A5A6';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return '#10B981';
    if (rating >= 4.0) return '#22C55E';
    if (rating >= 3.5) return '#F59E0B';
    return '#EF4444';
  };

  const renderPlayer = ({ item }: { item: any }) => (
    <View style={styles.playerCard}>
      <Image source={{ uri: item.image }} style={styles.playerImage} />
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.name}</Text>
        <View style={[styles.positionBadge, { backgroundColor: getPositionColor(item.position) + '20' }]}>
          <Text style={[styles.positionText, { color: getPositionColor(item.position) }]}>
            {item.position}
          </Text>
        </View>
      </View>
      <View style={styles.playerRight}>
        <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(item.rating) + '20' }]}>
          <Ionicons name="star" size={12} color={getRatingColor(item.rating)} />
          <Text style={[styles.ratingText, { color: getRatingColor(item.rating) }]}>
            {item.rating}
          </Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Players</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888888" />
        <Text style={styles.searchPlaceholder}>Search players...</Text>
      </View>

      <FlatList
        data={players}
        renderItem={renderPlayer}
        keyExtractor={item => item.id}
        style={styles.playersList}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#1A1A2E',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1ED760',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: '#888888',
  },
  playersList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 10,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  playerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  positionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  positionText: {
    fontSize: 11,
    fontWeight: '600',
  },
  playerRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A1A2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ManagePlayersScreen;
