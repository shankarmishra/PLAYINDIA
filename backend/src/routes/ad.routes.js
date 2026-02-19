const express = require('express');
const router = express.Router();
const { authenticate: protect, authorize } = require('../middleware/auth.middleware');
const {
    getStoreAds,
    getAd,
    createAd,
    updateAd,
    deleteAd,
    submitAd,
    toggleAdStatus,
    getActiveAds,
    trackClick,
    trackView,
    getAllAds,
    approveAd,
    rejectAd
} = require('../controllers/ad.controller');

// Public routes
router.get('/active', getActiveAds);
router.post('/:id/click', trackClick);
router.post('/:id/view', trackView);

// Protected routes
router.use(protect);

// Store owner routes
router.get('/store', authorize('seller'), getStoreAds);
router.post('/', authorize('seller'), createAd);
router.get('/:id', authorize('seller'), getAd);
router.put('/:id', authorize('seller'), updateAd);
router.delete('/:id', authorize('seller'), deleteAd);
router.post('/:id/submit', authorize('seller'), submitAd);
router.post('/:id/toggle', authorize('seller'), toggleAdStatus);

// Admin routes
router.get('/admin/all', authorize('admin'), getAllAds);
router.put('/:id/approve', authorize('admin'), approveAd);
router.put('/:id/reject', authorize('admin'), rejectAd);

module.exports = router;
