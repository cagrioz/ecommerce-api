/**
 * OSF Backend Academy REST API.
 * @author Cagri Ozarpaci <devcagri@gmail.com>
 * @version 1.0.0
 * @see {@link https://github.com/cagrioz/osf-glorious-store}
 */

// Error Tracking and Monitoring Tools/APIs
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const globalErrorHandler = require('./controllers/errorController');

// Core Modules
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Routers
// - API
const productRouter = require('./routes/productRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const authRouter = require('./routes/authRoutes');
const cartRouter = require('./routes/cartRoutes');
// - View
const viewRouter = require('./routes/viewRoutes');

// Utils
const AppError = require('./utils/appError');
const loadMenu = require('./utils/loadMenu');
const loadCategories = require('./utils/loadCategories');

// Init Express
const app = express();

// Init Sentry
Sentry.init({
    dsn: 'SENTRY_API_KEY',
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// Set security HTTP headers
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
            baseUri: ["'self'"],
            fontSrc: ["'self'", 'https:', 'http:', 'data:'],
            scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
        },
    })
);

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(cookieParser());

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());
// Access-Control-Allow-Origin *
// api.natours.com, front-end natours.com

app.options('*', cors());

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Load All Categories (Performance optimization)
app.use(loadCategories);

// Load Menu
app.use(loadMenu);

// Homepage render
app.use('/', viewRouter);

// API Routers
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);

// Sentry Handler - before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// 404 Page -- For all types of requests
app.all('*', (req, res, next) => {
    next(new AppError('404 Page Not Found!', 404));
});

// Error handling middleware
app.use(globalErrorHandler);

// Export Express App to allow routes to access
module.exports = app;
