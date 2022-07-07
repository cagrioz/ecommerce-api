// Core modules
const express = require('express');
const authController = require('../controllers/authController');

// Initialize the express router
const router = express.Router();

// Router for /product_search
router.route('/signup').post(authController.signup);
router.route('/signin').post(authController.signin);
router.route('/logout').get(authController.logout);

// Export the router
module.exports = router;
