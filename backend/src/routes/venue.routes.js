const express = require('express');
const router = express.Router();
const { authenticate: protect, authorize } = require('../middleware/auth.middleware');
const {
    getPlayPoints: getVenues,
    getPlayPoint: getVenue,
    getAvailability,
    bookPlayPoint: bookVenue,
    createPlayPoint: createVenue,
    getOwnerPlayPoints: getMyVenues,
    getUserPlayPointBookings: getMyBookings,
    getPlayPointBookings: getVenueBookings
} = require('../controllers/playpoint.controller');

// Public routes
router.get('/list', getVenues);
router.get('/:id', getVenue);
router.get('/:id/availability', getAvailability);

// Protected routes
router.use(protect);

router.post('/book', bookVenue);
router.get('/my-bookings', getMyBookings);

// Venue owner / Admin routes
router.post('/', authorize(['admin', 'user']), createVenue); // 'user' role can be a venue owner if verified
router.get('/my/venues', getMyVenues);
router.get('/:id/bookings', getVenueBookings);

module.exports = router;
