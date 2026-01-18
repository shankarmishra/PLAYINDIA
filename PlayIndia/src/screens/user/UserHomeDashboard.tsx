import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TextInput,
  Image,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Sub-components
import QuickActionCard from '../../components/QuickActionCard';
import StatCard from '../../components/StatCard';
import ActivityItem from '../../components/ActivityItem';
import useAuth from '../../hooks/useAuth';
import ApiService from '../../services/ApiService';
import { UserTabParamList } from '../../navigation/UserNav';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<UserTabParamList>;

interface DashboardStats {
  matchesPlayed: number;
  winRate: number;
  caloriesBurned: number;
  streak: number;
}

interface RecentActivity {
  id: string;
  type: 'match' | 'session' | 'tournament' | 'achievement';
  title: string;
  subtitle: string;
  time: string;
  statusColor: string;
  icon: string;
}

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link?: string;
}

interface Tournament {
  _id: string;
  name: string;
  category: string;
  dates?: {
    tournamentStart: string;
    tournamentEnd: string;
  };
  entryFee?: number;
  maxTeams?: number;
  registeredTeams?: number;
  location?: {
    city?: string;
    address?: string;
  };
  banner?: string;
}

const UserHomeDashboard = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, refreshUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    matchesPlayed: 0,
    winRate: 0,
    caloriesBurned: 0,
    streak: 0,
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [location, setLocation] = useState<string>('Loading...');
  
  // Dummy banner data (fallback)
  const dummyBanners: Banner[] = [
    {
      id: '1',
      title: 'Summer Sports Festival 2024',
      subtitle: 'Join the biggest sports event of the year!',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: '2',
      title: '50% Off on Tournament Registration',
      subtitle: 'Limited time offer - Register now!',
      image: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: '3',
      title: 'New Sports Equipment Collection',
      subtitle: 'Shop the latest gear with exclusive discounts',
      image: 'https://images.unsplash.com/photo-1519819239661-77e2010e75c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    },
  ];
  
  const [banners, setBanners] = useState<Banner[]>(dummyBanners);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerScrollRef = useRef<FlatList>(null);

  useEffect(() => {
    loadDashboardData();
    loadUserLocation();
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const response = await ApiService.banners.getAll({ status: 'active' });
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        const formattedBanners = response.data.data.map((banner: any) => ({
          id: banner._id || banner.id,
          title: banner.title || '',
          subtitle: banner.subtitle || '',
          image: banner.image || '',
          link: banner.link || undefined,
        }));
        setBanners(formattedBanners);
      } else {
        // Use dummy banners if API returns empty
        setBanners(dummyBanners);
      }
    } catch (error: any) {
      // Silently use dummy banners on network error
      if (error.message && !error.message.includes('Network')) {
        console.log('Banners API error:', error.message);
      }
      setBanners(dummyBanners);
    }
  };

  useEffect(() => {
    // Auto-scroll banners only if we have banners
    if (banners.length > 1) {
      const bannerInterval = setInterval(() => {
        setCurrentBannerIndex((prev) => {
          const next = (prev + 1) % banners.length;
          if (bannerScrollRef.current) {
            try {
              bannerScrollRef.current.scrollToIndex({ index: next, animated: true });
            } catch (error) {
              // Ignore scroll errors
            }
          }
          return next;
        });
      }, 5000);

      return () => clearInterval(bannerInterval);
    }
  }, [banners.length]);

  const loadUserLocation = async () => {
    try {
      if (user?.location?.city) {
        setLocation(user.location.city);
      } else if (user?.preferences?.city) {
        setLocation(user.preferences.city);
      } else {
        setLocation('New Delhi');
      }
    } catch (error) {
      console.error('Error loading location:', error);
      setLocation('New Delhi');
    }
  };

  const loadTournaments = async () => {
    try {
      const response = await ApiService.tournaments.getAll({ status: 'upcoming', limit: 6 });
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        setTournaments(response.data.data);
      } else {
        // Use dummy data if API returns empty
        setTournaments([
          {
            _id: '1',
            name: 'Summer Cricket League',
            category: 'Cricket',
            dates: { tournamentStart: '2024-06-15', tournamentEnd: '2024-06-20' },
            entryFee: 500,
            maxTeams: 16,
            registeredTeams: 8,
            location: { city: 'Delhi', address: 'Delhi Cricket Stadium' },
          },
          {
            _id: '2',
            name: 'National Badminton Championship',
            category: 'Badminton',
            dates: { tournamentStart: '2024-07-20', tournamentEnd: '2024-07-25' },
            entryFee: 1200,
            maxTeams: 32,
            registeredTeams: 29,
            location: { city: 'Mumbai', address: 'National Sports Complex' },
          },
          {
            _id: '3',
            name: 'Premier Football Cup',
            category: 'Football',
            dates: { tournamentStart: '2024-08-10', tournamentEnd: '2024-08-15' },
            entryFee: 800,
            maxTeams: 24,
            registeredTeams: 18,
            location: { city: 'Bangalore', address: 'City Football Ground' },
          },
        ]);
      }
      } catch (error: any) {
        // Silently use dummy data on network error (expected when backend is down)
        if (error.message && !error.message.includes('Network error')) {
          console.log('Tournament API error:', error.message);
        }
        // Use dummy data if API fails
      setTournaments([
        {
          _id: '1',
          name: 'Summer Cricket League',
          category: 'Cricket',
          dates: { tournamentStart: '2024-06-15', tournamentEnd: '2024-06-20' },
          entryFee: 500,
          maxTeams: 16,
          registeredTeams: 8,
          location: { city: 'Delhi', address: 'Delhi Cricket Stadium' },
        },
        {
          _id: '2',
          name: 'National Badminton Championship',
          category: 'Badminton',
          dates: { tournamentStart: '2024-07-20', tournamentEnd: '2024-07-25' },
          entryFee: 1200,
          maxTeams: 32,
          registeredTeams: 29,
          location: { city: 'Mumbai', address: 'National Sports Complex' },
        },
        {
          _id: '3',
          name: 'Premier Football Cup',
          category: 'Football',
          dates: { tournamentStart: '2024-08-10', tournamentEnd: '2024-08-15' },
          entryFee: 800,
          maxTeams: 24,
          registeredTeams: 18,
          location: { city: 'Bangalore', address: 'City Football Ground' },
        },
      ]);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load tournaments (with fallback to dummy data)
      await loadTournaments();
      
      // Fetch user profile to get updated stats
      if (user) {
        try {
          await refreshUser();
        } catch (error) {
          console.error('Error refreshing user:', error);
        }
      }
      
      // Fetch bookings/stats with dummy data fallback
      try {
        const bookingsResponse = await ApiService.bookings.getMyBookings();
        if (bookingsResponse.data.success) {
          const bookings = bookingsResponse.data.bookings || [];
          const completedBookings = bookings.filter((b: any) => b.status === 'completed');
          const totalBookings = bookings.length;
          
          setStats({
            matchesPlayed: completedBookings.length,
            winRate: totalBookings > 0 ? Math.round((completedBookings.length / totalBookings) * 100) : 0,
            caloriesBurned: completedBookings.length * 500, // Estimate
            streak: user?.behavior?.reliabilityScore ? Math.floor(user.behavior.reliabilityScore / 20) : 0,
          });
        }
      } catch (error: any) {
        // Silently use dummy data on network error
        if (error.message && !error.message.includes('Network error')) {
          console.log('Bookings API error:', error.message);
        }
        // Set dummy stats
        setStats({
          matchesPlayed: 12,
          winRate: 75,
          caloriesBurned: 8500,
          streak: 5,
        });
      }
      
      // Fetch recent activities with dummy data fallback
      try {
        const activitiesData: RecentActivity[] = [];
        
        // Get recent bookings
        const bookingsResponse = await ApiService.bookings.getMyBookings();
        if (bookingsResponse.data.success) {
          const bookings = bookingsResponse.data.bookings || [];
          bookings.slice(0, 3).forEach((booking: any) => {
            activitiesData.push({
              id: booking._id || booking.id,
              type: booking.type === 'tournament' ? 'tournament' : 'session',
              title: booking.type === 'tournament' ? 'Tournament Joined' : `${booking.sport || 'Session'} Completed`,
              subtitle: booking.coachName || booking.venueName || 'Activity completed',
              time: booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'Recently',
              statusColor: booking.status === 'completed' ? '#10B981' : '#1ED760',
              icon: booking.type === 'tournament' ? 'trophy' : 'checkmark-circle',
            });
          });
        }
        
        // Get recent achievements
        if (user?.achievements && user.achievements.length > 0) {
          const recentAchievements = user.achievements
            .filter((a: any) => a.unlocked)
            .slice(0, 1)
            .map((achievement: any) => ({
              id: achievement.achievementId?._id || achievement.id,
              type: 'achievement' as const,
              title: achievement.achievementId?.name || 'Achievement Unlocked',
              subtitle: achievement.achievementId?.description || 'You earned a new achievement!',
              time: achievement.earnedAt ? new Date(achievement.earnedAt).toLocaleDateString() : 'Recently',
              statusColor: '#FF6A00',
              icon: 'trophy',
            }));
          activitiesData.push(...recentAchievements);
        }
        
        // Use dummy activities if no real data
        if (activitiesData.length === 0) {
          activitiesData.push(
            {
              id: '1',
              type: 'tournament',
              title: 'Tournament Joined',
              subtitle: 'Summer Cricket League',
              time: '2 days ago',
              statusColor: '#1ED760',
              icon: 'trophy',
            },
            {
              id: '2',
              type: 'session',
              title: 'Session Completed',
              subtitle: 'Badminton with Coach Raj',
              time: '5 days ago',
              statusColor: '#10B981',
              icon: 'checkmark-circle',
            },
            {
              id: '3',
              type: 'achievement',
              title: 'First Win',
              subtitle: 'You won your first match!',
              time: '1 week ago',
              statusColor: '#FF6A00',
              icon: 'trophy',
            }
          );
        }
        
        setActivities(activitiesData.slice(0, 3));
      } catch (error: any) {
        // Silently use dummy data on network error
        if (error.message && !error.message.includes('Network error')) {
          console.log('Activities API error:', error.message);
        }
        // Set dummy activities
        setActivities([
          {
            id: '1',
            type: 'tournament',
            title: 'Tournament Joined',
            subtitle: 'Summer Cricket League',
            time: '2 days ago',
            statusColor: '#1ED760',
            icon: 'trophy',
          },
          {
            id: '2',
            type: 'session',
            title: 'Session Completed',
            subtitle: 'Badminton with Coach Raj',
            time: '5 days ago',
            statusColor: '#10B981',
            icon: 'checkmark-circle',
          },
          {
            id: '3',
            type: 'achievement',
            title: 'First Win',
            subtitle: 'You won your first match!',
            time: '1 week ago',
            statusColor: '#FF6A00',
            icon: 'trophy',
          },
        ]);
      }
    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      // Set dummy data on error
      setStats({
        matchesPlayed: 12,
        winRate: 75,
        caloriesBurned: 8500,
        streak: 5,
      });
      setActivities([
        {
          id: '1',
          type: 'tournament',
          title: 'Tournament Joined',
          subtitle: 'Summer Cricket League',
          time: '2 days ago',
          statusColor: '#1ED760',
          icon: 'trophy',
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
  };

  // Featured coaches data
  const featuredCoaches = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      sport: 'Cricket',
      rating: 4.9,
      experience: '10+ years',
      avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=1ED760&color=fff',
      price: '₹500/hr',
    },
    {
      id: '2',
      name: 'Priya Sharma',
      sport: 'Badminton',
      rating: 4.8,
      experience: '8+ years',
      avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=FF6A00&color=fff',
      price: '₹400/hr',
    },
    {
      id: '3',
      name: 'Amit Patel',
      sport: 'Football',
      rating: 4.7,
      experience: '12+ years',
      avatar: 'https://ui-avatars.com/api/?name=Amit+Patel&background=3B82F6&color=fff',
      price: '₹450/hr',
    },
  ];

  // Popular venues data
  const popularVenues = [
    {
      id: '1',
      name: 'Delhi Sports Complex',
      sport: 'Multi-sport',
      distance: '2.5 km',
      rating: 4.6,
      price: '₹300/hr',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: '2',
      name: 'Cricket Academy Ground',
      sport: 'Cricket',
      distance: '3.8 km',
      rating: 4.8,
      price: '₹500/hr',
      image: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: '3',
      name: 'Badminton Court Elite',
      sport: 'Badminton',
      distance: '1.2 km',
      rating: 4.7,
      price: '₹250/hr',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
  ];

  // Trending sports data
  const trendingSports = [
    { id: '1', name: 'Cricket', icon: 'baseball', players: '2.5K', color: '#FF6B6B' },
    { id: '2', name: 'Badminton', icon: 'tennisball', players: '1.8K', color: '#4ECDC4' },
    { id: '3', name: 'Football', icon: 'football', players: '2.1K', color: '#45B7D1' },
    { id: '4', name: 'Tennis', icon: 'tennisball', players: '950', color: '#96CEB4' },
  ];

  const fitnessStats = [
    { 
      title: 'Matches Played', 
      value: stats.matchesPlayed.toString(), 
      change: stats.matchesPlayed > 0 ? `+${Math.floor(stats.matchesPlayed * 0.1)} this week` : 'Start playing!',
    },
    { 
      title: 'Win Rate', 
      value: `${stats.winRate}%`, 
      change: stats.winRate > 0 ? `+${Math.floor(stats.winRate * 0.05)}%` : 'No matches yet',
    },
    { 
      title: 'Calories Burned', 
      value: stats.caloriesBurned.toLocaleString(), 
      change: stats.caloriesBurned > 0 ? `+${Math.floor(stats.caloriesBurned * 0.1)} today` : 'Start your journey!',
    },
    { 
      title: 'Streak', 
      value: `${stats.streak} days`, 
      change: stats.streak > 0 ? 'Keep it up!' : 'Start your streak!',
    },
  ];

  const handleBannerPress = async (banner: Banner) => {
    // Track banner click
    if (banner.id) {
      try {
        await ApiService.banners.trackClick(banner.id);
      } catch (error) {
        // Silently fail
      }
    }

    // Handle navigation based on link
    if (banner.link) {
      // Handle external links or internal navigation
      // This can be expanded based on linkType
    }
  };

  const renderBanner = ({ item, index }: { item: Banner; index: number }) => (
    <TouchableOpacity
      style={styles.bannerItem}
      activeOpacity={0.9}
      onPress={() => handleBannerPress(item)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.bannerImage}
        resizeMode="cover"
        onError={() => {
          console.log('Banner image failed to load:', item.image);
        }}
      />
      <View style={styles.bannerOverlay} />
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
      </View>
      <View style={styles.bannerPagination}>
        {banners.map((_, i) => (
          <View
            key={i}
            style={[styles.paginationDot, i === index && styles.paginationDotActive]}
          />
        ))}
      </View>
    </TouchableOpacity>
  );

  const renderTournament = ({ item }: { item: Tournament }) => {
    const slotsLeft = (item.maxTeams || 0) - (item.registeredTeams || 0);
    const startDate = item.dates?.tournamentStart
      ? new Date(item.dates.tournamentStart).toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
        })
      : 'TBA';

    return (
      <TouchableOpacity
        style={styles.tournamentCard}
        onPress={() => navigation.navigate('TournamentDetail', { tournamentId: item._id })}
        activeOpacity={0.8}
      >
        <View style={styles.tournamentHeader}>
          <View style={styles.tournamentCategory}>
            <Ionicons name="trophy" size={16} color="#F59E0B" />
            <Text style={styles.tournamentCategoryText}>{item.category}</Text>
          </View>
          <View style={[styles.slotsBadge, slotsLeft <= 5 && styles.slotsBadgeWarning]}>
            <Text style={styles.slotsText}>
              {slotsLeft > 0 ? `${slotsLeft} slots left` : 'Full'}
            </Text>
          </View>
        </View>
        <Text style={styles.tournamentName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.tournamentDetails}>
          <View style={styles.tournamentDetailItem}>
            <Ionicons name="calendar-outline" size={14} color="#64748B" />
            <Text style={styles.tournamentDetailText}>{startDate}</Text>
          </View>
          {item.location?.city && (
            <View style={styles.tournamentDetailItem}>
              <Ionicons name="location-outline" size={14} color="#64748B" />
              <Text style={styles.tournamentDetailText}>{item.location.city}</Text>
            </View>
          )}
        </View>
        <View style={styles.tournamentFooter}>
          <Text style={styles.tournamentFee}>
            {item.entryFee ? `₹${item.entryFee}` : 'Free'}
          </Text>
          <TouchableOpacity style={styles.tournamentButton}>
            <Text style={styles.tournamentButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* Header with location and notification */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.locationContainer} activeOpacity={0.7}>
            <Ionicons name="location" size={18} color="#0891B2" />
            <Text style={styles.locationText}>{location}</Text>
            <Ionicons name="chevron-down" size={14} color="#64748B" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.notificationContainer}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={22} color="#1F2937" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1ED760" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {/* Banner Carousel */}
          {banners.length > 0 && (
            <View style={styles.bannerContainer}>
              <FlatList
                ref={bannerScrollRef}
                data={banners}
                renderItem={renderBanner}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                getItemLayout={(data, index) => ({
                  length: SCREEN_WIDTH,
                  offset: SCREEN_WIDTH * index,
                  index,
                })}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                  setCurrentBannerIndex(index);
                }}
                scrollEnabled={banners.length > 1}
                nestedScrollEnabled={true}
              />
            </View>
          )}

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color="#64748B" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search tournaments, players, coaches..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Welcome Card */}
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeContent}>
              <Text style={styles.welcomeText}>
                {new Date().getHours() < 12
                  ? 'Good Morning'
                  : new Date().getHours() < 18
                  ? 'Good Afternoon'
                  : 'Good Evening'}{' '}
                👋
              </Text>
              <Text style={styles.userName}>{user?.name || 'Player'}</Text>
              <Text style={styles.welcomeSubtitle}>
                {user?.preferences?.favoriteGames && user.preferences.favoriteGames.length > 0
                  ? `Ready to play ${user.preferences.favoriteGames[0]} today?`
                  : 'Ready to play some sports today?'}
              </Text>
            </View>
            <View style={styles.welcomeIconContainer}>
              <Ionicons name="fitness" size={48} color="#1ED760" />
            </View>
          </View>

        {/* Trending Sports */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Sports</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trendingSportsContainer}
        >
          {trendingSports.map((sport) => (
            <TouchableOpacity
              key={sport.id}
              style={[styles.trendingSportCard, { borderLeftColor: sport.color }]}
              activeOpacity={0.7}
            >
              <View style={[styles.trendingSportIcon, { backgroundColor: `${sport.color}20` }]}>
                <Ionicons name={sport.icon as any} size={28} color={sport.color} />
              </View>
              <Text style={styles.trendingSportName}>{sport.name}</Text>
              <Text style={styles.trendingSportPlayers}>{sport.players} players</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

          {/* Tournaments Section */}
          {tournaments.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Tournaments</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Tournaments')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={tournaments.slice(0, 3)}
                renderItem={renderTournament}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tournamentsList}
                nestedScrollEnabled={true}
                scrollEnabled={true}
              />
            </>
          )}

        {/* Fitness Stats */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Fitness Summary</Text>
        </View>
        <View style={styles.statsContainer}>
          {fitnessStats.map((stat, index) => (
              <StatCard key={index} title={stat.title} value={stat.value} change={stat.change} />
          ))}
        </View>

        {/* Featured Coaches */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Coaches</Text>
          <TouchableOpacity onPress={() => {
            const parent = navigation.getParent();
            if (parent) {
              parent.navigate('HomeTab', { screen: 'FindCoach' });
            } else {
              navigation.navigate('FindCoach');
            }
          }}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.coachesContainer}
        >
          {featuredCoaches.map((coach) => (
            <TouchableOpacity
              key={coach.id}
              style={styles.coachCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('CoachProfile', { coachId: coach.id })}
            >
              <Image source={{ uri: coach.avatar }} style={styles.coachAvatar} />
              <Text style={styles.coachName}>{coach.name}</Text>
              <Text style={styles.coachSport}>{coach.sport}</Text>
              <View style={styles.coachRating}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.coachRatingText}>{coach.rating}</Text>
                <Text style={styles.coachExperience}>• {coach.experience}</Text>
              </View>
              <Text style={styles.coachPrice}>{coach.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Popular Venues */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Venues</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.venuesContainer}
        >
          {popularVenues.map((venue) => (
            <TouchableOpacity
              key={venue.id}
              style={styles.venueCard}
              activeOpacity={0.8}
            >
              <Image source={{ uri: venue.image }} style={styles.venueImage} />
              <View style={styles.venueInfo}>
                <Text style={styles.venueName}>{venue.name}</Text>
                <Text style={styles.venueSport}>{venue.sport}</Text>
                <View style={styles.venueMeta}>
                  <Ionicons name="location" size={12} color="#64748B" />
                  <Text style={styles.venueDistance}>{venue.distance}</Text>
                  <Text style={styles.venueDivider}>•</Text>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.venueRating}>{venue.rating}</Text>
                </View>
                <Text style={styles.venuePrice}>{venue.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.activityCard}>
          {activities.length > 0 ? (
            activities.map((activity) => (
              <ActivityItem 
                key={activity.id}
                icon={activity.icon} 
                title={activity.title} 
                subtitle={activity.subtitle} 
                time={activity.time} 
                statusColor={activity.statusColor} 
              />
            ))
          ) : (
            <View style={styles.emptyActivityContainer}>
              <Ionicons name="time-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyActivityText}>No recent activity</Text>
                <Text style={styles.emptyActivitySubtext}>
                  Start playing to see your activities here!
                </Text>
            </View>
          )}
        </View>
        </ScrollView>
      )}

      {/* Floating Action Button */}
      {!loading && (
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => navigation.navigate('FindCoach')}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  locationText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginHorizontal: 6,
  },
  notificationContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  bannerContainer: {
    height: 200,
    marginBottom: 16,
    backgroundColor: '#E2E8F0',
  },
  bannerItem: {
    width: SCREEN_WIDTH,
    height: 200,
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bannerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  bannerPagination: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '500',
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#0891B2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0891B2',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  tournamentsList: {
    paddingHorizontal: 20,
    paddingRight: 20,
  },
  tournamentCard: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tournamentCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tournamentCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
    marginLeft: 4,
  },
  slotsBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  slotsBadgeWarning: {
    backgroundColor: '#FEE2E2',
  },
  slotsText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46',
  },
  tournamentName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    lineHeight: 24,
  },
  tournamentDetails: {
    marginBottom: 16,
  },
  tournamentDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tournamentDetailText: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 6,
    fontWeight: '500',
  },
  tournamentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  tournamentFee: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0891B2',
  },
  tournamentButton: {
    backgroundColor: '#0891B2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tournamentButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1ED760',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 16,
    right: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.29,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  emptyActivityContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyActivityText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  emptyActivitySubtext: {
    marginTop: 4,
    fontSize: 14,
    color: '#6B7280',
  },
  trendingSportsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  trendingSportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 140,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  trendingSportIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendingSportName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  trendingSportPlayers: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  coachesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  coachCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 160,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  coachAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  coachName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    textAlign: 'center',
  },
  coachSport: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '500',
  },
  coachRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  coachRatingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    marginLeft: 4,
  },
  coachExperience: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  coachPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1ED760',
  },
  venuesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  venueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 12,
    width: 280,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  venueImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  venueInfo: {
    padding: 16,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  venueSport: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '500',
  },
  venueMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  venueDistance: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  venueDivider: {
    fontSize: 12,
    color: '#CBD5E1',
    marginHorizontal: 6,
  },
  venueRating: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
    fontWeight: '600',
  },
  venuePrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0891B2',
  },
});

export default UserHomeDashboard;
