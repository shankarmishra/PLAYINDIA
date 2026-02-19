import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DeliveryProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Profile</Text>
      <Text style={styles.subtitle}>Profile management coming soon</Text>
    </View>
  );
};

export default DeliveryProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});