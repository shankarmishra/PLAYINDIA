import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/constants';
import AsyncStorage from '../utils/AsyncStorageSafe';

// Create axios instance with defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      AsyncStorage.removeItem('userToken');
      AsyncStorage.removeItem('user');
      // TODO: Implement navigation to login
    }
    return Promise.reject(error);
  }
);

// API Service Object
const ApiService = {
  // Auth API methods
  auth: {
    login: (email: string, password: string) => 
      apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password }),
    
    register: (userData: any) => 
      apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData),
    
    me: () => 
      apiClient.get(API_ENDPOINTS.AUTH.ME),
    
    profile: () => 
      apiClient.get(API_ENDPOINTS.AUTH.PROFILE),
  },

  // User API methods
  users: {
    getProfile: () => 
      apiClient.get(API_ENDPOINTS.USERS.PROFILE),
    
    getLeaderboard: () => 
      apiClient.get(API_ENDPOINTS.USERS.LEADERBOARD),
    
    getNearby: (params?: any) => 
      apiClient.get(API_ENDPOINTS.USERS.NEARBY, { params }),
    
    updateProfile: (profileData: any) => 
      apiClient.put(API_ENDPOINTS.USERS.PROFILE, profileData),
  },

  // Tournament API methods
  tournaments: {
    getAll: (params?: any) => 
      apiClient.get(API_ENDPOINTS.TOURNAMENTS.BASE, { params }),
    
    getMy: () => 
      apiClient.get(API_ENDPOINTS.TOURNAMENTS.MY_TOURNAMENTS),
    
    getById: (id: string) => 
      apiClient.get(API_ENDPOINTS.TOURNAMENTS.DETAIL(id)),
    
    create: (tournamentData: any) => 
      apiClient.post(API_ENDPOINTS.TOURNAMENTS.BASE, tournamentData),
    
    update: (id: string, tournamentData: any) => 
      apiClient.put(`${API_ENDPOINTS.TOURNAMENTS.DETAIL(id)}`, tournamentData),
    
    delete: (id: string) => 
      apiClient.delete(`${API_ENDPOINTS.TOURNAMENTS.DETAIL(id)}`),
  },

  // Coaches API methods
  coaches: {
    getAll: (params?: any) => 
      apiClient.get(API_ENDPOINTS.COACHES.BASE, { params }),
    
    getProfile: () => 
      apiClient.get(API_ENDPOINTS.COACHES.PROFILE),
    
    getDashboard: () => 
      apiClient.get(`${API_ENDPOINTS.COACHES.BASE}/dashboard`),
    
    getAvailability: () => 
      apiClient.get(`${API_ENDPOINTS.COACHES.BASE}/availability`),
    
    updateAvailability: (availabilityData: any) => 
      apiClient.put(`${API_ENDPOINTS.COACHES.BASE}/availability`, availabilityData),
  },

  // Teams API methods
  teams: {
    getAll: (params?: any) => 
      apiClient.get(`${API_BASE_URL}/api/teams`, { params }),
    
    getBySportAndLocation: (sport: string, lat: number, lng: number, radius: number) => 
      apiClient.get(`${API_BASE_URL}/api/teams/search`, {
        params: { sport, lat, lng, radius }
      }),
    
    create: (teamData: any) => 
      apiClient.post(`${API_BASE_URL}/api/teams`, teamData),
  },

  // Venues API methods
  venues: {
    getAll: (params?: any) => 
      apiClient.get(API_ENDPOINTS.VENUES.LIST, { params }),
    
    getById: (id: string) => 
      apiClient.get(API_ENDPOINTS.VENUES.DETAIL(id)),
    
    book: (bookingData: any) => 
      apiClient.post(API_ENDPOINTS.VENUES.BOOK, bookingData),
  },

  // Bookings API methods
  bookings: {
    getAll: () => 
      apiClient.get(API_ENDPOINTS.BOOKINGS.BASE),
    
    getMyBookings: () => 
      apiClient.get(API_ENDPOINTS.BOOKINGS.MY_BOOKINGS),
    
    create: (bookingData: any) => 
      apiClient.post(API_ENDPOINTS.BOOKINGS.CREATE, bookingData),
  },

  // Admin API methods
  admin: {
    getUsers: () => 
      apiClient.get(API_ENDPOINTS.ADMIN.USERS),
    
    approveCoach: (coachId: string) => 
      apiClient.patch(API_ENDPOINTS.ADMIN.APPROVE_COACH(coachId)),
    
    getDashboardStats: () => 
      apiClient.get(`${API_ENDPOINTS.ADMIN.BASE}/dashboard`),
  },

  // Generic methods
  get: (url: string, params?: any) => 
    apiClient.get(url, { params }),
  
  post: (url: string, data?: any) => 
    apiClient.post(url, data),
  
  put: (url: string, data?: any) => 
    apiClient.put(url, data),
  
  patch: (url: string, data?: any) => 
    apiClient.patch(url, data),
  
  delete: (url: string) => 
    apiClient.delete(url),
};

export default ApiService;