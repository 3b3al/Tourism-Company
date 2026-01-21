class HttpRequest {
    /**
     * Validate data against a Joi schema
     * @param {Object} data - Data to validate
     * @param {Object} schema - Joi schema
     * @returns {Object} result - { value, error }
     */
    static validate(data, schema) {
        if (!schema) return { value: data, error: null };

        const options = {
            abortEarly: false, // Include all errors
            allowUnknown: false, // Reject unknown fields
            stripUnknown: false // Do not strip, just reject
        };

        return schema.validate(data, options);
    }
}

module.exports = HttpRequest;
