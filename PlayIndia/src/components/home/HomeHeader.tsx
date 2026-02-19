import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface HomeHeaderProps {
  location: string;
  locationLoading: boolean;
  onLocationPress: () => void;
  onNotificationPress: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  location,
  locationLoading,
  onLocationPress,
  onNotificationPress,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity 
          style={styles.locationContainer} 
          activeOpacity={0.7}
          onPress={onLocationPress}
        >
          <Ionicons name="location" size={18} color={locationLoading ? '#9CA3AF' : '#1B5E20'} />
          {locationLoading ? (
            <ActivityIndicator size="small" color="#9CA3AF" style={{ marginHorizontal: 4 }} />
          ) : (
            <Text style={styles.locationText}>{location}</Text>
          )}
          <Ionicons name="chevron-down" size={14} color="#64748B" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.headerRight}>
        <TouchableOpacity 
          style={styles.notificationContainer}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={22} color="#1F2937" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    height: 60,
    backgroundColor: '#E8F5E9',
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C8E6C9',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  locationText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B5E20',
    marginHorizontal: 6,
  },
  notificationContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
});

export default HomeHeader;
