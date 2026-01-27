const fs = require('fs');
const path = require('path');
const File = require('../models/File');
const AppError = require('../utils/AppError');

class FileService {
    // Upload file and save to database
    async uploadFiles(files, userId = null) {
        if (!files || files.length === 0) {
            throw new AppError('No files uploaded', 400);
        }

        const fileDocuments = await Promise.all(
            files.map(file => File.create({
                filename: file.filename,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                path: file.path,
                uploadedBy: userId
            }))
        );

        return fileDocuments;
    }

    // Get file by ID
    async getFileById(fileId) {
        const file = await File.findById(fileId);
        if (!file) {
            throw new AppError('File not found', 404);
        }
        return file;
    }

    // Download file
    async getFilePath(filename) {
        const filePath = path.join(__dirname, '../../uploads', filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            throw new AppError('File not found', 404);
        }

        return filePath;
    }
}

module.exports = new FileService();
