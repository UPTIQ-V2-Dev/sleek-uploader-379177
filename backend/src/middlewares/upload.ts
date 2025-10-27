import ApiError from '../utils/ApiError.ts';
import httpStatus from 'http-status';
import multer from 'multer';

// Allowed file types - adjust as needed
const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'text/plain',
    'text/csv',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'application/x-rar-compressed',
    'application/json',
    'application/xml',
    'text/xml'
];

// File size limit (10MB)
const fileSizeLimit = 10 * 1024 * 1024; // 10MB in bytes

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Check if file type is allowed
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Unsupported file type'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: fileSizeLimit
    }
});

// Error handling middleware for multer
const handleMulterError = (error: any, req: any, res: any, next: any) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            throw new ApiError(httpStatus.REQUEST_ENTITY_TOO_LARGE, 'File too large');
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Unexpected field name');
        }
    }
    next(error);
};

export { upload, handleMulterError };
