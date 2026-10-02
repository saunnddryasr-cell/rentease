const express = require('express');
const router = express.Router();

const {
  createRequest,
  getMyRequests,
  updateStatus,
} = require('../controllers/maintenanceController');

const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createRequest);
router.get('/my', protect, getMyRequests);
router.put('/:id/status', protect, authorize('vendor', 'admin'), updateStatus);

module.exports = router;