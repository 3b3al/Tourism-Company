const Joi = require('joi');

const registerDTO = Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    role: Joi.string().valid('tourist', 'guide', 'admin').default('tourist'),
    phone: Joi.string().required(), // Enhance with regex if needed
    bio: Joi.string().optional().allow('', null),
    languages: Joi.array().items(Joi.string()).optional()
});

const loginDTO = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const updateProfileDTO = Joi.object({
    name: Joi.string().min(2).max(50),
    email: Joi.string().email(),
    phone: Joi.string(),
    bio: Joi.string().allow('', null),
    languages: Joi.array().items(Joi.string())
});

module.exports = {
    registerDTO,
    loginDTO,
    updateProfileDTO
};
