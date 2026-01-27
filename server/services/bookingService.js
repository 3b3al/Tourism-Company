const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const AppError = require('../utils/AppError');

class BookingService {
    async createBooking(bookingData, user) {
        const {
            tourId,
            selectedDate,
            selectedTime,
            numberOfPeople,
            specialRequests,
            contactPhone,
            contactEmail
        } = bookingData;

        // Get tour details
        const tour = await Tour.findById(tourId);

        if (!tour) {
            throw new AppError('Tour not found', 404);
        }

        // Check if selected date/time is available
        const availableSlot = tour.availableDates.find(
            slot => new Date(slot.date).toDateString() === new Date(selectedDate).toDateString()
                && slot.startTime === selectedTime
        );

        if (!availableSlot) {
            throw new AppError('Selected date/time is not available', 400);
        }

        // Check if enough spots available
        if (availableSlot.availableSpots < numberOfPeople) {
            throw new AppError(`Only ${availableSlot.availableSpots} spots available`, 400);
        }

        // Calculate total price
        const totalPrice = tour.price * numberOfPeople;

        // Create booking
        const booking = await Booking.create({
            tour: tourId,
            tourist: user.id,
            guide: tour.guide,
            selectedDate,
            selectedTime,
            numberOfPeople,
            totalPrice,
            specialRequests,
            contactPhone,
            contactEmail
        });

        // Update available spots
        availableSlot.availableSpots -= numberOfPeople;
        await tour.save();

        // Populate booking details
        const populatedBooking = await Booking.findById(booking._id)
            .populate('tour', 'title duration price images')
            .populate('guide', 'name email phone')
            .populate('tourist', 'name email phone');

        return populatedBooking;
    }

    async getUserBookings(user) {
        let query;

        if (user.role === 'guide') {
            query = { guide: user.id };
        } else {
            query = { tourist: user.id };
        }

        const bookings = await Booking.find(query)
            .populate('tour', 'title duration price images category')
            .populate('guide', 'name email phone rating')
            .populate('tourist', 'name email phone')
            .sort('-createdAt');

        return bookings;
    }

    async getBookingById(id, user) {
        const booking = await Booking.findById(id)
            .populate('tour', 'title description duration price images category')
            .populate('guide', 'name email phone rating languages')
            .populate('tourist', 'name email phone');

        if (!booking) {
            throw new AppError('Booking not found', 404);
        }

        // Make sure user is booking owner or guide
        if (
            booking.tourist._id.toString() !== user.id &&
            booking.guide._id.toString() !== user.id &&
            user.role !== 'admin'
        ) {
            throw new AppError('Not authorized to view this booking', 403);
        }

        return booking;
    }

    async updateBookingStatus(id, updateData, user) {
        const { status, paymentStatus } = updateData;

        let booking = await Booking.findById(id);

        if (!booking) {
            throw new AppError('Booking not found', 404);
        }

        // Make sure user is guide or admin
        if (
            booking.guide.toString() !== user.id &&
            user.role !== 'admin'
        ) {
            throw new AppError('Not authorized to update this booking', 403);
        }

        if (status) booking.status = status;
        if (paymentStatus) booking.paymentStatus = paymentStatus;

        await booking.save();

        booking = await Booking.findById(booking._id)
            .populate('tour', 'title duration price')
            .populate('guide', 'name email')
            .populate('tourist', 'name email');

        return booking;
    }

    async cancelBooking(id, user) {
        const booking = await Booking.findById(id);

        if (!booking) {
            throw new AppError('Booking not found', 404);
        }

        // Make sure user is booking owner
        if (booking.tourist.toString() !== user.id && user.role !== 'admin') {
            throw new AppError('Not authorized to cancel this booking', 403);
        }

        // Update booking status to cancelled
        booking.status = 'cancelled';
        await booking.save();

        // Restore available spots
        const tour = await Tour.findById(booking.tour);
        const availableSlot = tour.availableDates.find(
            slot => new Date(slot.date).toDateString() === new Date(booking.selectedDate).toDateString()
                && slot.startTime === booking.selectedTime
        );

        if (availableSlot) {
            availableSlot.availableSpots += booking.numberOfPeople;
            await tour.save();
        }

        return booking;
    }
}

module.exports = new BookingService();
