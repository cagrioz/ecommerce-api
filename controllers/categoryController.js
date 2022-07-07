// Modules
const axios = require('axios');

const catchAsync = require('../utils/catchAsync');

// Base domain
const domain = process.env.API_DOMAIN;

/**
 * @desc This function checks if the given category is subcategory or not
 * @param {Number} id - ID of the category that will be checked if its subcategory
 * @param {Array} arr - Array that has all the categories of the API
 * @return {Boolean} True if its subcategory, False if not
 */
const isSubcategory = (id, arr) => {
    const catObj = arr.find((cat) => cat.id == id);

    return catObj.parent_category_id !== 'root' &&
        catObj.parent_category_id !== 'womens' &&
        catObj.parent_category_id !== 'mens'
        ? true
        : false;
};

/**
 * @desc This function gets all the subcategories of given category id
 * @param {Number} id - ID of the category that its subcategories will be taken
 * @param {Array} arr - Array that has all the categories of the API
 * @return {Array} Array of subcategories of the provided category
 */
const getSubcategories = (id, arr) => {
    let subcategories = [];

    return arr.filter((el) => el.parent_category_id === id);
};

/**
 * @desc This function returns the information of the specific category
 * @param {Number} id - ID of the category that its information will be returned
 * @param {Array} arr - Array that has all the categories of the API
 * @return {Array} Array of object that id is provided will be returned
 */
const getCategoryInfoByID = (id, arr) => {
    return arr.find((el) => el.id === id);
};

/**
 * @desc This function returns all the categories of the API
 * @param {String} secret - API Secret key to get valid response
 * @return {Array} Array of all the categories exist in the API
 */
const fetchAllCategories = async (secret = undefined) => {
    // Store the API URL that get request will be sent to
    const apiURL = `${domain}/api/categories?secretKey=${secret}`;

    // Get request to endpoint
    const result = await axios.get(apiURL);

    // Check if result is empty
    if (result.data.length < 1) {
        result.data = {
            message: 'There is no any category!',
        };
    }

    // Return result
    return result.data;
};

/**
 * @desc Returns specific category by its ID
 * @param {Number} id - ID of the category that its information will be returned
 * @param {String} secret - API Secret key to get valid response
 * @return {Array} Array of object that id is provided will be returned
 */
const fetchCategoryByID = async (id, secret = undefined) => {
    // Store the API URL that get request will be sent to
    const apiURL = `${domain}/api/categories/${id}?secretKey=${secret}`;

    // Get request to endpoint
    const result = await axios.get(apiURL);

    // Check if result is empty
    if (result.data.length < 1) {
        result.data = {
            message: 'There is no category with this id!',
        };
    }

    // Return result
    return result.data;
};

/**
 * @desc Returns the subcategories of the given category id
 * @param {Number} id - ID of the parent ategory that its subcategories will be returned
 * @param {String} secret - API Secret key to get valid response
 * @return {Array} Subcategories of the category given
 */
const fetchCategoryByParentID = async (id, secret = undefined) => {
    // Store the API URL that get request will be sent to
    const apiURL = `${domain}/api/categories/parent/${id}?secretKey=${secret}`;

    // Get request to endpoint
    const result = await axios.get(apiURL);

    // Check if result is empty
    if (result.data.length < 1) {
        result.data = {
            message: 'Category not found!',
        };
    }

    // Return result
    return result.data;
};

/**
 * @desc All the categories exist in the API
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {undefined}
 */
const getAllCategories = catchAsync(async (req, res) => {
    // Destructure queries
    const { secretKey } = req.query;

    // Fetch the data
    const result = await fetchAllCategories(secretKey);

    // Status code is 200 unless not sent with result
    let statusCode = result.message ? 400 : 200;

    // Send JSON response
    res.status(statusCode).json(result);
});

/**
 * @desc Returns specific category by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {undefined}
 */
const getCategoryByID = catchAsync(async (req, res) => {
    // Destructure queries
    const { secretKey } = req.query;
    const { id } = req.params;

    // Fetch the data
    const result = await fetchCategoryByID(id, secretKey);

    // Status code is 200 unless not sent with result
    let statusCode = result.message ? 400 : 200;

    // Send JSON response
    res.status(statusCode).json(result);
});

/**
 * @desc Subcategories of the category given
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {undefined}
 */
const getCategoryByParentID = catchAsync(async (req, res) => {
    // Destructure queries
    const { secretKey } = req.query;
    const { id } = req.params;

    // Fetch the data
    const result = await fetchCategoryByParentID(id, secretKey);

    // Status code is 200 unless not sent with result
    let statusCode = result.message ? 400 : 200;

    // Send JSON response
    res.status(statusCode).json(result);
});

module.exports = {
    fetchAllCategories,
    fetchCategoryByID,
    fetchCategoryByParentID,
    getAllCategories,
    getCategoryByID,
    getCategoryByParentID,
    isSubcategory,
    getSubcategories,
    getCategoryInfoByID,
};
