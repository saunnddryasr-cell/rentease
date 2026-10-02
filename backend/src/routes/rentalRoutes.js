const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/auth');

// Public
router.get('/', getProducts);
router.get('/:id', getProductById);

// Vendor/Admin
router.get('/vendor/mine', protect, authorize('vendor', 'admin'), getMyProducts);
router.post('/', protect, authorize('vendor', 'admin'), createProduct);
router.put('/:id', protect, authorize('vendor', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('vendor', 'admin'), deleteProduct);

module.exports = router;