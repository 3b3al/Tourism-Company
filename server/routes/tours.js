const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { createTourDTO, updateTourDTO, getToursQueryDTO } = require('../dtos/tour.dto');
const { idParamDTO, guideIdParamDTO } = require('../dtos/common.dto');
const {
    getTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    getToursByGuide
} = require('../controllers/tourController');
const { protect, authorize } = require('../middleware/auth');

const upload = require('../middleware/fileuploader');

/**
 * @swagger
 * /api/tours:
 *   get:
 *     summary: Get all tours
 *     tags: [Tours]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tours
 */
router.get('/', validate({ query: getToursQueryDTO }), getTours);

/**
 * @swagger
 * /api/tours/{id}:
 *   get:
 *     summary: Get tour by ID
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tour details
 *       404:
 *         description: Tour not found
 */
router.get('/:id', validate({ params: idParamDTO }), getTour);

/**
 * @swagger
 * /api/tours/guide/{guideId}:
 *   get:
 *     summary: Get tours by guide
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: guideId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tours by guide
 */
router.get('/guide/:guideId', validate({ params: guideIdParamDTO }), getToursByGuide);

/**
 * @swagger
 * /api/tours:
 *   post:
 *     summary: Create a new tour
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Tour created successfully
 */
router.post('/', protect, authorize('guide', 'admin'), upload.array('images'), validate({ body: createTourDTO }), createTour);

/**
 * @swagger
 * /api/tours/{id}:
 *   put:
 *     summary: Update tour
 *     tags: [Tours]
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
 *         description: Tour updated
 */
router.put('/:id', protect, authorize('guide', 'admin'), validate({ params: idParamDTO, body: updateTourDTO }), updateTour);

/**
 * @swagger
 * /api/tours/{id}:
 *   delete:
 *     summary: Delete tour
 *     tags: [Tours]
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
 *         description: Tour deleted
 */
router.delete('/:id', protect, authorize('guide', 'admin'), validate({ params: idParamDTO }), deleteTour);

module.exports = router;
