const Joi = require('joi');

const createTourDTO = Joi.object({
    title: Joi.string().required().trim().min(5).max(100),
    description: Joi.string().required().min(20),
    category: Joi.string().required().valid('adventure', 'cultural', 'relaxation', 'historical'),
    difficulty: Joi.string().required().valid('easy', 'medium', 'hard'),
    price: Joi.number().required().min(0),
    duration: Joi.number().required().min(0.5),
    maxGroupSize: Joi.number().required().min(1),
    locations: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            description: Joi.string().optional(),
            order: Joi.number().optional()
        })
    ).min(1).required(),
    startDates: Joi.array().items(Joi.date()).optional(), // Assuming specific dates
    availableDates: Joi.array().items(
        Joi.object({
            date: Joi.date().required(),
            startTime: Joi.string().required(), // e.g., "10:00 AM"
            availableSpots: Joi.number().required()
        })
    ).optional(),
    images: Joi.array().items(Joi.string()).optional(),
    startLocation: Joi.string().optional(),
    included: Joi.array().items(Joi.string()).optional(),
    excluded: Joi.array().items(Joi.string()).optional()
});

const updateTourDTO = Joi.object({
    title: Joi.string().trim().min(5).max(100),
    description: Joi.string().min(20),
    category: Joi.string().valid('adventure', 'cultural', 'relaxation', 'historical'),
    difficulty: Joi.string().valid('easy', 'medium', 'hard'),
    price: Joi.number().min(0),
    duration: Joi.number().min(0.5),
    maxGroupSize: Joi.number().min(1),
    locations: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            description: Joi.string().optional(),
            order: Joi.number().optional()
        })
    ).min(1),
    startDates: Joi.array().items(Joi.date()),
    availableDates: Joi.array().items(
        Joi.object({
            date: Joi.date().required(),
            startTime: Joi.string().required(),
            availableSpots: Joi.number().required()
        })
    ),
    images: Joi.array().items(Joi.string()),
    startLocation: Joi.string(),
    included: Joi.array().items(Joi.string()),
    excluded: Joi.array().items(Joi.string()),
    isActive: Joi.boolean()
});

const getToursQueryDTO = Joi.object({
    category: Joi.string().valid('adventure', 'cultural', 'relaxation', 'historical'),
    difficulty: Joi.string().valid('easy', 'medium', 'hard'),
    search: Joi.string().allow('', null),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    // Sorting and pagination fields if needed
    sort: Joi.string(),
    page: Joi.number().min(1),
    limit: Joi.number().min(1)
});

module.exports = {
    createTourDTO,
    updateTourDTO,
    getToursQueryDTO
};
