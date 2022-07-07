// Core modules
const express = require('express');

const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

// Initialize the express router
const router = express.Router();

// Router for /categories
router.route('/').get(authController.protectRoute, cartController.getCart);
router.route('/addItem').post(authController.protectRoute, cartController.addToCart);
router.route('/changeItemQuantity').post(authController.protectRoute, cartController.changeItemQuantity);
router.route('/removeItem').delete(authController.protectRoute, cartController.removeItem);

// Export the router
module.exports = router;
