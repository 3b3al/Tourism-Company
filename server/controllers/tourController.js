const tourService = require('../services/tourService');
const HttpResponse = require('../utils/HttpResponse');

// @desc    Get all tours
// @route   GET /api/tours
// @access  Public
exports.getTours = async (req, res) => {
    try {
        const tours = await tourService.getAllTours(req.query);

        return HttpResponse.success(res, {
            count: tours.length,
            tours
        });
    } catch (error) {
        return HttpResponse.handleError(res, error);
    }
};

// @desc    Get single tour
// @route   GET /api/tours/:id
// @access  Public
exports.getTour = async (req, res) => {
    try {
        const tour = await tourService.getTourById(req.params.id);

        if (!tour) {
            return HttpResponse.error(res, 'Tour not found', 404);
        }

        return HttpResponse.success(res, { tour });
    } catch (error) {
        return HttpResponse.handleError(res, error);
    }
};

// @desc    Create new tour
// @route   POST /api/tours
// @access  Private (Guide only)
exports.createTour = async (req, res) => {
    try {
        const tour = await tourService.createTour(req.body, req.user.id, req.files);

        return HttpResponse.success(res, { tour }, 'Tour created successfully', 201);
    } catch (error) {
        return HttpResponse.handleError(res, error);
    }
};

// @desc    Update tour
// @route   PUT /api/tours/:id
// @access  Private (Guide - owner only)
exports.updateTour = async (req, res) => {
    try {
        const tour = await tourService.updateTour(req.params.id, req.body, req.user);

        return HttpResponse.success(res, { tour }, 'Tour updated successfully');
    } catch (error) {
        return HttpResponse.handleError(res, error);
    }
};

// @desc    Delete tour
// @route   DELETE /api/tours/:id
// @access  Private (Guide - owner only)
exports.deleteTour = async (req, res) => {
    try {
        await tourService.deleteTour(req.params.id, req.user);

        return HttpResponse.success(res, null, 'Tour deleted successfully');
    } catch (error) {
        return HttpResponse.handleError(res, error);
    }
};

// @desc    Get tours by guide
// @route   GET /api/tours/guide/:guideId
// @access  Public
exports.getToursByGuide = async (req, res) => {
    try {
        const tours = await tourService.getToursByGuide(req.params.guideId);

        return HttpResponse.success(res, {
            count: tours.length,
            tours
        });
    } catch (error) {
        return HttpResponse.handleError(res, error);
    }
};
