import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { theme } from '../../theme/colors';

const MOCK_TRANSACTIONS = [
  { id: '1', type: 'credit', amount: 500, description: 'Added money to wallet', date: 'Dec 15', time: '10:30 AM' },
  { id: '2', type: 'debit', amount: 2499, description: 'Cricket bat purchase', date: 'Dec 14', time: '3:45 PM' },
  { id: '3', type: 'credit', amount: 100, description: 'Cashback reward', date: 'Dec 12', time: '11:20 AM' },
  { id: '4', type: 'debit', amount: 799, description: 'Coach booking', date: 'Dec 10', time: '2:15 PM' },
  { id: '5', type: 'credit', amount: 50, description: 'Referral bonus', date: 'Dec 08', time: '9:30 AM' },
];

const WalletScreen = ({ navigation }: any) => {
  const user = { id: '1234567890', walletBalance: 2450.50 };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PlayWallet</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Ionicons name="information-circle-outline" size={24} color="#1B5E20" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.balanceCardWrapper}>
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceTitle}>Available Balance</Text>
              <Ionicons name="wallet" size={24} color="rgba(255,255,255,0.8)" />
            </View>
            <Text style={styles.balanceAmount}>₹{user.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            <View style={styles.balanceFooter}>
              <Text style={styles.walletId}>Wallet ID: PW-*******{user.id.slice(-4)}</Text>
            </View>
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.actionText}>Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#C8E6C9' }]}>
                <Ionicons name="send" size={22} color="#1B5E20" />
              </View>
              <Text style={styles.actionText}>Transfer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#C8E6C9' }]}>
                <Ionicons name="receipt-outline" size={22} color="#1B5E20" />
              </View>
              <Text style={styles.actionText}>Statements</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.transactionsHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
        </View>

        <View style={styles.transactionsList}>
          {MOCK_TRANSACTIONS.map((item, index) => (
            <View key={item.id} style={[styles.transactionItem, index === MOCK_TRANSACTIONS.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.transactionLeft}>
                <View style={[styles.transactionIconContainer, { backgroundColor: item.type === 'credit' ? '#F0FDF4' : '#FEF2F2' }]}>
                  <Ionicons
                    name={item.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                    size={18}
                    color={item.type === 'credit' ? '#16A34A' : '#EF4444'}
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDesc}>{item.description}</Text>
                  <Text style={styles.transactionDate}>{item.date} • {item.time}</Text>
                </View>
              </View>
              <Text style={[styles.transactionAmount, { color: item.type === 'credit' ? '#16A34A' : '#EF4444' }]}>
                {item.type === 'credit' ? '+' : '-'} ₹{item.amount}
              </Text>
            </View>
          ))}
        </View>
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
    backgroundColor: '#E8F5E9',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#C8E6C9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  infoButton: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  balanceCardWrapper: {
    padding: 16,
  },
  balanceCard: {
    backgroundColor: '#1B5E20',
    borderRadius: 24,
    padding: 24,
    height: 180,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '700',
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
  },
  balanceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletId: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingHorizontal: 8,
  },
  actionButton: {
    alignItems: 'center',
    width: '30%',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1B5E20',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1B5E20',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
  },
  transactionsList: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 24,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0FDF4',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    justifyContent: 'center',
  },
  transactionDesc: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
});

export default WalletScreen;