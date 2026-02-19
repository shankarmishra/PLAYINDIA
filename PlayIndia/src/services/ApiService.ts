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
    if (token && config.headers) {
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

    changePassword: (passwordData: any) =>
      apiClient.put(API_ENDPOINTS.USERS.CHANGE_PASSWORD, passwordData),

    notifyPlayer: (notificationData: any) =>
      apiClient.post(API_ENDPOINTS.NEARBY_PLAYERS.NOTIFY, notificationData),
  },

  // Tournament API methods
  tournaments: {
    getAll: (params?: any) =>
      apiClient.get(API_ENDPOINTS.TOURNAMENTS.BASE, { params }),

    search: (params?: any) =>
      apiClient.get(API_ENDPOINTS.TOURNAMENTS.SEARCH, { params }),

    getById: (id: string) =>
      apiClient.get(API_ENDPOINTS.TOURNAMENTS.DETAIL(id)),

    create: (tournamentData: any) =>
      apiClient.post(API_ENDPOINTS.TOURNAMENTS.BASE, tournamentData),

    update: (id: string, tournamentData: any) =>
      apiClient.put(API_ENDPOINTS.TOURNAMENTS.DETAIL(id), tournamentData),

    delete: (id: string) =>
      apiClient.delete(API_ENDPOINTS.TOURNAMENTS.DETAIL(id)),

    register: (id: string, teamData: any) =>
      apiClient.post(API_ENDPOINTS.TOURNAMENTS.REGISTER(id), teamData),
  },

  // Coaches API methods
  coaches: {
    getAll: (params?: any) =>
      apiClient.get(API_ENDPOINTS.COACHES.BASE, { params }),

    getProfile: () =>
      apiClient.get(API_ENDPOINTS.COACHES.PROFILE),

    getById: (id: string) =>
      apiClient.get(`${API_ENDPOINTS.COACHES.BASE}/${id}`),

    getReviews: (id: string) =>
      apiClient.get(API_ENDPOINTS.COACHES.REVIEWS(id)),

    addReview: (id: string, reviewData: any) =>
      apiClient.post(API_ENDPOINTS.COACHES.REVIEWS(id), reviewData),

    getSchedule: (id: string) =>
      apiClient.get(API_ENDPOINTS.COACHES.SCHEDULE(id)),

    updateSchedule: (id: string, scheduleData: any) =>
      apiClient.put(API_ENDPOINTS.COACHES.SCHEDULE(id), scheduleData),
  },

  // Teams API methods
  teams: {
    getAll: (params?: any) =>
      apiClient.get(`${API_BASE_URL}/api/teams`, { params }),

    getById: (id: string) =>
      apiClient.get(`${API_BASE_URL}/api/teams/${id}`),

    create: (teamData: any) =>
      apiClient.post(`${API_BASE_URL}/api/teams`, teamData),

    addPlayer: (teamId: string, playerData: any) =>
      apiClient.post(`${API_BASE_URL}/api/teams/${teamId}/players`, playerData),
  },

  // Venues API methods
  venues: {
    getAll: (params?: any) =>
      apiClient.get(API_ENDPOINTS.VENUES.LIST, { params }),

    getById: (id: string) =>
      apiClient.get(API_ENDPOINTS.VENUES.DETAIL(id)),

    getAvailability: (id: string) =>
      apiClient.get(API_ENDPOINTS.VENUES.AVAILABILITY(id)),

    book: (bookingData: any) =>
      apiClient.post(API_ENDPOINTS.VENUES.BOOK, bookingData),

    getMyVenues: () =>
      apiClient.get(API_ENDPOINTS.VENUES.MY_VENUES),

    getMyBookings: () =>
      apiClient.get(API_ENDPOINTS.VENUES.MY_BOOKINGS),
  },

  // Bookings API methods
  bookings: {
    create: (bookingData: any) =>
      apiClient.post(API_ENDPOINTS.BOOKINGS.BASE, bookingData),

    getUserBookings: () =>
      apiClient.get(API_ENDPOINTS.BOOKINGS.USER_BOOKINGS),

    getCoachBookings: () =>
      apiClient.get(API_ENDPOINTS.BOOKINGS.COACH_BOOKINGS),

    getById: (id: string) =>
      apiClient.get(`${API_ENDPOINTS.BOOKINGS.BASE}/${id}`),

    updateStatus: (id: string, statusData: any) =>
      apiClient.put(API_ENDPOINTS.BOOKINGS.STATUS(id), statusData),

    rate: (id: string, ratingData: any) =>
      apiClient.post(API_ENDPOINTS.BOOKINGS.RATE(id), ratingData),
  },

  // Wallet API methods
  wallet: {
    getBalance: () =>
      apiClient.get(API_ENDPOINTS.WALLET.BALANCE),

    getTransactions: () =>
      apiClient.get(API_ENDPOINTS.WALLET.TRANSACTIONS),

    addMoney: (amount: number) =>
      apiClient.post(API_ENDPOINTS.WALLET.ADD, { amount }),

    transfer: (transferData: any) =>
      apiClient.post(API_ENDPOINTS.WALLET.TRANSFER, transferData),
  },

  // Notification API methods
  notifications: {
    getAll: (params?: any) =>
      apiClient.get(API_ENDPOINTS.NOTIFICATIONS.BASE, { params }),

    getCount: () =>
      apiClient.get(API_ENDPOINTS.NOTIFICATIONS.COUNT),

    markAsRead: (id: string) =>
      apiClient.put(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/${id}`),

    markAllAsRead: () =>
      apiClient.put(API_ENDPOINTS.NOTIFICATIONS.READ_ALL),

    delete: (id: string) =>
      apiClient.delete(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/${id}`),

    getSettings: () =>
      apiClient.get(API_ENDPOINTS.NOTIFICATIONS.SETTINGS),

    updateSettings: (settings: any) =>
      apiClient.put(API_ENDPOINTS.NOTIFICATIONS.SETTINGS, settings),
  },

  // Stores API methods
  stores: {
    getAll: (params?: any) =>
      apiClient.get(API_ENDPOINTS.STORES.BASE, { params }),

    getDashboard: () =>
      apiClient.get(API_ENDPOINTS.STORES.DASHBOARD),

    getMyProfile: () =>
      apiClient.get(API_ENDPOINTS.STORES.MY_PROFILE),

    getProfile: (id: string) =>
      apiClient.get(`${API_ENDPOINTS.STORES.BASE}/${id}`),

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
    create: (orderData: any) =>
      apiClient.post(API_ENDPOINTS.ORDERS.BASE, orderData),

    getMyOrders: () =>
      apiClient.get(API_ENDPOINTS.ORDERS.MY_ORDERS),

    getStoreOrders: (params?: any) =>
      apiClient.get(API_ENDPOINTS.ORDERS.STORE_ORDERS, { params }),

    getById: (id: string) =>
      apiClient.get(API_ENDPOINTS.ORDERS.DETAIL(id)),

    updateStatus: (id: string, statusData: any) =>
      apiClient.put(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), statusData),
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

  // Products API methods (for users)
  products: {
    getAll: (params?: any) =>
      apiClient.get(`${API_BASE_URL}/api/products`, { params }),

    getProduct: (id: string) =>
      apiClient.get(`${API_BASE_URL}/api/stores/products/${id}`),
  },

  // Ads API methods
  ads: {
    getStoreAds: (params?: any) =>
      apiClient.get(`${API_BASE_URL}/api/stores/ads`, { params }),

    getAd: (id: string) =>
      apiClient.get(`${API_BASE_URL}/api/stores/ads/${id}`),

    createAd: (data: any) =>
      apiClient.post(`${API_BASE_URL}/api/stores/ads`, data),

    updateAd: (id: string, data: any) =>
      apiClient.put(`${API_BASE_URL}/api/stores/ads/${id}`, data),

    deleteAd: (id: string) =>
      apiClient.delete(`${API_BASE_URL}/api/stores/ads/${id}`),

    submitAd: (id: string, paymentData: any) =>
      apiClient.post(`${API_BASE_URL}/api/stores/ads/${id}/submit`, paymentData),

    toggleAd: (id: string) =>
      apiClient.post(`${API_BASE_URL}/api/stores/ads/${id}/toggle`),

    getActiveAds: (params?: any) =>
      apiClient.get(`${API_BASE_URL}/api/ads/active`, { params }),

    trackClick: (id: string) =>
      apiClient.post(`${API_BASE_URL}/api/ads/${id}/click`),

    trackView: (id: string) =>
      apiClient.post(`${API_BASE_URL}/api/ads/${id}/view`),
  },

  // Location/Address API methods
  locations: {
    getAddressFromCoords: (lat: number, lng: number) =>
      apiClient.get(API_ENDPOINTS.LOCATIONS.FROM_COORDINATES, { params: { lat, lng } }),

    getCoordsFromAddress: (address: string) =>
      apiClient.get(API_ENDPOINTS.LOCATIONS.TO_COORDINATES, { params: { address } }),

    updateLocation: (locationData: any) =>
      apiClient.put(API_ENDPOINTS.LOCATIONS.UPDATE, locationData),

    getNearbyUsers: (params?: any) =>
      apiClient.get(API_ENDPOINTS.LOCATIONS.NEARBY_USERS, { params }),

    getNearbyCoaches: (params?: any) =>
      apiClient.get(API_ENDPOINTS.LOCATIONS.NEARBY_COACHES, { params }),
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