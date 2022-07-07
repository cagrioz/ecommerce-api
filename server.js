// Import dotenv
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
    // eslint-disable-next-line no-console
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    // eslint-disable-next-line no-console
    console.log(err.name, err.message);

    // Uncaught exception, shut down the application
    process.exit(1);
});

// Load config file
dotenv.config({ path: './config.env' });

// Get the Express app
const app = require('./app');

// Set the port
const port = process.env.PORT || 3000;

// Listen the server
const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
    // eslint-disable-next-line no-console
    console.log('UNHANDLED REJECTION! Shutting down...');
    // eslint-disable-next-line no-console
    console.log(err.name, err.message);

    // Finish all the requests are pending
    server.close(() => {
        // Uncaught exception, shut down the application
        process.exit(1);
    });
});
