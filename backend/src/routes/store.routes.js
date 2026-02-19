const express = require('express');
const router = express.Router();
const { authenticate: protect, authorize } = require('../middleware/auth.middleware');
const {
    getStores,
    getMyStoreProfile,
    getStoreProfile,
    getStoreDashboard,
    getStoreProducts,
    addProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/store.controller');

// Public routes
router.get('/', getStores);
router.get('/:id', getStoreProfile);
router.get('/:id/products', getStoreProducts);

// Protected routes
router.use(protect);

// Store owner routes
router.get('/profile/me', getMyStoreProfile);
router.get('/dashboard', authorize(['seller', 'store']), getStoreDashboard);
router.post('/:id/products', authorize(['seller', 'store']), addProduct);
router.put('/products/:id', authorize(['seller', 'store']), updateProduct);
router.delete('/products/:id', authorize(['seller', 'store']), deleteProduct);

module.exports = router;
