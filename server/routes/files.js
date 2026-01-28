const express = require('express');
const router = express.Router();
const upload = require('../middleware/fileuploader');
const { uploadFile, downloadFile } = require('../controllers/fileController');

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Upload files
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 */
router.post('/upload', upload.array('files'), uploadFile);

/**
 * @swagger
 * /api/files/{fileId}:
 *   get:
 *     summary: Download file by ID
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID of the file
 *     responses:
 *       200:
 *         description: File download
 *       404:
 *         description: File not found
 */
router.get('/:fileId', downloadFile);

module.exports = router;
