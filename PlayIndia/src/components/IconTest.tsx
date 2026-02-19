import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const IconTest = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Icon Test</Text>
      <View style={styles.iconRow}>
        <Ionicons name="home" size={30} color="#4CAF50" />
        <Text style={styles.iconLabel}>Home</Text>
      </View>
      <View style={styles.iconRow}>
        <Ionicons name="person" size={30} color="#2196F3" />
        <Text style={styles.iconLabel}>Person</Text>
      </View>
      <View style={styles.iconRow}>
        <Ionicons name="settings" size={30} color="#FF9800" />
        <Text style={styles.iconLabel}>Settings</Text>
      </View>
      <View style={styles.iconRow}>
        <Ionicons name="heart" size={30} color="#F44336" />
        <Text style={styles.iconLabel}>Heart</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
  },
  iconLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default IconTest;