const fileService = require('../services/fileService');
const HttpResponse = require('../utils/HttpResponse');

exports.uploadFile = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const fileDocuments = await fileService.uploadFiles(req.files, userId);

        // Format response with file IDs
        const files = fileDocuments.map(file => ({
            id: file._id,
            filename: file.filename,
            originalName: file.originalName,
            mimetype: file.mimetype,
            size: file.size,
            url: `${req.protocol}://${req.get('host')}/api/files/${file._id}`
        }));

        return HttpResponse.success(res, { files }, 'Files uploaded successfully');
    } catch (error) {
        return HttpResponse.handleError(res, error);
    }
};

exports.downloadFile = async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const file = await fileService.getFileById(fileId);
        const filePath = await fileService.getFilePath(file.filename);
        res.download(filePath, file.originalName);
    } catch (error) {
        return HttpResponse.handleError(res, error);
    }
};
