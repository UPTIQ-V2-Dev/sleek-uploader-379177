export interface FileUploadState {
    file: File | null;
    isUploading: boolean;
    progress: number;
    error: string | null;
    success: boolean;
}

export interface UploadResponse {
    success: boolean;
    message: string;
    fileId?: string;
    fileUrl?: string;
}

export interface FileValidationResult {
    isValid: boolean;
    error?: string;
}

export interface FileUploadOptions {
    maxSize: number;
    acceptedTypes: string[];
    onProgress?: (progress: number) => void;
    onSuccess?: (response: UploadResponse) => void;
    onError?: (error: string) => void;
}
