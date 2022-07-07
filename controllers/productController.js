// Modules
const axios = require('axios');

const Product = require('../models/productModel');
const CartItem = require('../models/cartItemModel');

const catchAsync = require('../utils/catchAsync');

// Base domain
const domain = process.env.API_DOMAIN;

/**
 * @desc This function gets the value of attributes by their codes.
 * @param {Object} product_data - Generic JSON data of an specific product
 * @param {String} attrName - Name of the attribute in the API that its real value will be returned.
 * @param {String} attrKey - Attribute key that it's value will be returned.
 * @return {String} Attribute real value will be returned. Ex: color: C43 -> Beige
 */
const getAttributeValueByID = (product_data, attrName, attrKey) => {
    return product_data.variation_attributes.find((el) => el.id == attrName).values.find((el) => el.value === attrKey)
        .name;
};

/**
 * @desc This function sorts the variants by their attributes such as color, size, etc.
 * @param {String} product - Product that its variants will be sorted
 * @return {undefined}
 */
const sortProductVariants = (product) => {
    product.variants.sort((a, b) => (a.variation_values.size > b.variation_values.size ? 1 : -1));
    product.variants.sort((a, b) => (a.variation_values.accessorySize > b.variation_values.accessorySize ? 1 : -1));
    product.variants.sort((a, b) => (a.variation_values.color > b.variation_values.color ? 1 : -1));
};

/**
 * @desc This function makes get request the get category data of given ID.
 * @param {String} categoryID - ID of the category that will be requested
 * @param {String} secret - Secret Key of the OSF Academy API
 * @return {Object} Category information object will be returned
 */
const fetchProductByCategoryID = async (categoryID, secret) => {
    // Store the API URL that get request will be sent to
    const apiURL = `${domain}/api/products/product_search?primary_category_id=${categoryID}&secretKey=${secret}`;

    // Get request to endpoint
    const result = await axios.get(apiURL);

    // Check if result is empty
    if (result.data.length < 1) {
        result.data = {
            message: 'There is no any product!',
        };
    }

    // Return result
    return result.data;
};

/**
 * @desc This function makes get request the get product data of given ID.
 * @param {String} productID - ID of the product that will be requested
 * @param {String} secret - Secret Key of the OSF Academy API
 * @return {Object} Product information object will be returned
 */
const fetchProductByProductID = async (productID, secret) => {
    // Store the API URL that get request will be sent to
    const apiURL = `${domain}/api/products/product_search?id=${productID}&secretKey=${secret}`;

    // Get request to endpoint
    const result = await axios.get(apiURL);

    // Check if result is empty
    if (result.data.length < 1) {
        result.data = {
            message: 'There is no any product!',
        };
    }

    // Return result
    return result.data;
};

/**
 * @desc This function makes get request the get product data by depending upon the request URL.
 * @param {Object} path - Request path
 * @return {undefined}
 */
const fetchProductByURL = async (path) => {
    // Store the API URL that get request will be sent to
    const apiURL = domain + path;

    // Get request to endpoint
    const result = await axios.get(apiURL);

    // Check if result is empty
    if (result.data.length < 1) {
        result.data = {
            message: 'There is no any product!',
        };
    }

    // Return result
    return result.data;
};

/**
 * @desc This function gets product data by depending upon the current request URL.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
const getProductByURL = catchAsync(async (req, res, next) => {
    // Fetch the data
    const result = await fetchProductByURL(req.originalUrl);

    // Status code is 200 unless not sent with result
    let statusCode = result.message ? 400 : 200;

    // Send JSON response
    res.status(statusCode).json(result);
});

/**
 * @desc This function gets the specific variant information of an product with the given variant id, then returns an CartItem model for EJS document.
 * @param {Object} product_data - Generic JSON data of an specific product
 * @param {String} variant_id - Variant ID of the specific product data given.
 * @return {CartItem} Instace of CartItem class that its data will be used in EJS document.
 */
const getProductVariantById = (product_data, variant_id, quantity) => {
    // Destructure joint props
    const { id, name, currency, short_description, long_description, variation_attributes } = product_data;

    // Get variant by variant ID
    const foundVariant = product_data.variants.find((el) => el.product_id === variant_id);

    // Get specific props of the variant
    let color = foundVariant ? foundVariant.variation_values.color : -1;
    let accessorySize = foundVariant ? foundVariant.variation_values.accessorySize : -1;
    let price = foundVariant ? foundVariant.price : -1;
    let size = foundVariant ? foundVariant.size : -1;

    // Get variant specific images
    let images = product_data.image_groups.filter((el) => el.variation_value === color && el.view_type === 'large')[0];

    // If image not found then take the first image inside the dataset
    if (!images) {
        images = product_data.image_groups[0].images;
    } else {
        images = images.images;
    }

    // Get value of attribute ID's
    let accSizeName, colorName;
    if (color) colorName = getAttributeValueByID(product_data, 'color', color);
    if (accessorySize) accSizeName = getAttributeValueByID(product_data, 'accessorySize', accessorySize);

    return new CartItem(
        id,
        variant_id,
        name,
        color,
        colorName,
        size,
        accessorySize,
        accSizeName,
        currency,
        price,
        images,
        short_description,
        long_description,
        variation_attributes,
        quantity
    );
};

/**
 * @desc This function gets the specific variant information of an product with the given attributes, then returns an product model for EJS document.
 * @param {Object} product_data - Generic JSON data of an specific product
 * @param {String} color - Color attribute that is taken from the request query.
 * @param {String} size - Size attribute that is taken from the request query.
 * @param {String} accessorySize - Accessory Size attribute that is taken from the request query.
 * @return {Product} Instace of Product class that its data will be used in EJS document.
 */
const getProductVariantByAttr = (product_data, color, size, accessorySize) => {
    // Destructure joint props
    const { id, name, currency, short_description, long_description, variation_attributes } = product_data;

    // If variant color not specified, get the first variant
    if (!color) color = product_data.variants[0].variation_values.color;

    // If variant size not specified, get the first variant
    if (!size) size = product_data.variants[0].variation_values.size;

    // Get variant specific images
    let images = product_data.image_groups.filter((el) => el.variation_value === color && el.view_type === 'large')[0];

    // If image not found then take the first image inside the dataset
    if (!images) {
        images = product_data.image_groups[0].images;
    } else {
        images = images.images;
    }

    // If variant with certain size and color not found then its out of stock
    const foundVariant = product_data.variants.find(
        (el) =>
            el.variation_values.color == color &&
            el.variation_values.size == size &&
            el.variation_values.accessorySize == accessorySize
    );

    let price = foundVariant ? foundVariant.price : -1;
    let variant_id = foundVariant ? foundVariant.product_id : -1;

    // Get name of the color from its code
    // Get value of attribute ID's
    let accSizeName, colorName;
    if (color) colorName = getAttributeValueByID(product_data, 'color', color);
    if (accessorySize) accSizeName = getAttributeValueByID(product_data, 'accessorySize', accessorySize);

    // Create product interface
    return new Product(
        id,
        variant_id,
        name,
        color,
        colorName,
        size,
        accessorySize,
        accSizeName,
        currency,
        price,
        images,
        short_description,
        long_description,
        variation_attributes
    );
};

module.exports = {
    sortProductVariants,
    fetchProductByCategoryID,
    fetchProductByProductID,
    getProductByURL,
    getProductVariantByAttr,
    getProductVariantById,
};
