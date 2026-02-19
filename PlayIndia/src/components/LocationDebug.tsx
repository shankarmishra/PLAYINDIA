import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLocation } from '../context/LocationContext';

const LocationDebug = () => {
  const { 
    currentAddress, 
    currentLocation, 
    locationLoading, 
    refreshLocation, 
    isInitialized,
    permissionGranted 
  } = useLocation();

  const handleDebugLocation = async () => {
    try {
      console.log('=== LOCATION DEBUG START ===');
      console.log('isInitialized:', isInitialized);
      console.log('permissionGranted:', permissionGranted);
      console.log('locationLoading:', locationLoading);
      console.log('currentLocation:', currentLocation);
      console.log('currentAddress:', currentAddress);
      
      Alert.alert(
        'Location Debug Info',
        `Initialized: ${isInitialized}\n` +
        `Permission: ${permissionGranted}\n` +
        `Loading: ${locationLoading}\n` +
        `Location: ${currentLocation ? `${currentLocation.latitude}, ${currentLocation.longitude}` : 'null'}\n` +
        `Address: ${currentAddress || 'null'}`
      );
      
      if (!isInitialized) {
        Alert.alert('Error', 'Location service not initialized');
        return;
      }
      
      await refreshLocation();
      
    } catch (error: any) {
      console.error('Location debug error:', error);
      Alert.alert('Error', error.message || 'Unknown error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Debug</Text>
      <TouchableOpacity 
        style={styles.debugButton} 
        onPress={handleDebugLocation}
      >
        <Ionicons name="bug" size={20} color="#FFFFFF" />
        <Text style={styles.debugButtonText}>Debug Location</Text>
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Status: {isInitialized ? '✓ Initialized' : '✗ Not Initialized'}</Text>
        <Text style={styles.infoText}>Permission: {permissionGranted ? '✓ Granted' : '✗ Not Granted'}</Text>
        <Text style={styles.infoText}>Loading: {locationLoading ? '✓ Yes' : '✗ No'}</Text>
        <Text style={styles.infoText}>Location: {currentLocation ? '✓ Available' : '✗ Not Available'}</Text>
        <Text style={styles.infoText} numberOfLines={2}>Address: {currentAddress || 'Not set'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    margin: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1F2937',
    textAlign: 'center',
  },
  debugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  debugButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
});

export default LocationDebug;