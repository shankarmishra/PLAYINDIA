const {
  getAddressFromCoordinates,
  getCoordinatesFromAddress,
  updateUserLocation,
  getNearbyUsers,
  getNearbyCoaches
} = require('../services/address.service');

/**
 * Get address from coordinates
 */
exports.getAddress = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const address = await getAddressFromCoordinates(parseFloat(lat), parseFloat(lng));

    res.status(200).json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Get address error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get coordinates from address
 */
exports.getCoordinates = async (req, res, next) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address is required'
      });
    }

    const coordinates = await getCoordinatesFromAddress(address);

    res.status(200).json({
      success: true,
      data: coordinates
    });
  } catch (error) {
    console.error('Get coordinates error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update user location
 */
exports.updateLocation = async (req, res, next) => {
  try {
    const { lat, lng, address } = req.body;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const result = await updateUserLocation(req.user._id, parseFloat(lat), parseFloat(lng), address);

    res.status(200).json({
      success: true,
      message: 'Location updated successfully',
      data: result.location
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get nearby users
 */
exports.getNearbyUsers = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const users = await getNearbyUsers(parseFloat(lat), parseFloat(lng), parseInt(radius));

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get nearby users error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get nearby coaches
 */
exports.getNearbyCoaches = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const coaches = await getNearbyCoaches(parseFloat(lat), parseFloat(lng), parseInt(radius));

    res.status(200).json({
      success: true,
      count: coaches.length,
      data: coaches
    });
  } catch (error) {
    console.error('Get nearby coaches error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};