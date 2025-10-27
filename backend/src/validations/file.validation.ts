import Joi from 'joi';

const uploadFile = {
    // No body validation needed for multipart/form-data, handled by multer middleware
};

const getFiles = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100),
        type: Joi.string().allow('') // Filter by mimeType (e.g., 'image', 'pdf', 'application')
    })
};

const deleteFile = {
    params: Joi.object().keys({
        fileId: Joi.string().pattern(/^\d+$/).required()
    })
};

export default {
    uploadFile,
    getFiles,
    deleteFile
};
