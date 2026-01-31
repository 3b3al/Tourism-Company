const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { createBookingDTO, updateBookingStatusDTO } = require('../dtos/booking.dto');
const { idParamDTO } = require('../dtos/common.dto');
const {
    getAllBookings,
    createBooking,
    getMyBookings,
    getBooking,
    updateBookingStatus,
    cancelBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tourId
 *               - date
 *             properties:
 *               tourId:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created
 *       400:
 *         description: Booking created
 *       400:
 *         description: Invalid input
 */
router.get('/', protect, authorize('admin'), getAllBookings);
router.post('/', protect, authorize('tourist'), validate({ body: createBookingDTO }), createBooking);

/**
 * @swagger
 * /api/bookings/my:
 *   get:
 *     summary: Get my bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get('/my', protect, getMyBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking details
 *       404:
 *         description: Booking not found
 */
router.get('/:id', protect, validate({ params: idParamDTO }), getBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Update booking status
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled]
 *     responses:
 *       200:
 *         description: Booking status updated
 */
router.put('/:id', protect, authorize('guide', 'admin'), validate({ params: idParamDTO, body: updateBookingStatusDTO }), updateBookingStatus);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Cancel booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled
 */
router.delete('/:id', protect, authorize('tourist'), validate({ params: idParamDTO }), cancelBooking);

module.exports = router;
