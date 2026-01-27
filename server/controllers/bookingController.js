const bookingService = require('../services/bookingService');
const HttpResponse = require('../utils/HttpResponse');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Tourist)
exports.createBooking = async (req, res) => {
    try {
        const booking = await bookingService.createBooking(req.body, req.user);

        return HttpResponse.success(res, { booking }, 'Booking created successfully', 201);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return HttpResponse.error(res, error.message, statusCode);
    }
};

// @desc    Get all bookings for logged in user
// @route   GET /api/bookings/my
// @access  Private
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await bookingService.getUserBookings(req.user);

        return HttpResponse.success(res, {
            count: bookings.length,
            bookings
        });
    } catch (error) {
        return HttpResponse.handleError(res, error);
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
    try {
        const booking = await bookingService.getBookingById(req.params.id, req.user);

        return HttpResponse.success(res, { booking });
    } catch (error) {
        return HttpResponse.handleError(res, error);
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private (Guide or Admin)
exports.updateBookingStatus = async (req, res) => {
    try {
        const booking = await bookingService.updateBookingStatus(req.params.id, req.body, req.user);

        return HttpResponse.success(res, { booking }, 'Booking status updated successfully');
    } catch (error) {
        return HttpResponse.handleError(res, error);
    }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private (Tourist - owner only)
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await bookingService.cancelBooking(req.params.id, req.user);

        return HttpResponse.success(res, { booking }, 'Booking cancelled successfully');
    } catch (error) {
        return HttpResponse.handleError(res, error);
    }
};
