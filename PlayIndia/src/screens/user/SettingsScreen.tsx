import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { theme } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAuth from '../../hooks/useAuth';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState({
    matchInvites: true,
    bookingUpdates: true,
    promotional: false,
    locationUpdates: true,
  });

  const [privacy, setPrivacy] = useState({
    showLocation: true,
    showProfile: true,
    allowContact: true,
    hideProfile: false,
  });

  const [account, setAccount] = useState({
    twoFactorAuth: false,
    autoLogin: true,
  });

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { id: '1', title: 'Edit Profile', icon: 'person-outline', screen: 'EditProfile' },
        { id: '2', title: 'Privacy Settings', icon: 'lock-closed-outline', screen: 'PrivacySettings' },
        { id: '3', title: 'Security', icon: 'shield-checkmark-outline', screen: 'Security' },
        { id: '4', title: 'Change Password', icon: 'key-outline', screen: 'ChangePassword' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { id: '5', title: 'Language', icon: 'globe-outline', value: 'English' },
        { id: '6', title: 'Currency', icon: 'cash-outline', value: 'INR' },
        { id: '7', title: 'Distance Unit', icon: 'location-outline', value: 'Kilometers' },
        { id: '8', title: 'Theme', icon: 'color-palette-outline', value: 'Light' },
      ],
    },
    {
      title: 'Support',
      items: [
        { id: '9', title: 'Help Center', icon: 'help-circle-outline', screen: 'HelpCenter' },
        { id: '10', title: 'FAQs', icon: 'information-circle-outline', screen: 'FAQs' },
        { id: '11', title: 'Contact Us', icon: 'chatbubble-outline', screen: 'Contact' },
        { id: '12', title: 'Report an Issue', icon: 'alert-circle-outline', screen: 'Report' },
      ],
    },
    {
      title: 'Other',
      items: [
        { id: '13', title: 'About Us', icon: 'business-outline', screen: 'About' },
        { id: '14', title: 'Terms of Service', icon: 'document-text-outline', screen: 'Terms' },
        { id: '15', title: 'Privacy Policy', icon: 'document-lock-outline', screen: 'PrivacyPolicy' },
        { id: '16', title: 'Log Out', icon: 'log-out-outline', screen: 'Logout' },
      ],
    },
  ];

  const toggleNotification = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const togglePrivacy = (key: string) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.text.secondary} />
              <Text style={styles.settingLabel}>Match Invites</Text>
            </View>
            <Switch
              value={notifications.matchInvites}
              onValueChange={() => toggleNotification('matchInvites')}
              trackColor={{ false: theme.colors.ui.border, true: theme.colors.accent.neonGreen }}
              thumbColor={theme.colors.background.card}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.text.secondary} />
              <Text style={styles.settingLabel}>Booking Updates</Text>
            </View>
            <Switch
              value={notifications.bookingUpdates}
              onValueChange={() => toggleNotification('bookingUpdates')}
              trackColor={{ false: theme.colors.ui.border, true: theme.colors.accent.neonGreen }}
              thumbColor={theme.colors.background.card}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons name="megaphone-outline" size={20} color={theme.colors.text.secondary} />
              <Text style={styles.settingLabel}>Promotional</Text>
            </View>
            <Switch
              value={notifications.promotional}
              onValueChange={() => toggleNotification('promotional')}
              trackColor={{ false: theme.colors.ui.border, true: theme.colors.accent.neonGreen }}
              thumbColor={theme.colors.background.card}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons name="location-outline" size={20} color={theme.colors.text.secondary} />
              <Text style={styles.settingLabel}>Location Updates</Text>
            </View>
            <Switch
              value={notifications.locationUpdates}
              onValueChange={() => toggleNotification('locationUpdates')}
              trackColor={{ false: theme.colors.ui.border, true: theme.colors.accent.neonGreen }}
              thumbColor={theme.colors.background.card}
            />
          </View>
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons name="location-outline" size={20} color={theme.colors.text.secondary} />
              <Text style={styles.settingLabel}>Show My Location</Text>
            </View>
            <Switch
              value={privacy.showLocation}
              onValueChange={() => togglePrivacy('showLocation')}
              trackColor={{ false: theme.colors.ui.border, true: theme.colors.accent.neonGreen }}
              thumbColor={theme.colors.background.card}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons name="eye-outline" size={20} color={theme.colors.text.secondary} />
              <Text style={styles.settingLabel}>Show Profile to Others</Text>
            </View>
            <Switch
              value={privacy.showProfile}
              onValueChange={() => togglePrivacy('showProfile')}
              trackColor={{ false: theme.colors.ui.border, true: theme.colors.accent.neonGreen }}
              thumbColor={theme.colors.background.card}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons name="call-outline" size={20} color={theme.colors.text.secondary} />
              <Text style={styles.settingLabel}>Allow Contact Requests</Text>
            </View>
            <Switch
              value={privacy.allowContact}
              onValueChange={() => togglePrivacy('allowContact')}
              trackColor={{ false: theme.colors.ui.border, true: theme.colors.accent.neonGreen }}
              thumbColor={theme.colors.background.card}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons name="eye-off-outline" size={20} color={theme.colors.text.secondary} />
              <Text style={styles.settingLabel}>Hide My Profile</Text>
            </View>
            <Switch
              value={privacy.hideProfile}
              onValueChange={() => togglePrivacy('hideProfile')}
              trackColor={{ false: theme.colors.ui.border, true: theme.colors.accent.neonGreen }}
              thumbColor={theme.colors.background.card}
            />
          </View>
        </View>

        {/* General Settings */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item) => (
              <TouchableOpacity key={item.id} style={styles.optionItem}>
                <View style={styles.optionContent}>
                  <Ionicons name={item.icon as any} size={20} color={theme.colors.text.secondary} />
                  <Text style={styles.optionText}>{item.title}</Text>
                </View>
                {item.value ? (
                  <View style={styles.optionValueContainer}>
                    <Text style={styles.optionValue}>{item.value}</Text>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.text.disabled} />
                  </View>
                ) : (
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.text.disabled} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Log Out Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => {
            Alert.alert(
              'Logout',
              'Are you sure you want to logout?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Logout',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await logout();
                      // Navigate to login screen
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{ name: 'LoginWelcome' }],
                        }),
                      );
                    } catch (error) {
                      Alert.alert('Error', 'Failed to logout. Please try again.');
                    }
                  },
                },
              ],
            );
          }}
        >
          <Ionicons name="log-out-outline" size={20} color={theme.colors.status.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    ...theme.shadows.small,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  section: {
    backgroundColor: theme.colors.background.card,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  optionValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionValue: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.card,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.large,
    ...theme.shadows.small,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.status.error,
    marginLeft: theme.spacing.sm,
  },
});

export default SettingsScreen;