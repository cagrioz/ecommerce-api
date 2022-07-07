// Worker for categories
const { fetchAllCategories } = require('../controllers/categoryController');

// Utils
const catchAsync = require('../utils/catchAsync');

/**
 * @desc If categories stored in the locals, gets the main categories and sets these main categories to locals.
 * If there are no categories in locals, makes new request to API.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
const loadMenu = catchAsync(async (req, res, next) => {
    // Get categories from locals
    const { categories } = res.locals;

    // If locals not fulfilled fetch else get from locals
    const allCategories = !categories ? await fetchAllCategories(process.env.JWT_SECRET) : categories;

    // Filter categories that which has "root" parent id
    const menuItems = allCategories.filter((el) => el.parent_category_id === 'root');

    // Return the result
    res.locals.menuItems = menuItems;
    res.locals.user = req.user;

    // Next middleware in case of success
    next();
});

module.exports = loadMenu;
