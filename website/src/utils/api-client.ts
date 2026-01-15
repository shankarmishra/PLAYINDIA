import API_CONFIG from '@/config/api';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  token?: string;
}

const apiClient = async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
  const { method = 'GET', body, headers = {}, token } = options;
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(endpoint, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Authentication API methods
export const authApi = {
  login: (credentials: { email: string; password: string }) => 
    apiClient(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: credentials,
    }),

  register: (userData: any) => 
    apiClient(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: userData,
    }),

  me: (token: string) => 
    apiClient(API_CONFIG.ENDPOINTS.AUTH.ME, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// User API methods
export const userApi = {
  getProfile: (token: string) => 
    apiClient(API_CONFIG.ENDPOINTS.USERS.PROFILE, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getLeaderboard: () => 
    apiClient(API_CONFIG.ENDPOINTS.USERS.LEADERBOARD),

  getNearby: (params?: any) => 
    apiClient(`${API_CONFIG.ENDPOINTS.USERS.NEARBY}${params ? '?' + new URLSearchParams(params).toString() : ''}`),
};

// Coach API methods
export const coachApi = {
  getAll: () => 
    apiClient(API_CONFIG.ENDPOINTS.COACHES.BASE),

  getProfile: (token: string) => 
    apiClient(API_CONFIG.ENDPOINTS.COACHES.PROFILE, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// Store API methods
export const storeApi = {
  getAll: () => 
    apiClient(API_CONFIG.ENDPOINTS.STORES.BASE),

  getProfile: (token: string) => 
    apiClient(API_CONFIG.ENDPOINTS.STORES.PROFILE, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// Delivery API methods
export const deliveryApi = {
  getAll: () => 
    apiClient(API_CONFIG.ENDPOINTS.DELIVERY.BASE),

  getProfile: (token: string) => 
    apiClient(API_CONFIG.ENDPOINTS.DELIVERY.PROFILE, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// Player API methods
export const playerApi = {
  getAll: () => 
    apiClient(API_CONFIG.ENDPOINTS.PLAYERS.BASE),

  getProfile: (token: string) => 
    apiClient(API_CONFIG.ENDPOINTS.PLAYERS.PROFILE, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export default apiClient;