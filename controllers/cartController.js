// Modules
const axios = require('axios');

const productController = require('./productController');

const catchAsync = require('../utils/catchAsync');

// Base domain
const domain = process.env.API_DOMAIN;

/**
 * @desc This function fetchs the cart data from the OSF API
 * @param {String} authToken - Token that will be sent in request header for authorization
 * @param {String} secret - Secret key
 * @return {undefined}
 */
const fetchCart = async (authToken, secret = undefined) => {
    // Store the API URL that get request will be sent to
    const apiURL = `${domain}/api/cart?secretKey=${secret}`;

    // Get request to endpoint
    const result = await axios.get(apiURL, {
        headers: {
            Authorization: authToken,
        },
    });

    // Check if result is empty
    if (result.data.length < 1) {
        result.data = {
            message: 'There is no product in cart!',
        };
    }

    // Return result
    return result.data;
};

/**
 * @desc This function fetchs all the products that are inside the Cart
 * @param {String} cart - Token that will be sent in request header for authorization
 * @return {Array} Products that are inside the cart. (Array of objects).
 */
const fetchProductsInCart = async (cart) => {
    let promises = [];
    let products = [];
    let cartItems = [];

    if (cart.length < 1) {
        return [];
    }

    // Push each products promise into the array
    cart.forEach((cartItem) => {
        promises.push(productController.fetchProductByProductID(cartItem.productId, process.env.JWT_SECRET));
    });

    // Do all the requests
    products = await Promise.all(promises);

    // Flatten array to 1 level
    products = products.flat(1);

    // For each cart item, get the specific variant's data
    cart.forEach((el, i) => {
        const { color, size, accessorySize } = el.variant.variation_values;

        // Push result to cartItems array
        cartItems.push(productController.getProductVariantById(products[i], el.variant.product_id, el.quantity));
    });

    // Return cart items
    return cartItems;
};

/**
 * @desc Returns the cart data as a JSON reponse
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {undefined}
 */
const getCart = catchAsync(async (req, res) => {
    // Destructure queries
    const { secretKey } = req.query;

    let authToken;
    if (req.cookies.token) {
        authToken = `Bearer ${req.cookies.token}`;
    }

    // Fetch the data
    const result = await fetchCart(authToken, secretKey);

    // Status code is 200 unless not sent with result
    let statusCode = result.message ? 400 : 200;

    // Send JSON response
    res.status(statusCode).json(result);
});

/**
 * @desc Adds product with given information into the cart
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {undefined}
 */
const addToCart = catchAsync(async (req, res) => {
    const apiURL = `${domain}/api/cart/addItem`;

    // Get auth token
    let authToken;
    if (req.cookies.token) {
        authToken = `Bearer ${req.cookies.token}`;
    }

    // Destructure user data from request body
    const { productId, variantId, quantity } = req.body;

    // Request the user data
    const result = await axios.post(
        apiURL,
        {
            secretKey: process.env.JWT_SECRET,
            productId,
            variantId,
            quantity,
        },
        {
            headers: {
                Authorization: authToken,
            },
        }
    );

    // Send JSON Response
    res.status(201).json({
        result: result.data,
    });
});

/**
 * @desc Changes quantity of an item that is in the cart
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {undefined}
 */
const changeItemQuantity = catchAsync(async (req, res) => {
    const apiURL = `${domain}/api/cart/changeItemQuantity`;

    // Get auth token
    let authToken;
    if (req.cookies.token) {
        authToken = `Bearer ${req.cookies.token}`;
    }

    // Destructure user data from request body
    const { productId, variantId, quantity } = req.body;

    // Request the user data
    const result = await axios.post(
        apiURL,
        {
            secretKey: process.env.JWT_SECRET,
            productId,
            variantId,
            quantity,
        },
        {
            headers: {
                Authorization: authToken,
            },
        }
    );

    // Send JSON Response
    res.status(201).json({
        result: result.data,
    });
});

const removeItem = catchAsync(async (req, res) => {
    const apiURL = `${domain}/api/cart/removeItem`;

    // Get auth token
    let authToken;
    if (req.cookies.token) {
        authToken = `Bearer ${req.cookies.token}`;
    }

    // Destructure user data from request body
    const { productId, variantId } = req.body;

    // Remove item with given information from the cart
    const result = await axios({
        url: apiURL,
        method: 'delete',
        params: {
            secretKey: process.env.JWT_SECRET,
            productId: productId,
            variantId: variantId,
        },
        headers: {
            Authorization: authToken,
        },
    });

    // Send JSON Response
    res.status(201).json({
        result: result.data,
    });
});

// Export modules
module.exports = {
    fetchCart,
    fetchProductsInCart,
    getCart,
    addToCart,
    changeItemQuantity,
    removeItem,
};
