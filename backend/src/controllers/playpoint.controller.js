const PlayPoint = require('../models/PlayPoint.model');
const User = require('../models/user.model');
const Booking = require('../models/booking.model');

/**
 * Get PlayPoints locations
 */
exports.getPlayPoints = async (req, res, next) => {
  try {
    const { category, location, city, state, features, available, limit = 20, page = 1 } = req.query;
    
    let query = { status: 'active' };
    
    if (category) {
      query.type = category;
    }
    
    if (city) {
      query['location.address.city'] = new RegExp(city, 'i');
    }
    
    if (state) {
      query['location.address.state'] = new RegExp(state, 'i');
    }
    
    if (features) {
      // Features filter - for example: 'indoor', 'outdoor', 'parking', 'wifi'
      const featureList = features.split(',');
      featureList.forEach(feature => {
        switch(feature.trim()) {
          case 'indoor':
            query['facilities.venues'] = { $in: ['indoor'] };
            break;
          case 'outdoor':
            query['facilities.venues'] = { $in: ['outdoor'] };
            break;
          case 'parking':
            query['facilities.amenities.parking'] = true;
            break;
          case 'wifi':
            query['facilities.amenities.wifi'] = true;
            break;
        }
      });
    }
    
    // Add location-based query if coordinates are provided
    if (location) {
      const [lat, lng] = location.split(',').map(Number);
      const distance = req.query.distance || 10; // default 10km
      const radiusInRadians = distance / 6378.1; // Earth's radius in km

      query['location.coordinates'] = {
        $geoWithin: {
          $centerSphere: [
            [lng, lat],
            radiusInRadians
          ]
        }
      };
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const playPoints = await PlayPoint.find(query)
      .sort({ 'ratings.average': -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Calculate distance for each play point if location was provided
    let playPointsWithDistance = playPoints;
    if (location) {
      const [userLat, userLng] = location.split(',').map(Number);
      playPointsWithDistance = playPoints.map(pp => {
        const distance = calculateDistance(
          userLat, 
          userLng, 
          pp.location.coordinates[1], 
          pp.location.coordinates[0]
        );
        
        return {
          ...pp.toObject(),
          distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
        };
      });
      
      // Sort by distance if no other sort was applied
      if (!category && !city && !state) {
        playPointsWithDistance.sort((a, b) => a.distance - b.distance);
      }
    }

    const total = await PlayPoint.countDocuments(query);

    res.status(200).json({
      success: true,
      count: playPointsWithDistance.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: playPointsWithDistance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get PlayPoint details
 */
exports.getPlayPoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const playPoint = await PlayPoint.findById(id)
      .populate('owner.userId', 'name mobile');

    if (!playPoint) {
      return res.status(404).json({
        success: false,
        message: 'PlayPoint not found'
      });
    }

    // Get recent reviews
    const reviews = await PlayPoint.findById(id)
      .select('reviews')
      .then(pp => pp.reviews.slice(0, 5)); // Get last 5 reviews

    // Get availability for the next few days
    const availability = await getAvailability(id);

    const playPointData = {
      ...playPoint.toObject(),
      reviews,
      availability
    };

    res.status(200).json({
      success: true,
      data: playPointData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get PlayPoint availability
 */
exports.getAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query; // Format: YYYY-MM-DD
    
    const playPoint = await PlayPoint.findById(id);
    if (!playPoint) {
      return res.status(404).json({
        success: false,
        message: 'PlayPoint not found'
      });
    }

    const checkDate = date ? new Date(date) : new Date();
    const dayOfWeek = checkDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    // Check if the PlayPoint is open on this day
    const daySchedule = playPoint.availability.schedule.find(s => s.day === dayOfWeek);
    
    if (!daySchedule || !daySchedule.open24Hours) {
      return res.status(200).json({
        success: true,
        available: false,
        message: 'PlayPoint is closed on this day',
        schedule: daySchedule
      });
    }

    // Check specific date bookings
    const dateBookings = playPoint.bookings.filter(b => 
      new Date(b.date).toDateString() === checkDate.toDateString()
    );

    // Generate available time slots
    const availableSlots = generateTimeSlots(daySchedule.open, daySchedule.close, dateBookings);

    res.status(200).json({
      success: true,
      available: true,
      date: checkDate,
      slots: availableSlots,
      schedule: daySchedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Book a PlayPoint slot
 */
exports.bookPlayPoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, timeSlot, duration, participants, specialRequirements } = req.body;
    
    const playPoint = await PlayPoint.findById(id);
    if (!playPoint) {
      return res.status(404).json({
        success: false,
        message: 'PlayPoint not found'
      });
    }

    // Check if user has permission to book
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify availability for the requested time slot
    const bookingDate = new Date(date);
    const dayOfWeek = bookingDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const daySchedule = playPoint.availability.schedule.find(s => s.day === dayOfWeek);
    
    if (!daySchedule || !daySchedule.open24Hours) {
      return res.status(400).json({
        success: false,
        message: 'PlayPoint is not available on this day'
      });
    }

    // Check if time slot is available
    const existingBookings = playPoint.bookings.filter(b => 
      new Date(b.date).toDateString() === bookingDate.toDateString() &&
      b.timeSlot === timeSlot &&
      b.status === 'booked'
    );

    if (existingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Time slot is already booked'
      });
    }

    // Create booking
    const bookingData = {
      playPointId: id,
      service: {
        name: `${playPoint.name} Booking`,
        description: `Booking at ${playPoint.name}`,
        duration: duration || 60, // default 60 minutes
        price: calculateBookingPrice(playPoint, timeSlot, duration) // Implement pricing logic
      },
      schedule: {
        date: bookingDate,
        startTime: timeSlot,
        endTime: calculateEndTime(timeSlot, duration || 60)
      },
      location: playPoint.location,
      participants: participants ? participants.map(p => ({
        name: p.name,
        age: p.age,
        skillLevel: p.skillLevel
      })) : [{
        name: user.name,
        userId: req.user.id
      }],
      specialRequirements,
      status: 'pending',
      payment: {
        method: 'wallet',
        status: 'pending',
        amount: calculateBookingPrice(playPoint, timeSlot, duration)
      }
    };

    // Create booking through the booking system
    const booking = await Booking.create({
      ...bookingData,
      userId: req.user.id,
      coachId: playPoint.owner.userId, // Assuming owner can act as coach/supervisor
      type: 'facility_booking'
    });

    // Update PlayPoint with booking
    await PlayPoint.findByIdAndUpdate(
      id,
      {
        $push: {
          bookings: {
            bookingId: booking._id,
            date: bookingDate,
            timeSlot,
            status: 'booked',
            bookedBy: req.user.id
          }
        }
      }
    );

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get user's PlayPoint bookings
 */
exports.getUserPlayPointBookings = async (req, res, next) => {
  try {
    const { status, dateFrom, dateTo } = req.query;
    
    let query = { 
      'service.name': { $regex: 'Booking at', $options: 'i' }, // Filter for PlayPoint bookings
      userId: req.user.id
    };
    
    if (status) {
      query.status = status;
    }
    
    if (dateFrom || dateTo) {
      query['schedule.date'] = {};
      if (dateFrom) query['schedule.date'].$gte = new Date(dateFrom);
      if (dateTo) query['schedule.date'].$lte = new Date(dateTo);
    }
    
    const bookings = await Booking.find(query)
      .populate('coachId', 'name mobile') // This will be the PlayPoint owner
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get PlayPoint bookings (for PlayPoint owner)
 */
exports.getPlayPointBookings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, dateFrom, dateTo } = req.query;
    
    // Verify user is the PlayPoint owner
    const playPoint = await PlayPoint.findOne({ 
      _id: id, 
      'owner.userId': req.user.id 
    });
    
    if (!playPoint) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view bookings for this PlayPoint'
      });
    }
    
    // Get bookings associated with this PlayPoint
    const playPointBookings = playPoint.bookings;
    
    // Filter by status if provided
    let filteredBookings = playPointBookings;
    if (status) {
      filteredBookings = filteredBookings.filter(b => b.status === status);
    }
    
    // Filter by date if provided
    if (dateFrom || dateTo) {
      filteredBookings = filteredBookings.filter(b => {
        const bookingDate = new Date(b.date);
        return (
          (!dateFrom || bookingDate >= new Date(dateFrom)) &&
          (!dateTo || bookingDate <= new Date(dateTo))
        );
      });
    }
    
    // Get full booking details from Booking collection
    const bookingIds = filteredBookings.map(b => b.bookingId);
    const bookings = await Booking.find({ _id: { $in: bookingIds } })
      .populate('userId', 'name mobile')
      .sort({ 'schedule.date': 1, 'schedule.startTime': 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get PlayPoints by owner
 */
exports.getOwnerPlayPoints = async (req, res, next) => {
  try {
    const playPoints = await PlayPoint.find({ 'owner.userId': req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: playPoints.length,
      data: playPoints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Create a new PlayPoint (for verified owners)
 */
exports.createPlayPoint = async (req, res, next) => {
  try {
    const {
      name, type, location, facilities, pricing, availability, 
      contact, documents, features, settings
    } = req.body;
    
    // Verify user is allowed to create PlayPoints
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate PlayPoint ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    const playPointId = `PP-${timestamp}-${random}`.toUpperCase();

    // Create PlayPoint
    const playPoint = await PlayPoint.create({
      playPointId,
      name,
      type,
      location,
      owner: {
        userId: req.user.id,
        name: user.name,
        contact: user.mobile
      },
      facilities,
      pricing,
      availability,
      contact,
      documents,
      features,
      settings,
      status: 'active' // Could be 'pending' for approval in a real system
    });

    res.status(201).json({
      success: true,
      data: playPoint
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Calculate distance between two points (in km)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

/**
 * Generate time slots based on schedule and existing bookings
 */
function generateTimeSlots(openTime, closeTime, existingBookings) {
  const slots = [];
  const [openHour, openMin] = openTime.split(':').map(Number);
  const [closeHour, closeMin] = closeTime.split(':').map(Number);
  
  let currentHour = openHour;
  let currentMin = openMin;
  
  while (currentHour < closeHour || (currentHour === closeHour && currentMin < closeMin)) {
    const timeSlot = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
    
    // Check if this slot is already booked
    const isBooked = existingBookings.some(booking => booking.timeSlot === timeSlot);
    
    if (!isBooked) {
      slots.push(timeSlot);
    }
    
    currentMin += 30; // 30-minute slots
    if (currentMin >= 60) {
      currentHour++;
      currentMin = 0;
    }
    
    // Stop if we've exceeded the close time
    if (currentHour > closeHour || (currentHour === closeHour && currentMin >= closeMin)) {
      break;
    }
  }
  
  return slots;
}

/**
 * Calculate booking price based on PlayPoint, time, and duration
 */
function calculateBookingPrice(playPoint, timeSlot, duration) {
  // Implement pricing logic based on PlayPoint type, time slot, duration, etc.
  // This is a simple example - in reality, this would be more complex
  const baseRate = 100; // Base rate per hour
  const timeSlotMultiplier = 1.0; // Could vary by time of day
  const durationHours = duration / 60;
  
  return Math.round(baseRate * timeSlotMultiplier * durationHours);
}

/**
 * Calculate end time based on start time and duration
 */
function calculateEndTime(startTime, duration) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + duration;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}

module.exports = exports;