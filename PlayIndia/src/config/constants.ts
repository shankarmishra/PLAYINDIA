/**
 * Application Configuration
 * Centralized configuration for API endpoints and environment variables
 */

// API Base URL
export const API_BASE_URL = 'https://sportsbackend-n2xb.onrender.com';

// API Endpoints
export const API_ENDPOINTS = {
    // User endpoints
    USERS: {
        BASE: `${API_BASE_URL}/api/users`,
        LOGIN: `${API_BASE_URL}/api/users/login`,
        REGISTER: `${API_BASE_URL}/api/users/register`,
        PROFILE: `${API_BASE_URL}/api/users/profile`,
        LEADERBOARD: `${API_BASE_URL}/api/users/leaderboard`,
    },

    // Tournament endpoints
    TOURNAMENTS: {
        BASE: `${API_BASE_URL}/api/tournaments`,
        MY_TOURNAMENTS: `${API_BASE_URL}/api/tournaments/my`,
        DETAIL: (id: string) => `${API_BASE_URL}/api/tournaments/${id}`,
    },

    // Nearby players endpoints
    NEARBY_PLAYERS: {
        BASE: `${API_BASE_URL}/api/nearby-players`,
        NOTIFY: `${API_BASE_URL}/api/nearby-players/notify`,
    },

    // Locations endpoints
    LOCATIONS: {
        BASE: `${API_BASE_URL}/api/locations`,
    },

    // Bookings endpoints
    BOOKINGS: {
        BASE: `${API_BASE_URL}/api/bookings`,
        CREATE: `${API_BASE_URL}/api/bookings/create`,
        MY_BOOKINGS: `${API_BASE_URL}/api/bookings/my`,
    },

    // Venues endpoints
    VENUES: {
        BASE: `${API_BASE_URL}/api/venues`,
        LIST: `${API_BASE_URL}/api/venues/list`,
        BOOK: `${API_BASE_URL}/api/venues/book`,
        DETAIL: (id: string) => `${API_BASE_URL}/api/venues/${id}`,
    },

    // Coaches endpoints
    COACHES: {
        BASE: `${API_BASE_URL}/api/coaches`,
        PROFILE: `${API_BASE_URL}/api/coaches/profile`,
    },

    // Admin endpoints
    ADMIN: {
        BASE: `${API_BASE_URL}/api/admin`,
        USERS: `${API_BASE_URL}/api/admin/users`,
        APPROVE_COACH: (coachId: string) =>
            `${API_BASE_URL}/api/admin/coaches/${coachId}/approve`,
    },
};

// Environment configuration
export const ENV = {
    API_BASE_URL,
    IS_DEVELOPMENT: __DEV__,
    IS_PRODUCTION: !__DEV__,
};

// Export default config
export default {
    API_BASE_URL,
    API_ENDPOINTS,
    ENV,
};

