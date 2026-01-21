class HttpResponse {
    /**
     * Send a success response
     * @param {Response} res - Express response object
     * @param {any} data - Data to send
     * @param {string} message - Optional success message
     * @param {number} statusCode - HTTP status code (default 200)
     */
    static success(res, data, message = null, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    /**
     * Send an error response
     * @param {Response} res - Express response object
     * @param {string} message - Error message
     * @param {number} statusCode - HTTP status code (default 400)
     * @param {any} errors - Detailed errors (e.g. validation errors)
     */
    static error(res, message, statusCode = 400, errors = null) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors
        });
    }

    /**
     * Handle caught errors centrally
     * @param {Response} res - Express response object
     * @param {Error} error - The error object caught
     */
    static handleError(res, error) {
        // Check for Mongoose CastError (Invalid ID)
        if (error.name === 'CastError') {
            return this.error(res, 'Resource not found or invalid ID', 400);
        }

        // Mongoose Duplicate Key Error
        if (error.code === 11000) {
            return this.error(res, 'Duplicate field value entered', 409);
        }

        const statusCode = error.statusCode || 500;
        const message = error.message || 'Server Error';

        return this.error(res, message, statusCode);
    }
}

module.exports = HttpResponse;
