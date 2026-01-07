import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '../../utils/AsyncStorageSafe';
import { API_ENDPOINTS } from '../../config/constants';

const CoachProfileScreen = () => {
  const [coach, setCoach] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');

        const response = await fetch(API_ENDPOINTS.COACHES.PROFILE, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setCoach(data);
      } catch (error) {
        console.error('Failed to fetch coach profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#f39c12" style={styles.loader} />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Coach Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{coach?.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{coach?.email}</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{coach?.phone}</Text>

        <Text style={styles.label}>Specialization:</Text>
        <Text style={styles.value}>{coach?.specialization}</Text>

        <Text style={styles.label}>Experience:</Text>
        <Text style={styles.value}>{coach?.experience} years</Text>
      </View>
    </ScrollView>
  );
};

export default CoachProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f39c12',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#2c3e50',
    padding: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    color: '#bdc3c7',
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    color: '#ecf0f1',
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
  },
});
