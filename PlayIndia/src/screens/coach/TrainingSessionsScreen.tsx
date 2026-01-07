import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

const TrainingSessionsScreen = () => {
  const trainingSessions = [
    {
      id: '1',
      title: 'Speed & Agility Training',
      date: '2024-01-15',
      time: '10:00 AM',
      duration: '2 hours',
      participants: 15,
    },
    {
      id: '2',
      title: 'Ball Control Practice',
      date: '2024-01-17',
      time: '4:00 PM',
      duration: '1.5 hours',
      participants: 12,
    },
    {
      id: '3',
      title: 'Team Strategy Session',
      date: '2024-01-20',
      time: '6:00 PM',
      duration: '3 hours',
      participants: 20,
    },
  ];

  const renderSession = ({ item }: { item: any }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <Text style={styles.sessionTitle}>{item.title}</Text>
        <Text style={styles.sessionDate}>{item.date}</Text>
      </View>
      <View style={styles.sessionDetails}>
        <Text style={styles.sessionTime}>Time: {item.time}</Text>
        <Text style={styles.sessionDuration}>Duration: {item.duration}</Text>
        <Text style={styles.sessionParticipants}>
          Participants: {item.participants}
        </Text>
      </View>
      <View style={styles.sessionActions}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Training Sessions</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Schedule Session</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={trainingSessions}
        renderItem={renderSession}
        keyExtractor={item => item.id}
        style={styles.sessionsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2A2E5B',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sessionsList: {
    flex: 1,
  },
  sessionCard: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  sessionDate: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sessionDetails: {
    marginBottom: 15,
  },
  sessionTime: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  sessionDuration: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  sessionParticipants: {
    fontSize: 14,
    color: '#555',
  },
  sessionActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TrainingSessionsScreen;
