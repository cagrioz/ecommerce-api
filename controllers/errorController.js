/* eslint-disable no-console */
const sendErrorDev = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
        // A) Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }

        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err,
        });
    }

    // A) Operational, trusted error
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            page_title: 'Something went wrong!',
            msg: err.message,
        });
    }
    // B) Programming or other unknown error
    // Send generic message
    return res.status(err.statusCode).render('error', {
        page_title: 'Something went wrong!',
        msg: err.response.data.error,
    });
};

const sendErrorProd = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
        // A) Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        // B) Programming or other unknown error: don't leak error details
        // Send generic message
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }

    // A) Operational, trusted error
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            page_title: 'Something went wrong!',
            msg: err.message,
        });
    }
    // B) Programming or other unknown error
    // Send generic message
    return res.status(err.statusCode).render('error', {
        page_title: 'Something went wrong!',
        msg: err.response.data.error,
    });
};

module.exports = (err, req, res, next) => {
    // Default values for statusCode & status
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(err, req, res);
    }
};
