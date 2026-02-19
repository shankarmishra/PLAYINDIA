const express = require('express');
const router = express.Router();
const { authenticate: protect, authorize } = require('../middleware/auth.middleware');
const {
    getBanners,
    getBanner,
    createBanner,
    updateBanner,
    deleteBanner,
    trackBannerClick,
    getAllBanners
} = require('../controllers/banner.controller');

// Public routes
router.get('/', getBanners);
router.get('/:id', getBanner);
router.post('/:id/click', trackBannerClick);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/all', getAllBanners);
router.post('/', createBanner);
router.put('/:id', updateBanner);
router.delete('/:id', deleteBanner);

module.exports = router;
