import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { theme } from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Mock data for transactions
const mockTransactions = [
  {
    id: '1',
    type: 'credit',
    amount: 500,
    description: 'Added money to wallet',
    date: '2023-12-15',
    time: '10:30 AM',
  },
  {
    id: '2',
    type: 'debit',
    amount: 2499,
    description: 'Cricket bat purchase',
    date: '2023-12-14',
    time: '3:45 PM',
  },
  {
    id: '3',
    type: 'credit',
    amount: 100,
    description: 'Cashback reward',
    date: '2023-12-12',
    time: '11:20 AM',
  },
  {
    id: '4',
    type: 'debit',
    amount: 799,
    description: 'Coach booking',
    date: '2023-12-10',
    time: '2:15 PM',
  },
  {
    id: '5',
    type: 'credit',
    amount: 50,
    description: 'Referral bonus',
    date: '2023-12-08',
    time: '9:30 AM',
  },
];

const WalletScreen = () => {
  const [activeTab, setActiveTab] = useState('Wallet');

  const balance = 2450.50;
  const cashback = 150.00;
  const rewards = 250;

  const renderTransaction = ({ item }: any) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIconContainer}>
        <View style={[
          styles.transactionIcon,
          { 
            backgroundColor: item.type === 'credit' 
              ? `${theme.colors.status.success}20` 
              : `${theme.colors.status.error}20` 
          }
        ]}>
          <Ionicons 
            name={item.type === 'credit' ? 'add-circle' : 'remove-circle'} 
            size={24} 
            color={item.type === 'credit' ? theme.colors.status.success : theme.colors.status.error} 
          />
        </View>
      </View>
      <View style={styles.transactionContent}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionDate}>{item.date} • {item.time}</Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        { 
          color: item.type === 'credit' 
            ? theme.colors.status.success 
            : theme.colors.status.error 
        }
      ]}>
        {item.type === 'credit' ? '+' : '-'}₹{item.amount}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <TouchableOpacity>
          <Ionicons name="information-circle-outline" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Wallet Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceTitle}>Wallet Balance</Text>
            <TouchableOpacity>
              <Ionicons name="help-circle-outline" size={20} color={theme.colors.text.inverted} />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>₹{balance.toFixed(2)}</Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="add" size={20} color={theme.colors.accent.neonGreen} />
              <Text style={styles.actionText}>Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="card" size={20} color={theme.colors.accent.neonGreen} />
              <Text style={styles.actionText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="gift-outline" size={24} color={theme.colors.status.success} />
            <Text style={styles.statValue}>₹{cashback.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Cashback</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy-outline" size={24} color={theme.colors.accent.orange} />
            <Text style={styles.statValue}>{rewards}</Text>
            <Text style={styles.statLabel}>Rewards</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="card-outline" size={24} color={theme.colors.accent.neonGreen} />
            <Text style={styles.statValue}>₹0.00</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {['Wallet', 'Transactions', 'Rewards'].map((tab) => (
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

        {/* Content based on active tab */}
        {activeTab === 'Wallet' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <TouchableOpacity style={styles.paymentMethod}>
              <Ionicons name="card-outline" size={24} color={theme.colors.text.primary} />
              <Text style={styles.paymentText}>Credit/Debit Card</Text>
              <Text style={styles.paymentDetail}>•••• 4567</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.text.disabled} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.paymentMethod}>
              <Ionicons name="logo-google" size={24} color={theme.colors.text.primary} />
              <Text style={styles.paymentText}>Google Pay</Text>
              <Text style={styles.paymentDetail}>rahul@example.com</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.text.disabled} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.paymentMethod}>
              <Ionicons name="logo-paypal" size={24} color={theme.colors.text.primary} />
              <Text style={styles.paymentText}>PayPal</Text>
              <Text style={styles.paymentDetail}>rahul@example.com</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.text.disabled} />
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'Transactions' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <FlatList
              data={mockTransactions}
              renderItem={renderTransaction}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
        )}

        {activeTab === 'Rewards' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Rewards</Text>
            <View style={styles.rewardItem}>
              <View style={styles.rewardIcon}>
                <Ionicons name="gift" size={24} color={theme.colors.text.inverted} />
              </View>
              <View style={styles.rewardContent}>
                <Text style={styles.rewardTitle}>Welcome Bonus</Text>
                <Text style={styles.rewardDescription}>Get ₹100 cashback on first purchase</Text>
                <Text style={styles.rewardExpiry}>Expires: Dec 31, 2023</Text>
              </View>
              <TouchableOpacity style={styles.claimButton}>
                <Text style={styles.claimButtonText}>Claim</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rewardItem}>
              <View style={styles.rewardIcon}>
                <Ionicons name="gift" size={24} color={theme.colors.text.inverted} />
              </View>
              <View style={styles.rewardContent}>
                <Text style={styles.rewardTitle}>Referral Reward</Text>
                <Text style={styles.rewardDescription}>₹50 for each friend you refer</Text>
                <Text style={styles.rewardExpiry}>Expires: Jan 31, 2024</Text>
              </View>
              <TouchableOpacity style={styles.claimButton}>
                <Text style={styles.claimButtonText}>Claim</Text>
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
  balanceCard: {
    backgroundColor: theme.colors.accent.neonGreen,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  balanceTitle: {
    fontSize: 16,
    color: theme.colors.text.inverted,
    fontWeight: '600',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.text.inverted,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
  },
  actionText: {
    color: theme.colors.accent.neonGreen,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  statCard: {
    backgroundColor: theme.colors.background.card,
    flex: 0.3,
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    ...theme.shadows.small,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginVertical: theme.spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
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
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  paymentText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  paymentDetail: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.md,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  transactionIconContainer: {
    marginRight: theme.spacing.md,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionContent: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  rewardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.accent.neonGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  rewardContent: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  rewardDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  rewardExpiry: {
    fontSize: 12,
    color: theme.colors.text.disabled,
    marginTop: theme.spacing.xs,
  },
  claimButton: {
    backgroundColor: theme.colors.accent.neonGreen,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
  },
  claimButtonText: {
    color: theme.colors.text.inverted,
    fontWeight: '600',
  },
});

export default WalletScreen;