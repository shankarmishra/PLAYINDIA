import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { theme } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HelpSupportScreen = () => {
  const [activeTab, setActiveTab] = useState('FAQs');

  const faqs = [
    {
      id: '1',
      question: 'How do I find players near me?',
      answer: 'Go to the "Find Players" section and allow location access. You can set your search radius and filter by sport or skill level.'
    },
    {
      id: '2',
      question: 'How do I book a coach?',
      answer: 'Navigate to the "Find Coach" section, select your preferred sport, and choose a coach from the list. You can then book a session based on their availability.'
    },
    {
      id: '3',
      question: 'How do I track my order?',
      answer: 'Go to "My Orders" in your profile and select the order you want to track. You\'ll see real-time updates on its status.'
    },
    {
      id: '4',
      question: 'What if I need to cancel a booking?',
      answer: 'You can cancel bookings from the "My Bookings" section. Cancellation policies vary based on the coach or service provider.'
    },
    {
      id: '5',
      question: 'How do I update my profile information?',
      answer: 'Go to your profile and tap the edit button. You can update your personal information, sports preferences, and other details.'
    },
  ];

  const supportCategories = [
    { id: '1', title: 'Account Issues', icon: 'person-circle-outline', color: theme.colors.accent.neonGreen },
    { id: '2', title: 'Payment Problems', icon: 'card-outline', color: theme.colors.accent.orange },
    { id: '3', title: 'Booking Issues', icon: 'calendar-outline', color: theme.colors.status.warning },
    { id: '4', title: 'Technical Support', icon: 'construct-outline', color: theme.colors.status.info },
    { id: '5', title: 'Safety Concerns', icon: 'shield-checkmark-outline', color: theme.colors.status.error },
    { id: '6', title: 'Other Queries', icon: 'help-circle-outline', color: theme.colors.text.secondary },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['FAQs', 'Contact', 'Report'].map((tab) => (
          <TouchableOpacity 
            key={tab}
            style={[
              styles.tab,
              { 
                borderBottomWidth: activeTab === tab ? 2 : 0,
                borderBottomColor: theme.colors.accent.neonGreen,
              }
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.tabText,
              { 
                color: activeTab === tab 
                  ? theme.colors.accent.neonGreen 
                  : theme.colors.text.secondary 
              }
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'FAQs' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            {faqs.map((faq) => (
              <View key={faq.id} style={styles.faqItem}>
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Ionicons name="chevron-down" size={20} color={theme.colors.text.primary} />
                </View>
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'Contact' && (
          <View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Us</Text>
              <Text style={styles.sectionSubtitle}>Choose how you want to get in touch</Text>
              
              <View style={styles.contactOptions}>
                {supportCategories.map((category) => (
                  <TouchableOpacity key={category.id} style={styles.contactOption}>
                    <View style={[styles.contactIcon, { backgroundColor: `${category.color}20` }]}>
                      <Ionicons name={category.icon as any} size={24} color={category.color} />
                    </View>
                    <Text style={styles.contactTitle}>{category.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Support</Text>
              <View style={styles.quickSupport}>
                <TouchableOpacity style={styles.supportItem}>
                  <Ionicons name="call-outline" size={24} color={theme.colors.accent.neonGreen} />
                  <Text style={styles.supportText}>Call Support</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.supportItem}>
                  <Ionicons name="chatbubbles-outline" size={24} color={theme.colors.accent.neonGreen} />
                  <Text style={styles.supportText}>Live Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.supportItem}>
                  <Ionicons name="mail-outline" size={24} color={theme.colors.accent.neonGreen} />
                  <Text style={styles.supportText}>Email Us</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'Report' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Report an Issue</Text>
            <Text style={styles.sectionSubtitle}>Help us improve your experience</Text>
            
            <View style={styles.reportForm}>
              <TextInput
                style={styles.input}
                placeholder="Subject"
                placeholderTextColor={theme.colors.text.disabled}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your issue..."
                placeholderTextColor={theme.colors.text.disabled}
                multiline
                numberOfLines={5}
              />
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.card,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    ...theme.shadows.small,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
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
  sectionSubtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },
  faqItem: {
    marginBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
    paddingBottom: theme.spacing.md,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    flex: 1,
  },
  faqAnswer: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  contactOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  contactOption: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.medium,
    ...theme.shadows.small,
  },
  contactIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  quickSupport: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  supportItem: {
    alignItems: 'center',
  },
  supportText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
    fontWeight: '600',
  },
  reportForm: {
    marginTop: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: theme.colors.accent.neonGreen,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  submitButtonText: {
    color: theme.colors.text.inverted,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HelpSupportScreen;