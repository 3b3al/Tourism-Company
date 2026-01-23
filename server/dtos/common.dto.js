const Joi = require('joi');

const idParamDTO = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'Invalid ID format'
    })
});

const guideIdParamDTO = Joi.object({
    guideId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
});

module.exports = {
    idParamDTO,
    guideIdParamDTO
};
