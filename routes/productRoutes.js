// Core modules
const express = require('express');
const productController = require('../controllers/productController');

// Initialize the express router
const router = express.Router();

// Router for /product_search
router.route('/product_search').get(productController.getProductByURL);

// Export the router
module.exports = router;
