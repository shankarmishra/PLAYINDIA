import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAuth from '../../hooks/useAuth';

const UserSettingsScreen = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();

  const handleLogoutPress = () => {
    Alert.alert('Logout', 'Are you sure you want to exit?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            );
          } catch (error) {
            console.error('Logout error:', error);
          }
        }
      }
    ]);
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { id: '1', title: 'Edit Profile', icon: 'person-outline', screen: 'EditProfile' },
        { id: '2', title: 'Security', icon: 'shield-checkmark-outline', screen: 'Security' },
        { id: '3', title: 'Privacy Settings', icon: 'lock-closed-outline', screen: 'PrivacyPolicy' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { id: '4', title: 'Language', icon: 'globe-outline', value: 'English' },
        { id: '5', title: 'Theme', icon: 'color-palette-outline', value: 'Light' },
        { id: '6', title: 'Notifications', icon: 'notifications-outline', screen: 'Notifications' },
      ],
    },
    {
      title: 'Support',
      items: [
        { id: '7', title: 'Help Center', icon: 'help-circle-outline', screen: 'HelpSupport' },
        { id: '8', title: 'Contact Us', icon: 'chatbubble-outline', screen: 'HelpSupport' },
      ],
    },
    {
      title: 'Other',
      items: [
        { id: '9', title: 'About Us', icon: 'business-outline', screen: 'About' },
        { id: '10', title: 'Terms of Service', icon: 'document-text-outline', screen: 'Terms' },
        { id: '11', title: 'Privacy Policy', icon: 'document-lock-outline', screen: 'PrivacyPolicy' },
        { id: '12', title: 'Log Out', icon: 'log-out-outline', action: 'logout' },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {settingsSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.optionItem,
                    itemIndex === section.items.length - 1 && { borderBottomWidth: 0 }
                  ]}
                  onPress={() => {
                    if (item.action === 'logout') {
                      handleLogoutPress();
                    } else if (item.screen) {
                      navigation.navigate(item.screen as any);
                    }
                  }}
                >
                  <View style={styles.optionLeft}>
                    <View style={styles.iconContainer}>
                      <Ionicons name={item.icon as any} size={20} color="#2E7D32" />
                    </View>
                    <Text style={styles.optionText}>{item.title}</Text>
                  </View>
                  <View style={styles.optionRight}>
                    {item.value && <Text style={styles.optionValue}>{item.value}</Text>}
                    <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.dangerButton} onPress={handleLogoutPress}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.dangerButtonText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>PLAYINDIA Premium v2.4.1</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#C8E6C9',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1B5E20',
    marginBottom: 12,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0FDF4',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#F0FDF4',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionValue: {
    fontSize: 14,
    color: '#64748B',
    marginRight: 8,
    fontWeight: '600',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    marginTop: 32,
    height: 60,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FEE2E2',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#EF4444',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default UserSettingsScreen;