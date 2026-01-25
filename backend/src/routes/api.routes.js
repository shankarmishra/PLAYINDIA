const express = require('express');
const { authenticate: protect, authorize } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');
const coachController = require('../controllers/coach.controller');
const storeController = require('../controllers/store.controller');
const deliveryController = require('../controllers/delivery.controller');
const bookingController = require('../controllers/booking.controller');
const orderController = require('../controllers/order.controller');
const tournamentController = require('../controllers/tournament.controller');
const teamController = require('../controllers/team.controller');
const matchController = require('../controllers/match.controller');
const walletController = require('../controllers/wallet.controller');
const reviewController = require('../controllers/review.controller');
const notificationController = require('../controllers/notification.controller');
const supportController = require('../controllers/support.controller');
const achievementController = require('../controllers/achievement.controller');
const playpointController = require('../controllers/playpoint.controller');
const bannerController = require('../controllers/banner.controller');

const router = express.Router();

// Debug route to verify routing works
router.get('/stores/test', (req, res) => {
  res.json({ success: true, message: 'Store routes are working' });
});

// User routes
router.route('/users/nearby')
  .get(protect, userController.getNearbyPlayers);

router.route('/users/:id')
  .get(protect, userController.getUserProfile);

router.route('/users/preferences')
  .put(protect, userController.updatePreferences);

router.route('/users/dashboard')
  .get(protect, userController.getUserDashboard);

router.route('/users/achievements')
  .get(protect, userController.getUserAchievements);

// Coach routes
router.route('/coaches')
  .get(protect, coachController.getCoaches);

router.route('/coaches/profile')
  .get(protect, coachController.getMyCoachProfile);

router.route('/coaches/:id')
  .get(protect, coachController.getCoachProfile);

router.route('/coaches/dashboard')
  .get(protect, coachController.getCoachDashboard);

router.route('/coaches/availability')
  .put(protect, coachController.updateAvailability);

router.route('/coaches/:id/availability/:date')
  .get(protect, coachController.getCoachAvailability);

// Store routes
// IMPORTANT: Define specific routes BEFORE parameterized routes
// Express matches routes in order, so /stores/dashboard must come before /stores/:id

// Dashboard route - MUST be before /stores/:id to prevent route conflict
router.get('/stores/dashboard', protect, authorize('seller', 'store'), storeController.getStoreDashboard);

// Profile route - specific route before parameterized
router.route('/stores/profile')
  .get(protect, storeController.getMyStoreProfile)
  .put(protect, authorize('seller', 'store'), storeController.updateStoreProfile);

// List all stores
router.route('/stores')
  .get(protect, storeController.getStores);

// Parameterized routes - MUST come after specific routes
router.route('/stores/:id')
  .get(protect, storeController.getStoreProfile);

router.route('/stores/:id/products')
  .get(protect, storeController.getStoreProducts)
  .post(protect, authorize('seller', 'store'), storeController.addProduct);

router.route('/stores/products/:id')
  .put(protect, authorize('seller', 'store'), storeController.updateProduct)
  .delete(protect, authorize('seller', 'store'), storeController.deleteProduct);

// Delivery routes
router.route('/delivery/available')
  .get(protect, deliveryController.getAvailableDeliveryBoys);

router.route('/delivery/profile')
  .get(protect, deliveryController.getMyDeliveryProfile);

router.route('/delivery/dashboard')
  .get(protect, authorize('delivery'), deliveryController.getDeliveryDashboard);

router.route('/delivery/availability')
  .put(protect, authorize('delivery'), deliveryController.updateDeliveryAvailability);

router.route('/delivery/location')
  .put(protect, authorize('delivery'), deliveryController.updateDeliveryLocation);

router.route('/delivery/orders')
  .get(protect, authorize('delivery'), deliveryController.getDeliveryOrders);

router.route('/delivery/orders/:orderId/status')
  .put(protect, authorize('delivery'), deliveryController.updateOrderDeliveryStatus);

router.route('/delivery/:id')
  .get(protect, deliveryController.getDeliveryProfile);

// Booking routes
router.route('/bookings')
  .post(protect, bookingController.createBooking)
  .get(protect, bookingController.getUserBookings);

router.route('/bookings/coach')
  .get(protect, bookingController.getCoachBookings);

router.route('/bookings/:id')
  .get(protect, bookingController.getBooking)
  .put(protect, bookingController.updateBookingStatus);

router.route('/bookings/:id/respond')
  .put(protect, bookingController.respondToBooking);

router.route('/bookings/:id/complete')
  .put(protect, bookingController.completeBooking);

// Order routes
router.route('/orders')
  .post(protect, orderController.createOrder)
  .get(protect, orderController.getUserOrders);

router.route('/orders/store')
  .get(protect, authorize('seller', 'store'), orderController.getStoreOrders);

router.route('/orders/:id')
  .get(protect, orderController.getOrder)
  .put(protect, orderController.updateOrderStatus);

router.route('/orders/:orderId/assign-delivery')
  .put(protect, authorize('seller', 'store'), orderController.assignDelivery);

router.route('/orders/:orderId/delivery-boys')
  .get(protect, authorize('seller', 'store'), orderController.getAvailableDeliveryBoysForOrder);

// Tournament routes
router.route('/tournaments')
  .post(protect, tournamentController.createTournament)
  .get(protect, tournamentController.getTournaments);

router.route('/tournaments/:id')
  .get(protect, tournamentController.getTournament)
  .put(protect, tournamentController.updateTournamentStatus);

router.route('/tournaments/:id/register')
  .post(protect, tournamentController.registerTeamForTournament);

router.route('/tournaments/:id/brackets')
  .post(protect, tournamentController.generateBrackets);

router.route('/tournaments/user')
  .get(protect, tournamentController.getUserTournaments);

// Team routes
router.route('/teams')
  .post(protect, teamController.createTeam)
  .get(protect, teamController.getUserTeams);

router.route('/teams/:id')
  .get(protect, teamController.getTeam)
  .put(protect, teamController.updateTeam);

router.route('/teams/:id/members')
  .post(protect, teamController.addMember)
  .put(protect, teamController.updateMemberRole);

router.route('/teams/:id/members/remove')
  .put(protect, teamController.removeMember);

router.route('/teams/search')
  .get(protect, teamController.getTeamsBySportAndLocation);

// Match routes
router.route('/matches')
  .post(protect, authorize('admin', 'coach'), matchController.createMatch)
  .get(protect, matchController.getMatches);

router.route('/matches/:id')
  .get(protect, matchController.getMatch)
  .put(protect, matchController.updateMatchStatus);

router.route('/matches/:id/result')
  .put(protect, matchController.updateMatchResult);

router.route('/matches/:id/events')
  .post(protect, matchController.addMatchEvent);

router.route('/matches/:id/live-update')
  .post(protect, matchController.addLiveUpdate);

// Wallet routes
router.route('/wallet/balance')
  .get(protect, walletController.getWalletBalance);

router.route('/wallet/add')
  .post(protect, walletController.addMoney);

router.route('/wallet/transactions')
  .get(protect, walletController.getTransactionHistory);

router.route('/wallet/transfer')
  .post(protect, walletController.transferMoney);

router.route('/wallet/booking/:bookingId')
  .post(protect, walletController.processBookingPayment);

router.route('/wallet/order/:orderId')
  .post(protect, walletController.processOrderPayment);

// Review routes
router.route('/reviews')
  .post(protect, reviewController.createReview)
  .get(protect, reviewController.getReviews);

router.route('/reviews/user')
  .get(protect, reviewController.getUserReviews);

router.route('/reviews/:id')
  .put(protect, reviewController.updateReview)
  .delete(protect, reviewController.deleteReview);

router.route('/reviews/:id/helpful')
  .post(protect, reviewController.markReviewHelpful);

router.route('/reviews/top')
  .get(protect, reviewController.getTopReviews);

// Notification routes
router.route('/notifications')
  .get(protect, notificationController.getNotifications);

router.route('/notifications/:id')
  .put(protect, notificationController.markAsRead)
  .delete(protect, notificationController.deleteNotification);

router.route('/notifications/read-all')
  .put(protect, notificationController.markAllAsRead);

router.route('/notifications/count')
  .get(protect, notificationController.getNotificationCount);

router.route('/notifications/settings')
  .get(protect, notificationController.getNotificationSettings)
  .put(protect, notificationController.updateNotificationSettings);

// Support routes
router.route('/support/tickets')
  .post(protect, supportController.createTicket)
  .get(protect, supportController.getUserTickets);

router.route('/support/tickets/:id')
  .get(protect, supportController.getTicket)
  .put(protect, supportController.closeTicket);

router.route('/support/tickets/:id/message')
  .post(protect, supportController.addMessage);

// Admin support routes
router.route('/admin/support/tickets')
  .get(protect, authorize('admin'), supportController.getAllTickets);

router.route('/admin/support/tickets/:id')
  .get(protect, authorize('admin'), supportController.getTicketAdmin)
  .put(protect, authorize('admin'), supportController.updateTicketStatus);

router.route('/admin/support/tickets/:id/assign')
  .put(protect, authorize('admin'), supportController.assignTicket);

router.route('/admin/support/tickets/:id/message')
  .post(protect, authorize('admin'), supportController.addAdminMessage);

// Achievement routes
router.route('/achievements')
  .get(protect, achievementController.getAchievements);

router.route('/achievements/user')
  .get(protect, achievementController.getUserAchievements);

router.route('/achievements/:id')
  .get(protect, achievementController.getAchievement);

router.route('/achievements/:id/check')
  .get(protect, achievementController.checkAchievement);

router.route('/achievements/:id/progress')
  .put(protect, achievementController.updateAchievementProgress);

router.route('/achievements/leaderboard')
  .get(protect, achievementController.getAchievementLeaderboard);

// PlayPoint routes
router.route('/playpoints')
  .get(protect, playpointController.getPlayPoints)
  .post(protect, authorize('admin', 'user'), playpointController.createPlayPoint);

router.route('/playpoints/:id')
  .get(protect, playpointController.getPlayPoint);

router.route('/playpoints/:id/availability')
  .get(protect, playpointController.getAvailability);

router.route('/playpoints/:id/book')
  .post(protect, playpointController.bookPlayPoint);

router.route('/playpoints/my')
  .get(protect, playpointController.getOwnerPlayPoints);

router.route('/playpoints/bookings')
  .get(protect, playpointController.getUserPlayPointBookings);

router.route('/playpoints/:id/bookings')
  .get(protect, playpointController.getPlayPointBookings);

// Banner routes
// Public routes - get active banners
router.route('/banners')
  .get(bannerController.getBanners);

router.route('/banners/:id')
  .get(bannerController.getBanner);

router.route('/banners/:id/click')
  .post(bannerController.trackBannerClick);

// Admin routes - manage banners
router.route('/admin/banners')
  .get(protect, authorize('admin'), bannerController.getAllBanners)
  .post(protect, authorize('admin'), bannerController.createBanner);

router.route('/admin/banners/:id')
  .put(protect, authorize('admin'), bannerController.updateBanner)
  .delete(protect, authorize('admin'), bannerController.deleteBanner);

// Admin Shop Analytics routes
const adminShopController = require('../controllers/adminShop.controller');
router.route('/admin/shop/analytics')
  .get(protect, authorize('admin'), adminShopController.getShopAnalytics);

router.route('/admin/shop/stores/:storeId')
  .get(protect, authorize('admin'), adminShopController.getStoreDetails);

router.route('/admin/shop/products/:productId')
  .get(protect, authorize('admin'), adminShopController.getProductDetails);

// Admin Store Approval routes
router.route('/admin/stores/pending')
  .get(protect, authorize('admin'), storeController.getPendingStores);

router.route('/admin/stores/:id/details')
  .get(protect, authorize('admin'), storeController.getStoreDetailsForAdmin);

router.route('/admin/stores/:id/approve')
  .put(protect, authorize('admin'), storeController.approveStore);

router.route('/admin/stores/:id/reject')
  .put(protect, authorize('admin'), storeController.rejectStore);

module.exports = router;