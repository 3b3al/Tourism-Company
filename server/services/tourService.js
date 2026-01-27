const Tour = require('../models/Tour');
const AppError = require('../utils/AppError');

const appConfig = require('../config/appConfig');

class TourService {
    // Helper to map images to full URLs
    _mapTourImages(tour) {
        if (!tour) return tour;

        const tourObj = tour.toObject ? tour.toObject() : tour;

        if (tourObj.images && tourObj.images.length > 0) {
            tourObj.images = tourObj.images.map(img =>
                `${appConfig.baseUrl}/api/files/${img}`
            );
        }

        if (tourObj.guide && tourObj.guide.avatar) {
            tourObj.guide.avatar = `${appConfig.baseUrl}/api/files/${tourObj.guide.avatar}`;
        }

        return tourObj;
    }

    // Get all tours with filtering
    async getAllTours(queryParams) {
        const { category, difficulty, search, minPrice, maxPrice } = queryParams;

        let query = { isActive: true };

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by difficulty
        if (difficulty) {
            query.difficulty = difficulty;
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Text search
        if (search) {
            query.$text = { $search: search };
        }

        const tours = await Tour.find(query)
            .populate('guide', 'name email rating languages avatar')
            .populate('images')
            .sort('-createdAt');

        return tours.map(tour => this._mapTourImages(tour));
    }

    // Get single tour by ID
    async getTourById(id) {
        const tour = await Tour.findById(id)
            .populate('guide', 'name email rating languages avatar bio reviewCount')
            .populate('images');

        return this._mapTourImages(tour);
    }

    // Create new tour
    async createTour(tourData, userId, files) {
        // Add guide from logged in user
        tourData.guide = userId;

        // Handle file uploads if present
        if (files && files.length > 0) {
            const fileService = require('./fileService');
            const fileDocuments = await fileService.uploadFiles(files, userId);
            tourData.images = fileDocuments.map(file => file._id);
        }

        const tour = await Tour.create(tourData);
        // Populate and map images for the response
        await tour.populate('images');
        return this._mapTourImages(tour);
    }

    // Update tour
    async updateTour(id, updateData, user) {
        let tour = await Tour.findById(id);

        if (!tour) {
            throw new AppError('Tour not found', 404);
        }

        // Make sure user is tour owner
        if (tour.guide.toString() !== user.id && user.role !== 'admin') {
            throw new AppError('Not authorized to update this tour', 403);
        }

        tour = await Tour.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        return this._mapTourImages(tour);
    }

    // Delete tour
    async deleteTour(id, user) {
        const tour = await Tour.findById(id);

        if (!tour) {
            throw new AppError('Tour not found', 404);
        }

        // Make sure user is tour owner
        if (tour.guide.toString() !== user.id && user.role !== 'admin') {
            throw new AppError('Not authorized to delete this tour', 403);
        }

        await tour.deleteOne();
        return true;
    }

    // Get tours by guide
    async getToursByGuide(guideId) {
        const tours = await Tour.find({
            guide: guideId,
            isActive: true
        }).sort('-createdAt');

        return tours.map(tour => this._mapTourImages(tour));
    }
}

module.exports = new TourService();
