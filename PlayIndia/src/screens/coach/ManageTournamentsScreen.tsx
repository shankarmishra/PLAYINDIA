// Example for ManageTournamentsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ManageTournamentsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Manage Tournaments Screen</Text>
    </View>
  );
};

export default ManageTournamentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
});
