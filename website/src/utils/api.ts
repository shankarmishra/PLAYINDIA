// API utility for connecting to backend
import axios from 'axios';
import { BACKEND_API_URL } from '../config/constants';

// Create axios instance with defaults
const apiClient = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 20000, // 20 seconds timeout (reduced from 30s)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
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
    // Suppress console errors for 404s (route not deployed or resource doesn't exist)
    if (error.response?.status === 404) {
      // Mark as silent to prevent axios from logging
      if (error.config) {
        error.config.silent = true;
        // Try to prevent axios from logging by setting validateStatus
        error.config.validateStatus = () => true;
      }
      // Suppress the error from being logged
      error.suppressLog = true;
      error.isNotFound = true;
      error.isHandled = true;
      // Note: Axios logs 404s by default - this is expected behavior
      // The dashboard will still work correctly despite these logs
      // Once the backend route is deployed, these 404s will stop
    }
    
    // Handle rate limiting (429)
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || '60';
      error.message = `Too many requests, please try again later. Please wait ${retryAfter} seconds.`;
      // Don't reject immediately for 429, return a formatted error
      return Promise.reject({
        ...error,
        message: error.message,
        isRateLimit: true
      });
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid, remove from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
      }
      // TODO: Redirect to login page
    }
    
    // Format error response to match backend format
    if (error.response?.data) {
      // Backend returns: { success: false, message: "..." }
      const backendError = error.response.data;
      if (backendError.message) {
        error.message = backendError.message;
      }
    }
    
    // For 404 errors, ensure message is clear
    if (error.response?.status === 404) {
      if (!error.message || error.message === 'Request failed with status code 404') {
        error.message = error.response?.data?.message || 'Resource not found';
      }
      // Mark 404 errors for silent handling
      error.isNotFound = true;
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

// API Service Object for specific endpoints
export const ApiService = {
  // Auth API methods
  auth: {
    login: (email: string, password: string) => 
      apiClient.post('/api/auth/login', { email, password }),
    
    register: (userData: any) => 
      apiClient.post('/api/auth/register', userData),
    
    me: () => 
      apiClient.get('/api/auth/me'),
    
    profile: () => 
      apiClient.get('/api/auth/profile'),
  },

  // User API methods
  users: {
    getProfile: () => 
      apiClient.get('/api/users/profile'),
    
    getLeaderboard: () => 
      apiClient.get('/api/users/leaderboard'),
    
    getNearby: (params?: any) => 
      apiClient.get('/api/users/nearby', { params }),
    
    updateProfile: (profileData: any) => 
      apiClient.put('/api/users/profile', profileData),
  },

  // Tournament API methods
  tournaments: {
    getAll: (params?: any) => 
      apiClient.get('/api/tournaments', { params }),
    
    getMy: () => 
      apiClient.get('/api/tournaments/my'),
    
    getById: (id: string) => 
      apiClient.get(`/api/tournaments/${id}`),
    
    create: (tournamentData: any) => 
      apiClient.post('/api/tournaments', tournamentData),
    
    update: (id: string, tournamentData: any) => 
      apiClient.put(`/api/tournaments/${id}`, tournamentData),
    
    delete: (id: string) => 
      apiClient.delete(`/api/tournaments/${id}`),
  },

  // Coaches API methods
  coaches: {
    getAll: (params?: any) => 
      apiClient.get('/api/coaches', { params }),
    
    getProfile: () => 
      apiClient.get('/api/coaches/profile'),
    
    getDashboard: () => 
      apiClient.get('/api/coaches/dashboard'),
    
    getAvailability: () => 
      apiClient.get('/api/coaches/availability'),
    
    updateAvailability: (availabilityData: any) => 
      apiClient.put('/api/coaches/availability', availabilityData),
  },

  // Stores API methods
  stores: {
    getProfile: async () => {
      try {
        const response = await apiClient.get('/api/stores/profile');
        return response;
      } catch (error: any) {
        // Check if it's a "not found" error
        const errorMessage = error.response?.data?.message || error.message || '';
        const isNotFound = error.response?.status === 404 || 
                          errorMessage.toLowerCase().includes('not found') ||
                          errorMessage.toLowerCase().includes('store profile not found') ||
                          errorMessage.toLowerCase().includes('store profile not found for current user');
        
        if (isNotFound) {
          // Mark error as handled to prevent console logging
          error.isNotFound = true;
          error.isHandled = true;
          // Suppress console error for not found cases
          error.suppressLog = true;
          // Prevent axios from logging by marking config as silent
          if (error.config) {
            error.config.silent = true;
          }
        }
        throw error;
      }
    },
    
    getDashboard: async () => {
      try {
        return await apiClient.get('/api/stores/dashboard');
      } catch (error: any) {
        // Check if it's a 500 error (server error)
        if (error.response?.status === 500) {
          // Log but don't suppress - this is a real error
          console.error('Dashboard API returned 500 error:', error.response?.data);
        }
        // Check if it's a "not found" error (404)
        const errorMessage = error.response?.data?.message || error.message || '';
        const isNotFound = error.response?.status === 404 || 
                          errorMessage.toLowerCase().includes('not found') ||
                          errorMessage.toLowerCase().includes('store profile not found') ||
                          errorMessage.toLowerCase().includes('route not found');
        
        if (isNotFound) {
          error.isNotFound = true;
          error.isHandled = true;
          error.suppressLog = true;
          // Prevent axios from logging
          if (error.config) {
            error.config.silent = true;
          }
        }
        throw error;
      }
    },
    
    getProducts: (storeId: string, params?: any) => 
      apiClient.get(`/api/stores/${storeId}/products`, { params }),
    
    getMyProducts: (params?: any) => {
      // First get store profile to get store ID, then get products
      return apiClient.get('/api/stores/profile').then((profileRes: any) => {
        if (profileRes.data?.success && profileRes.data?.data?._id) {
          return apiClient.get(`/api/stores/${profileRes.data.data._id}/products`, { params });
        }
        throw new Error('Store profile not found');
      });
    },
    
    addProduct: (storeId: string, data: any) => 
      apiClient.post(`/api/stores/${storeId}/products`, data),
    
    updateProduct: (productId: string, data: any) => 
      apiClient.put(`/api/stores/products/${productId}`, data),
    
    deleteProduct: (productId: string) => 
      apiClient.delete(`/api/stores/products/${productId}`),
    
    updateProfile: (data: any) => 
      apiClient.put('/api/stores/profile', data),
  },
  
  // Orders API methods
  orders: {
    getStoreOrders: (params?: any) => 
      apiClient.get('/api/orders/store', { params }),
    
    getOrder: (id: string) => 
      apiClient.get(`/api/orders/${id}`),
    
    updateOrderStatus: (id: string, data: any) => 
      apiClient.put(`/api/orders/${id}`, data),
  },

  // Delivery API methods
  delivery: {
    getProfile: () => 
      apiClient.get('/api/delivery/profile'),
    
    getDashboard: () => 
      apiClient.get('/api/delivery/dashboard'),
    
    getOrders: () => 
      apiClient.get('/api/delivery/orders'),
  },

  // Teams API methods
  teams: {
    getAll: (params?: any) => 
      apiClient.get('/api/teams', { params }),
    
    getBySportAndLocation: (sport: string, lat: number, lng: number, radius: number) => 
      apiClient.get('/api/teams/search', {
        params: { sport, lat, lng, radius }
      }),
    
    create: (teamData: any) => 
      apiClient.post('/api/teams', teamData),
  },

  // Venues API methods
  venues: {
    getAll: (params?: any) => 
      apiClient.get('/api/venues/list', { params }),
    
    getById: (id: string) => 
      apiClient.get(`/api/venues/${id}`),
    
    book: (bookingData: any) => 
      apiClient.post('/api/venues/book', bookingData),
  },

  // Bookings API methods
  bookings: {
    getAll: () => 
      apiClient.get('/api/bookings'),
    
    getMyBookings: () => 
      apiClient.get('/api/bookings/my'),
    
    create: (bookingData: any) => 
      apiClient.post('/api/bookings/create', bookingData),
  },

  // Admin API methods
  admin: {
    getUsers: () => 
      apiClient.get('/api/admin/users'),
    
    approveCoach: (coachId: string) => 
      apiClient.patch(`/api/admin/coaches/${coachId}/approve`),
    
    getDashboardStats: () => 
      apiClient.get('/api/admin/dashboard'),
  },
};
