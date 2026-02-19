const express = require('express');
const router = express.Router();
const { authenticate: protect, authorize } = require('../middleware/auth.middleware');
const {
    createTicket,
    getUserTickets,
    getTicket,
    closeTicket,
    addMessage,
    getAllTickets,
    getTicketAdmin,
    updateTicketStatus,
    assignTicket,
    addAdminMessage
} = require('../controllers/support.controller');

// All support routes are protected
router.use(protect);

// User routes
router.post('/tickets', createTicket);
router.get('/tickets', getUserTickets);
router.get('/tickets/:id', getTicket);
router.put('/tickets/:id/close', closeTicket);
router.post('/tickets/:id/message', addMessage);

// Admin routes
router.get('/admin/tickets', authorize('admin'), getAllTickets);
router.get('/admin/tickets/:id', authorize('admin'), getTicketAdmin);
router.put('/admin/tickets/:id/status', authorize('admin'), updateTicketStatus);
router.put('/admin/tickets/:id/assign', authorize('admin'), assignTicket);
router.post('/admin/tickets/:id/message', authorize('admin'), addAdminMessage);

module.exports = router;
