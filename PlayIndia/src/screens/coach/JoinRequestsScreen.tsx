import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const JoinRequestsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Join Requests Screen</Text>
    </View>
  );
};

export default JoinRequestsScreen;

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
