import { type FileValidationResult } from '@/types/upload';

// File constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
export const ACCEPTED_PDF_TYPE = 'application/pdf';
export const ACCEPTED_FILE_TYPES = [...ACCEPTED_IMAGE_TYPES, ACCEPTED_PDF_TYPE];

// File validation
export const validateFile = (file: File): FileValidationResult => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            isValid: false,
            error: `File size must be less than ${formatFileSize(MAX_FILE_SIZE)}`
        };
    }

    // Check file type
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        return {
            isValid: false,
            error: 'Only images (JPEG, PNG, GIF) and PDF files are allowed'
        };
    }

    return { isValid: true };
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file icon based on type
export const getFileIcon = (file: File): string => {
    if (ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        return 'image';
    }
    if (file.type === ACCEPTED_PDF_TYPE) {
        return 'file-text';
    }
    return 'file';
};

// Create file preview URL for images
export const createFilePreviewUrl = (file: File): string | null => {
    if (ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        return URL.createObjectURL(file);
    }
    return null;
};

// Cleanup preview URL
export const revokeFilePreviewUrl = (url: string): void => {
    URL.revokeObjectURL(url);
};
