// Category Model
const Category = require('../models/categoryModel');

// Worker for categories
const { fetchAllCategories } = require('../controllers/categoryController');

// Error handler
const catchAsync = require('../utils/catchAsync');

/**
 * @desc Fetchs all the categories that exist from the API, then stores into res.locals
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
const loadCategories = catchAsync(async (req, res, next) => {
    // Get all the categories
    const result = await fetchAllCategories(process.env.JWT_SECRET);

    // Strore categories into locals
    res.locals.categories = result.map((el) => {
        // Destructure the properties needed
        const { id, name, parent_category_id, page_title, page_description, image } = el;

        // Create new category with model
        const newCategory = new Category(id, name, parent_category_id, page_title, page_description, image);

        // Return object
        return newCategory;
    });

    // Next middleware in case of success
    next();
});

// Export module
module.exports = loadCategories;
