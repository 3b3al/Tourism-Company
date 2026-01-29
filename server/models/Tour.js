const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a tour title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    guide: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Tour must have a guide']
    },
    locations: [{
        name: {
            type: String,
            required: true
        },
        description: String,
        coordinates: {
            lat: Number,
            lng: Number
        },
        order: Number
    }],
    duration: {
        type: Number,
        required: [true, 'Please specify tour duration in hours']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'Please specify maximum group size'],
        min: [1, 'Group size must be at least 1']
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: [0, 'Price cannot be negative']
    },
    currency: {
        type: String,
        default: 'USD'
    },
    difficulty: {
        type: String,
        enum: ['easy', 'moderate', 'difficult'],
        default: 'moderate'
    },
    category: {
        type: String,
        enum: ['cultural', 'adventure', 'nature', 'food', 'historical', 'other'],
        default: 'other'
    },
    images: [{
        type: String,
        ref: 'File'
    }],
    availableDates: [{
        date: {
            type: Date,
            required: true
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: String,
        availableSpots: {
            type: Number,
            required: true
        }
    }],
    included: [{
        type: String
    }],
    excluded: [{
        type: String
    }],
    requirements: [{
        type: String
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for search optimization
tourSchema.index({ title: 'text', description: 'text' });
tourSchema.index({ guide: 1 });
tourSchema.index({ category: 1 });

module.exports = mongoose.model('Tour', tourSchema);
