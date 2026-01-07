import { useState, useEffect } from 'react';
import AsyncStorage from '../utils/AsyncStorageSafe';
import { API_BASE_URL, API_ENDPOINTS } from '../config/constants';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'user' | 'coach' | 'seller' | 'delivery' | 'admin';
  status: 'pending' | 'active' | 'inactive' | 'suspended' | 'rejected';
  profileComplete: boolean;
  trustScore: number;
  level: 'rookie' | 'pro' | 'elite' | 'legend';
  experiencePoints: number;
  walletBalance: number;
  preferences: {
    favoriteGames: string[];
    skillLevel: 'beginner' | 'intermediate' | 'pro';
    ageGroup: string;
    city: string;
    preferredPlayTime: string[];
    distancePreference: number;
    notificationSettings: {
      push: boolean;
      email: boolean;
      sms: boolean;
      whatsapp: boolean;
    };
    privacySettings: {
      profileVisibility: 'public' | 'friends' | 'private';
      locationSharing: boolean;
      contactSharing: boolean;
    };
  };
  location?: {
    type: string;
    coordinates: [number, number];
    address: string;
    city: string;
    state: string;
  };
  verification: {
    email: {
      verified: boolean;
    };
    mobile: {
      verified: boolean;
    };
    aadhaar: {
      verified: boolean;
      verifiedAt?: string; // Changed from Date to string for JSON compatibility
    };
    pan: {
      verified: boolean;
      verifiedAt?: string; // Changed from Date to string for JSON compatibility
    };
    faceMatch: {
      verified: boolean;
      verifiedAt?: string; // Changed from Date to string for JSON compatibility
    };
  };
  social: {
    followers: Array<{
      userId: string;
      followedAt: string; // Changed from Date to string for JSON compatibility
    }>;
    following: Array<{
      userId: string;
      followedAt: string; // Changed from Date to string for JSON compatibility
    }>;
    friendRequests: Array<{
      from: string;
      sentAt: string; // Changed from Date to string for JSON compatibility
      status: 'pending' | 'accepted' | 'rejected';
    }>;
    blockedUsers: string[];
  };
  achievements: Array<{
    achievementId: {
      _id: string;
      name: string;
      description: string;
      icon?: string;
      badgeColor?: string;
      points: number;
      level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
      rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    };
    earnedAt: string; // Changed from Date to string for JSON compatibility
    unlocked: boolean;
  }>;
  playPoints: {
    totalPoints: number;
    availablePoints: number;
    pointsHistory: Array<{
      points: number;
      type: string;
      description: string;
      date: string; // Changed from Date to string for JSON compatibility
    }>;
  };
  subscription: {
    type: string;
    startDate?: string; // Changed from Date to string for JSON compatibility
    endDate?: string; // Changed from Date to string for JSON compatibility
    status: 'active' | 'inactive' | 'expired' | 'cancelled';
    features: string[];
  };
  referral: {
    code: string;
    referredBy?: string;
    totalReferrals: number;
    earnedPoints: number;
  };
  behavior: {
    noShowRate: number;
    cancellationRate: number;
    responseTime: number;
    reliabilityScore: number;
  };
  roleData?: any; // Role-specific data
}

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        // Get token from AsyncStorage
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Set default authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password
      });
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Store token and user in AsyncStorage
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        // Set token in axios defaults
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(user);
        setToken(token);
        
        return response.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, mobile: string, role: string = 'user') => {
    try {
      setLoading(true);
      
      const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, {
        name,
        email,
        password,
        mobile,
        role
      });
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Store token and user in AsyncStorage
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        // Set token in axios defaults
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(user);
        setToken(token);
        
        return response.data;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Clear token from AsyncStorage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
      
      // Remove authorization header
      delete axios.defaults.headers.common['Authorization'];
      
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      if (!token) return;
      
      const response = await axios.get(API_ENDPOINTS.AUTH.ME, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const user = response.data.user;
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // If token is invalid, logout user
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        await logout();
      }
    }
  };

  return {
    user,
    loading,
    token,
    login,
    register,
    logout,
    refreshUser,
  };
};

export default useAuth;

