const HttpResponse = require('../utils/HttpResponse');
const HttpRequest = require('../utils/HttpRequest');

/**
 * Middleware to validate request data
 * @param {Object|Object} schemas - Joi schema (for body only) OR object { body, query, params }
 */
const validate = (schemas) => {
    return (req, res, next) => {
        // Normalize input: if pass single schema, assume it is for body (backward compatibility)
        const config = schemas.isJoi ? { body: schemas } : schemas;

        const errors = [];

        // Validate Body
        if (config.body) {
            const { error, value } = HttpRequest.validate(req.body, config.body);
            if (error) {
                error.details.forEach(detail => errors.push({
                    field: `body.${detail.path.join('.')}`,
                    message: detail.message.replace(/['"]/g, '')
                }));
            } else {
                req.body = value;
            }
        }

        // Validate Query
        if (config.query) {
            const { error, value } = HttpRequest.validate(req.query, config.query);
            if (error) {
                error.details.forEach(detail => errors.push({
                    field: `query.${detail.path.join('.')}`,
                    message: detail.message.replace(/['"]/g, '')
                }));
            } else {
                req.query = value;
            }
        }

        // Validate Params
        if (config.params) {
            const { error, value } = HttpRequest.validate(req.params, config.params);
            if (error) {
                error.details.forEach(detail => errors.push({
                    field: `params.${detail.path.join('.')}`,
                    message: detail.message.replace(/['"]/g, '')
                }));
            } else {
                req.params = value;
            }
        }

        if (errors.length > 0) {
            return HttpResponse.error(
                res,
                'Validation failed',
                400,
                errors
            );
        }

        next();
    };
};

module.exports = validate;
