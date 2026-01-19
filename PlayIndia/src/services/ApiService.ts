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
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userType');
      
      // Format error message for better UX
      const errorMessage = error.response?.data?.message || 'Session expired. Please login again.';
      error.message = errorMessage;
    } else if (error.response?.status === 403) {
      error.message = error.response?.data?.message || 'Access denied. You don\'t have permission.';
    } else if (error.response?.status === 404) {
      error.message = error.response?.data?.message || 'Resource not found.';
    } else if (error.response?.status === 429) {
      error.message = 'Too many requests. Please try again later.';
    } else if (error.response?.status >= 500) {
      error.message = 'Server error. Please try again later.';
    } else if (!error.response) {
      // Network error
      error.message = 'Network error. Please check your connection.';
    } else {
      error.message = error.response?.data?.message || error.message || 'An error occurred.';
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
    
    // Banner management
    getBanners: (params?: any) => 
      apiClient.get(API_ENDPOINTS.ADMIN.BANNERS, { params }),
    
    createBanner: (bannerData: any) => 
      apiClient.post(API_ENDPOINTS.ADMIN.BANNERS, bannerData),
    
    updateBanner: (id: string, bannerData: any) => 
      apiClient.put(`${API_ENDPOINTS.ADMIN.BANNERS}/${id}`, bannerData),
    
    deleteBanner: (id: string) => 
      apiClient.delete(`${API_ENDPOINTS.ADMIN.BANNERS}/${id}`),
  },

  // Banner API methods (public)
  banners: {
    getAll: (params?: any) => 
      apiClient.get(API_ENDPOINTS.BANNERS.BASE, { params }),
    
    getById: (id: string) => 
      apiClient.get(`${API_ENDPOINTS.BANNERS.BASE}/${id}`),
    
    trackClick: (id: string) => 
      apiClient.post(API_ENDPOINTS.BANNERS.CLICK(id)),
  },

  // Stores API methods
  stores: {
    getDashboard: () => 
      apiClient.get(API_ENDPOINTS.STORES.DASHBOARD),
    
    getMyProfile: () => 
      apiClient.get(API_ENDPOINTS.STORES.MY_PROFILE),
    
    getProfile: (id: string) => 
      apiClient.get(`${API_ENDPOINTS.STORES.BASE}/${id}`),
    
    updateProfile: (data: any) => 
      apiClient.put(API_ENDPOINTS.STORES.PROFILE, data),
    
    getProducts: (storeId: string, params?: any) => 
      apiClient.get(API_ENDPOINTS.STORES.PRODUCTS(storeId), { params }),
    
    addProduct: (storeId: string, data: any) => 
      apiClient.post(API_ENDPOINTS.STORES.PRODUCTS(storeId), data),
    
    updateProduct: (productId: string, data: any) => 
      apiClient.put(API_ENDPOINTS.STORES.PRODUCT(productId), data),
    
    deleteProduct: (productId: string) => 
      apiClient.delete(API_ENDPOINTS.STORES.PRODUCT(productId)),
  },
  
  // Orders API methods
  orders: {
    getStoreOrders: (params?: any) => 
      apiClient.get(API_ENDPOINTS.ORDERS.STORE_ORDERS, { params }),
    
    getOrder: (id: string) => 
      apiClient.get(API_ENDPOINTS.ORDERS.DETAIL(id)),
    
    updateOrderStatus: (id: string, data: any) => 
      apiClient.put(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), data),
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