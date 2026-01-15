const User = require('../models/user.model');
const config = require('../config');
const axios = require('axios');

/**
 * Address Service
 * Handles automatic address selection using Google Geocoding API
 */

/**
 * Get address from coordinates using Google Geocoding API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Address details
 */
const getAddressFromCoordinates = async (lat, lng) => {
  try {
    // In a real implementation, we would use Google Geocoding API
    // For simulation, we'll return a sample address
    
    // Using Google Geocoding API would look like this:
    /*
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${lat},${lng}`,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });
    
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      return response.data.results[0].formatted_address;
    } else {
      throw new Error('Unable to get address from coordinates');
    }
    */
    
    // For simulation, return a sample address
    return {
      formattedAddress: `Sample Address near (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400001',
      latitude: lat,
      longitude: lng
    };
  } catch (error) {
    console.error('Get address from coordinates error:', error);
    throw error;
  }
};

/**
 * Get coordinates from address using Google Geocoding API
 * @param {string} address - Address string
 * @returns {Promise<Object>} Coordinates
 */
const getCoordinatesFromAddress = async (address) => {
  try {
    // In a real implementation, we would use Google Geocoding API
    // For simulation, we'll return sample coordinates
    
    // Using Google Geocoding API would look like this:
    /*
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });
    
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng
      };
    } else {
      throw new Error('Unable to get coordinates from address');
    }
    */
    
    // For simulation, return sample coordinates
    return {
      lat: 19.0760 + (Math.random() - 0.5) * 0.1, // Mumbai coordinates with slight variation
      lng: 72.8777 + (Math.random() - 0.5) * 0.1
    };
  } catch (error) {
    console.error('Get coordinates from address error:', error);
    throw error;
  }
};

/**
 * Update user location
 * @param {string} userId - User ID
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} address - Address string
 * @returns {Promise<Object>} Updated user location
 */
const updateUserLocation = async (userId, lat, lng, address = null) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get address if not provided
    let addressData;
    if (!address) {
      addressData = await getAddressFromCoordinates(lat, lng);
    } else {
      addressData = {
        formattedAddress: address,
        latitude: lat,
        longitude: lng
      };
    }

    // Update user location
    user.location = {
      type: 'Point',
      coordinates: [lng, lat], // Note: GeoJSON format is [longitude, latitude]
      address: addressData.formattedAddress,
      city: addressData.city || user.location?.city,
      state: addressData.state || user.location?.state
    };

    await user.save();

    return {
      success: true,
      location: user.location
    };
  } catch (error) {
    console.error('Update user location error:', error);
    throw error;
  }
};

/**
 * Get nearby users within a radius
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Radius in meters
 * @returns {Promise<Array>} Nearby users
 */
const getNearbyUsers = async (lat, lng, radius = 5000) => { // Default 5km radius
  try {
    const nearbyUsers = await User.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radius // in meters
        }
      },
      status: 'active', // Only active users
      isActive: true // Only active users
    }).limit(50); // Limit to 50 users

    return nearbyUsers.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      trustScore: user.trustScore,
      location: user.location,
      lastActive: user.lastActive
    }));
  } catch (error) {
    console.error('Get nearby users error:', error);
    throw error;
  }
};

/**
 * Get nearby coaches within a radius
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Radius in meters
 * @returns {Promise<Array>} Nearby coaches
 */
const getNearbyCoaches = async (lat, lng, radius = 5000) => { // Default 5km radius
  try {
    const nearbyCoaches = await User.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radius // in meters
        }
      },
      role: 'coach',
      status: 'active', // Only active coaches
      isActive: true // Only active coaches
    }).limit(50); // Limit to 50 coaches

    return nearbyCoaches.map(coach => ({
      id: coach._id,
      name: coach.name,
      email: coach.email,
      mobile: coach.mobile,
      role: coach.role,
      trustScore: coach.trustScore,
      location: coach.location,
      lastActive: coach.lastActive
    }));
  } catch (error) {
    console.error('Get nearby coaches error:', error);
    throw error;
  }
};

module.exports = {
  getAddressFromCoordinates,
  getCoordinatesFromAddress,
  updateUserLocation,
  getNearbyUsers,
  getNearbyCoaches
};