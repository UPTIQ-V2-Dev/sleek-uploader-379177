import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { uploadFile } from '@/services/upload';
import { validateFile } from '@/lib/fileUtils';
import type { FileUploadState, UploadResponse } from '@/types/upload';

export const useFileUpload = () => {
    const [uploadState, setUploadState] = useState<FileUploadState>({
        file: null,
        isUploading: false,
        progress: 0,
        error: null,
        success: false
    });

    const uploadMutation = useMutation<UploadResponse, Error, File>({
        mutationFn: (file: File) => {
            return uploadFile(file, progressEvent => {
                const progress = progressEvent.total
                    ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    : progressEvent.loaded;

                setUploadState(prev => ({
                    ...prev,
                    progress
                }));
            });
        },
        onSuccess: data => {
            setUploadState(prev => ({
                ...prev,
                isUploading: false,
                success: true,
                error: null
            }));
            toast.success(data.message || 'File uploaded successfully!');
        },
        onError: error => {
            setUploadState(prev => ({
                ...prev,
                isUploading: false,
                error: error.message,
                success: false
            }));
            toast.error(error.message || 'Failed to upload file');
        }
    });

    const selectFile = useCallback((file: File) => {
        const validation = validateFile(file);

        if (!validation.isValid) {
            setUploadState({
                file: null,
                isUploading: false,
                progress: 0,
                error: validation.error || null,
                success: false
            });
            toast.error(validation.error);
            return;
        }

        setUploadState({
            file,
            isUploading: false,
            progress: 0,
            error: null,
            success: false
        });
    }, []);

    const startUpload = useCallback(() => {
        if (!uploadState.file) return;

        setUploadState(prev => ({
            ...prev,
            isUploading: true,
            progress: 0,
            error: null,
            success: false
        }));

        uploadMutation.mutate(uploadState.file);
    }, [uploadState.file, uploadMutation]);

    const clearFile = useCallback(() => {
        setUploadState({
            file: null,
            isUploading: false,
            progress: 0,
            error: null,
            success: false
        });
    }, []);

    const reset = useCallback(() => {
        clearFile();
    }, [clearFile]);

    return {
        ...uploadState,
        selectFile,
        startUpload,
        clearFile,
        reset
    };
};
