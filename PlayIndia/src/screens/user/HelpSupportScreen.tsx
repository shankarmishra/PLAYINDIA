import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HelpSupportScreen = () => {
  const navigation = useNavigation();
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabs}>
        {['FAQs', 'Contact', 'Report'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'FAQs' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Common Questions</Text>
            {faqs.map((faq) => (
              <TouchableOpacity key={faq.id} style={styles.faqCard}>
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Ionicons name="chevron-down" size={20} color="#94A3B8" />
                </View>
                {/* Simplified for now, could add expanded state */}
                <Text style={styles.faqAnswer} numberOfLines={2}>{faq.answer}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'Contact' && (
          <View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Support Categories</Text>
              <View style={styles.categoryGrid}>
                {supportCategories.map((cat) => (
                  <TouchableOpacity key={cat.id} style={styles.categoryCard}>
                    <View style={[styles.iconBox, { backgroundColor: cat.color + '15' }]}>
                      <Ionicons name={cat.icon as any} size={24} color={cat.color} />
                    </View>
                    <Text style={styles.categoryTitle}>{cat.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Get in Touch</Text>
              <View style={styles.contactList}>
                <TouchableOpacity style={styles.contactItem}>
                  <View style={styles.contactIcon}>
                    <Ionicons name="call" size={22} color="#0F172A" />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Phone Support</Text>
                    <Text style={styles.contactValue}>+91 1800-PLAY-IND</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactItem}>
                  <View style={styles.contactIcon}>
                    <Ionicons name="chatbubble-ellipses" size={22} color="#0F172A" />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Live Chat</Text>
                    <Text style={styles.contactValue}>Average wait: 2 mins</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'Report' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Report an Issue</Text>
            <View style={styles.reportForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Subject</Text>
                <TextInput
                  style={styles.input}
                  placeholder="What happened?"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Details</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe your issue in detail..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={6}
                />
              </View>
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  activeTab: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
    marginLeft: 4,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    fontWeight: '500',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  contactList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  reportForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: '#0F172A',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default HelpSupportScreen;