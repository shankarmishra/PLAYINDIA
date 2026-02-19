const logger = require('../utils/logger');

/**
 * Middleware to log API requests with method, path, status, and response time.
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Once the request is finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        const { method, originalUrl, ip } = req;
        const { statusCode } = res;

        // Determine status color/symbol
        let statusIcon = 'ℹ️';
        if (statusCode >= 500) statusIcon = '💥';
        else if (statusCode >= 400) statusIcon = '⚠️';
        else if (statusCode >= 200) statusIcon = '✅';

        const logMessage = `${statusIcon} [${method}] ${originalUrl} - ${statusCode} (${duration}ms) - IP: ${ip}`;

        // Log to console for immediate visibility
        console.log(logMessage);

        // Also log via winston for file persistence
        logger.info(logMessage);
    });

    next();
};

module.exports = requestLogger;
