/**
 * Application Configuration
 * Centralized configuration for API endpoints and environment variables
 */

// API Base URL
export const API_BASE_URL = 'https://playindia-3.onrender.com'; // Production backend
// export const API_BASE_URL = 'http://192.168.0.146:5000'; // Local backend (Works for Emulator & Physical Device)

// API Endpoints
export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        BASE: `${API_BASE_URL}/api/auth`,
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        REGISTER: `${API_BASE_URL}/api/auth/register`,
        PROFILE: `${API_BASE_URL}/api/auth/me`, // Backend uses /me endpoint
        ME: `${API_BASE_URL}/api/auth/me`,
        UPDATE: `${API_BASE_URL}/api/auth/update`,
    },

    // User endpoints
    USERS: {
        BASE: `${API_BASE_URL}/api/users`,
        PROFILE: `${API_BASE_URL}/api/users/profile`,
        LEADERBOARD: `${API_BASE_URL}/api/users/leaderboard`,
        NEARBY: `${API_BASE_URL}/api/users/nearby`,
        CHANGE_PASSWORD: `${API_BASE_URL}/api/users/change-password`,
    },

    // Tournament endpoints
    TOURNAMENTS: {
        BASE: `${API_BASE_URL}/api/tournaments`,
        MY_TOURNAMENTS: `${API_BASE_URL}/api/tournaments/my`,
        SEARCH: `${API_BASE_URL}/api/tournaments/search`,
        DETAIL: (id: string) => `${API_BASE_URL}/api/tournaments/${id}`,
        REGISTER: (id: string) => `${API_BASE_URL}/api/tournaments/${id}/register`,
    },

    // Nearby players endpoints
    NEARBY_PLAYERS: {
        BASE: `${API_BASE_URL}/api/nearby-players`,
        NOTIFY: `${API_BASE_URL}/api/nearby-players/notify`,
    },

    // Locations/Address endpoints
    LOCATIONS: {
        BASE: `${API_BASE_URL}/api/address`,
        FROM_COORDINATES: `${API_BASE_URL}/api/address/from-coordinates`,
        TO_COORDINATES: `${API_BASE_URL}/api/address/to-coordinates`,
        UPDATE: `${API_BASE_URL}/api/address/update`,
        NEARBY_USERS: `${API_BASE_URL}/api/address/nearby-users`,
        NEARBY_COACHES: `${API_BASE_URL}/api/address/nearby-coaches`,
    },

    // Bookings endpoints
    BOOKINGS: {
        BASE: `${API_BASE_URL}/api/bookings`,
        CREATE: `${API_BASE_URL}/api/bookings`,
        USER_BOOKINGS: `${API_BASE_URL}/api/bookings/user`,
        COACH_BOOKINGS: `${API_BASE_URL}/api/bookings/coach`,
        RATE: (id: string) => `${API_BASE_URL}/api/bookings/${id}/rate`,
        STATUS: (id: string) => `${API_BASE_URL}/api/bookings/${id}/status`,
    },

    // Venues endpoints
    VENUES: {
        BASE: `${API_BASE_URL}/api/venues`,
        LIST: `${API_BASE_URL}/api/venues/list`,
        BOOK: `${API_BASE_URL}/api/venues/book`,
        DETAIL: (id: string) => `${API_BASE_URL}/api/venues/${id}`,
        AVAILABILITY: (id: string) => `${API_BASE_URL}/api/venues/${id}/availability`,
        MY_VENUES: `${API_BASE_URL}/api/venues/my/venues`,
        MY_BOOKINGS: `${API_BASE_URL}/api/venues/my-bookings`,
    },

    // Coaches endpoints
    COACHES: {
        BASE: `${API_BASE_URL}/api/coaches`,
        PROFILE: `${API_BASE_URL}/api/coaches/profile`,
        REVIEWS: (id: string) => `${API_BASE_URL}/api/coaches/${id}/reviews`,
        SCHEDULE: (id: string) => `${API_BASE_URL}/api/coaches/${id}/schedule`,
    },

    // Wallet endpoints
    WALLET: {
        BASE: `${API_BASE_URL}/api/wallet`,
        BALANCE: `${API_BASE_URL}/api/wallet/balance`,
        ADD: `${API_BASE_URL}/api/wallet/add`,
        TRANSACTIONS: `${API_BASE_URL}/api/wallet/transactions`,
        TRANSFER: `${API_BASE_URL}/api/wallet/transfer`,
    },

    // Notification endpoints
    NOTIFICATIONS: {
        BASE: `${API_BASE_URL}/api/notifications`,
        COUNT: `${API_BASE_URL}/api/notifications/count`,
        READ_ALL: `${API_BASE_URL}/api/notifications/read-all`,
        SETTINGS: `${API_BASE_URL}/api/notifications/settings`,
    },

    // Matches endpoints
    MATCHES: {
        BASE: `${API_BASE_URL}/api/matches`,
    },

    // Support endpoints
    SUPPORT: {
        BASE: `${API_BASE_URL}/api/support`,
    },

    // Reviews endpoints
    REVIEWS: {
        BASE: `${API_BASE_URL}/api/reviews`,
    },

    // Stores endpoints
    STORES: {
        BASE: `${API_BASE_URL}/api/stores`,
        PROFILE: `${API_BASE_URL}/api/stores/profile`,
        DASHBOARD: `${API_BASE_URL}/api/stores/dashboard`,
        MY_PROFILE: `${API_BASE_URL}/api/stores/profile/me`,
        PRODUCTS: (storeId: string) => `${API_BASE_URL}/api/stores/${storeId}/products`,
        PRODUCT: (productId: string) => `${API_BASE_URL}/api/stores/products/${productId}`,
    },

    // Orders endpoints
    ORDERS: {
        BASE: `${API_BASE_URL}/api/orders`,
        MY_ORDERS: `${API_BASE_URL}/api/orders/my-orders`,
        STORE_ORDERS: `${API_BASE_URL}/api/orders/store`,
        DETAIL: (id: string) => `${API_BASE_URL}/api/orders/${id}`,
        UPDATE_STATUS: (id: string) => `${API_BASE_URL}/api/orders/${id}/status`,
    },

    // Admin endpoints
    ADMIN: {
        BASE: `${API_BASE_URL}/api/admin`,
        USERS: `${API_BASE_URL}/api/users`, // Admin get all users at base users route
        APPROVE_COACH: (coachId: string) =>
            `${API_BASE_URL}/api/admin/coaches/${coachId}/approve`,
        BANNERS: `${API_BASE_URL}/api/banners/all`,
    },

    // Banner endpoints
    BANNERS: {
        BASE: `${API_BASE_URL}/api/banners`,
        CLICK: (id: string) => `${API_BASE_URL}/api/banners/${id}/click`,
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

