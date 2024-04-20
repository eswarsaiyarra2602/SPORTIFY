const express = require('express');
const router = express.Router();
const { restrictToLoggedInUserOnly } = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');

// Route to get user's cart
router.get('/cart-items', restrictToLoggedInUserOnly, cartController.getUserCart);

// Route to add item to user's cart
router.post('/add-to-cart', restrictToLoggedInUserOnly, cartController.addItemToCart);

// Route to remove item from user's cart
router.delete('/remove-cart/:itemId', restrictToLoggedInUserOnly, cartController.removeItemFromCart);

module.exports = router;
