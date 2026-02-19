import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CreateTournamentScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Tournament</Text>
      <Text style={styles.subtitle}>Tournament creation coming soon</Text>
    </View>
  );
};

export default CreateTournamentScreen;

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
