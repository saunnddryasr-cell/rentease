const express = require('express');
const router = express.Router();

const {
  getDashboardStats,
  getAllUsers,
  getAllRentals,
  getAllDeliveries,
  updateDeliveryStatus,
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/rentals', getAllRentals);
router.get('/deliveries', getAllDeliveries);
router.put('/deliveries/:id', updateDeliveryStatus);

module.exports = router;