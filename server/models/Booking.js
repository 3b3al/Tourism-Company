const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking must belong to a tour']
    },
    tourist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a tourist']
    },
    guide: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Booking must have a guide']
    },
    selectedDate: {
        type: Date,
        required: [true, 'Please select a date']
    },
    selectedTime: {
        type: String,
        required: [true, 'Please select a time']
    },
    numberOfPeople: {
        type: Number,
        required: [true, 'Please specify number of people'],
        min: [1, 'At least 1 person required']
    },
    totalPrice: {
        type: Number,
        required: [true, 'Total price is required']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    },
    specialRequests: {
        type: String,
        maxlength: [500, 'Special requests cannot exceed 500 characters']
    },
    contactPhone: {
        type: String,
        required: [true, 'Contact phone is required']
    },
    contactEmail: {
        type: String,
        required: [true, 'Contact email is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
bookingSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Indexes for efficient queries
bookingSchema.index({ tourist: 1, createdAt: -1 });
bookingSchema.index({ guide: 1, selectedDate: 1 });
bookingSchema.index({ tour: 1, selectedDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
