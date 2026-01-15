// API Configuration for the website
const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000';

export const API_CONFIG = {
  BASE_URL: BACKEND_API_BASE_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: `${BACKEND_API_BASE_URL}/api/auth/login`,
      REGISTER: `${BACKEND_API_BASE_URL}/api/auth/register`,
      ME: `${BACKEND_API_BASE_URL}/api/auth/me`,
      PROFILE: `${BACKEND_API_BASE_URL}/api/auth/profile`,
    },
    USERS: {
      BASE: `${BACKEND_API_BASE_URL}/api/users`,
      PROFILE: `${BACKEND_API_BASE_URL}/api/users/profile`,
      LEADERBOARD: `${BACKEND_API_BASE_URL}/api/users/leaderboard`,
      NEARBY: `${BACKEND_API_BASE_URL}/api/users/nearby`,
    },
    COACHES: {
      BASE: `${BACKEND_API_BASE_URL}/api/coaches`,
      PROFILE: `${BACKEND_API_BASE_URL}/api/coaches/profile`,
    },
    STORES: {
      BASE: `${BACKEND_API_BASE_URL}/api/stores`,
      PROFILE: `${BACKEND_API_BASE_URL}/api/stores/profile`,
    },
    DELIVERY: {
      BASE: `${BACKEND_API_BASE_URL}/api/delivery`,
      PROFILE: `${BACKEND_API_BASE_URL}/api/delivery/profile`,
    },
    PLAYERS: {
      BASE: `${BACKEND_API_BASE_URL}/api/players`,
      PROFILE: `${BACKEND_API_BASE_URL}/api/players/profile`,
    },
    TOURNAMENTS: {
      BASE: `${BACKEND_API_BASE_URL}/api/tournaments`,
      MY_TOURNAMENTS: `${BACKEND_API_BASE_URL}/api/tournaments/my`,
    },
    TEAMS: {
      BASE: `${BACKEND_API_BASE_URL}/api/teams`,
    },
    VENUES: {
      BASE: `${BACKEND_API_BASE_URL}/api/venues`,
      LIST: `${BACKEND_API_BASE_URL}/api/venues/list`,
    },
    BOOKINGS: {
      BASE: `${BACKEND_API_BASE_URL}/api/bookings`,
      MY_BOOKINGS: `${BACKEND_API_BASE_URL}/api/bookings/my`,
    },
    ADMIN: {
      BASE: `${BACKEND_API_BASE_URL}/api/admin`,
      USERS: `${BACKEND_API_BASE_URL}/api/admin/users`,
    },
  },
};

export default API_CONFIG;