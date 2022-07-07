// Core modules
const express = require('express');
const categoryController = require('../controllers/categoryController');

// Initialize the express router
const router = express.Router();

// Router for /categories
router.route('/').get(categoryController.getAllCategories);

// Get category by ID
router.route('/:id').get(categoryController.getCategoryByID);

// Get category by parent ID
router.route('/parent/:id').get(categoryController.getCategoryByParentID);

// Export the router
module.exports = router;
