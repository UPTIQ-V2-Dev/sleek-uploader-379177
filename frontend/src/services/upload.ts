import { api } from '@/lib/api';
import type { UploadResponse } from '@/types/upload';
import { mockUploadResponse } from '@/data/mockData';

export const uploadFile = async (
    file: File,
    onUploadProgress?: (progressEvent: { loaded: number; total?: number }) => void
): Promise<UploadResponse> => {
    // Return mock data if using mock mode
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        // Simulate upload progress
        return new Promise(resolve => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                if (onUploadProgress) {
                    onUploadProgress({ loaded: progress, total: 100 });
                }
                if (progress >= 100) {
                    clearInterval(interval);
                    resolve(mockUploadResponse);
                }
            }, 200);
        });
    }

    // Real API call
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<UploadResponse>('/api/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: onUploadProgress
    });

    return response.data;
};
