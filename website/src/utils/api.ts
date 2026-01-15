// API utility for connecting to backend
import axios from 'axios';

// Get backend API URL from environment variable or default to production URL
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000';

// Create axios instance with defaults
const apiClient = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 30000, // 30 seconds timeout
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
    getProfile: () => 
      apiClient.get('/api/stores/profile'),
    
    getDashboard: () => 
      apiClient.get('/api/stores/dashboard'),
    
    getProducts: () => 
      apiClient.get('/api/stores/products'),
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
