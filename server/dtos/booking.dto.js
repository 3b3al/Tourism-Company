const Joi = require('joi');

const createBookingDTO = Joi.object({
    tourId: Joi.string().required(), // Assuming ObjectId string
    selectedDate: Joi.date().required(),
    selectedTime: Joi.string().required(),
    numberOfPeople: Joi.number().required().min(1),
    specialRequests: Joi.string().allow('', null).optional(),
    contactPhone: Joi.string().required(),
    contactEmail: Joi.string().email().required()
});

const updateBookingStatusDTO = Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed').optional(),
    paymentStatus: Joi.string().valid('pending', 'paid', 'failed').optional()
}).min(1); // At least one field must be provided

module.exports = {
    createBookingDTO,
    updateBookingStatusDTO
};
