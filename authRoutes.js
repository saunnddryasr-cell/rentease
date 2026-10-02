const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { register, login, getMe, updateMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('phone').notEmpty().withMessage('Phone required'),
  ],
  register
);

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

module.exports = router;