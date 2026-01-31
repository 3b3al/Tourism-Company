const express = require('express');
const {
    getDashboardStats,
    getAllUsers,
    updateUserRole,
    deleteUser
} = require('../controllers/adminController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/users', getAllUsers);
router.route('/users/:id')
    .put(updateUserRole)
    .delete(deleteUser);

module.exports = router;
