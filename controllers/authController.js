const jwt = require('jsonwebtoken');
const axios = require('axios');

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const domain = process.env.API_DOMAIN;

/**
 * @desc Stores given token in the cookies with a given name
 * @param {Object} res - Express response object
 * @param {String} token - Token that will be saved into cookie
 * @param {String} tokenName - Name that will define that token in the cookies
 * @return {undefined}
 */
const storeTokenIntoCookies = (res, token, tokenName) => {
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie(tokenName, token, cookieOptions);
};

/**
 * @desc Creates new user object with the data given in the request body, and makes post request to API
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
exports.signup = catchAsync(async (req, res, next) => {
    const apiURL = domain + req.originalUrl;

    // Destructure user data from request body
    const { name, email, password } = req.body;

    // Create new User Model
    const newUser = new User(process.env.JWT_SECRET, name, email, password);

    // Post the new user data
    const result = await axios.post(apiURL, newUser);

    // Send data as a JSON response
    res.status(201).json({
        result: result.data,
    });
});

/**
 * @desc Takes the credentials from the request body and sends POST request to API for signing in
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
exports.signin = catchAsync(async (req, res, next) => {
    const apiURL = domain + req.originalUrl;

    const { email, password } = req.body;

    // 1) If email & password exist
    if (!email || !password) {
        return next(new AppError('Please enter your email and password', 400));
    }

    // Request the user data
    const result = await axios.post(apiURL, {
        secretKey: process.env.JWT_SECRET,
        email,
        password,
    });

    // Destructure name
    const { name } = result.data.user;

    // Create token
    const jwtToken = jwt.sign({ name, email, password }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Save the cookie
    storeTokenIntoCookies(res, result.data.token, 'token');
    storeTokenIntoCookies(res, jwtToken, 'jwt');

    // Send data as a JSON response
    res.status(200).json({
        result: result.data,
    });
});

/**
 * @desc Takes the credentials from the request body and sends POST request to API for signing in
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
exports.logout = (req, res) => {
    // Change JWT token cookie to loggedout
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10),
        httpOnly: true,
    });

    // Send back feedback
    res.status(200).json({ status: 'success' });
};

/**
 * @desc Authorization functionality, protects the routes that requires to login event
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
exports.protectRoute = catchAsync(async (req, res, next) => {
    let token = req.cookies.jwt;

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to grant access.', 401));
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, currentUser) => {
        if (err) return next(new AppError('The user belonging to this token does no longer exist.', 401));

        // Set the current user
        req.user = currentUser;
        res.locals.user = currentUser;
    });

    // -- Means there is no error
    // Move onto next middleware
    next();
});

// Only for rendered pages, no errors!
/**
 * @desc Takes the credentials from the request body and sends POST request to API for signing in
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        // Verify the token
        jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, currentUser) => {
            if (err) return next(new AppError('The user belonging to this token does no longer exist.', 401));

            // Set the current user
            res.locals.user = currentUser;
        });

        // Authorization is successfull
        return next();
    }
    next();
};
