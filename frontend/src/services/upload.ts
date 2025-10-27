import { api } from '@/lib/api';
import type { UploadResponse } from '@/types/upload';
import { mockUploadResponse } from '@/data/mockData';
import { emitter } from '@/agentSdk';

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
                    const response = mockUploadResponse;

                    // Emit document-uploaded event for mock data
                    emitter.emit({
                        agentId: '17069010-f7e9-48ea-90de-bb78c90edfd7',
                        event: 'document-uploaded',
                        payload: {
                            fileId: response.fileId,
                            fileName: file.name,
                            fileSize: file.size,
                            mimeType: file.type
                        },
                        documents: response.fileUrl
                            ? [
                                  {
                                      signedUrl: response.fileUrl,
                                      fileName: file.name,
                                      mimeType: file.type
                                  }
                              ]
                            : undefined
                    });

                    resolve(response);
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

    // Emit document-uploaded event for successful upload
    if (response.data.success) {
        emitter.emit({
            agentId: '17069010-f7e9-48ea-90de-bb78c90edfd7',
            event: 'document-uploaded',
            payload: {
                fileId: response.data.fileId,
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type
            },
            documents: response.data.fileUrl
                ? [
                      {
                          signedUrl: response.data.fileUrl,
                          fileName: file.name,
                          mimeType: file.type
                      }
                  ]
                : undefined
        });
    }

    return response.data;
};
