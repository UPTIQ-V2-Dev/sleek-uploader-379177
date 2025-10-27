import { useEffect, useState } from 'react';
import { X, FileIcon, ImageIcon, FileTextIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    formatFileSize,
    createFilePreviewUrl,
    revokeFilePreviewUrl,
    ACCEPTED_IMAGE_TYPES,
    ACCEPTED_PDF_TYPE
} from '@/lib/fileUtils';

interface FilePreviewProps {
    file: File;
    onRemove: () => void;
    disabled?: boolean;
}

export const FilePreview = ({ file, onRemove, disabled }: FilePreviewProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        const url = createFilePreviewUrl(file);
        setPreviewUrl(url);

        return () => {
            if (url) {
                revokeFilePreviewUrl(url);
            }
        };
    }, [file]);

    const getFileIcon = () => {
        if (ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            return <ImageIcon className='h-8 w-8 text-blue-500' />;
        }
        if (file.type === ACCEPTED_PDF_TYPE) {
            return <FileTextIcon className='h-8 w-8 text-red-500' />;
        }
        return <FileIcon className='h-8 w-8 text-gray-500' />;
    };

    return (
        <Card className='relative'>
            <Button
                variant='ghost'
                size='icon'
                onClick={onRemove}
                disabled={disabled}
                className='absolute -top-2 -right-2 h-8 w-8 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 z-10'
                aria-label='Remove file'
            >
                <X className='h-4 w-4' />
            </Button>

            <CardContent className='p-4'>
                <div className='flex items-start gap-4'>
                    {/* File preview or icon */}
                    <div className='flex-shrink-0'>
                        {previewUrl ? (
                            <div className='relative'>
                                <img
                                    src={previewUrl}
                                    alt={file.name}
                                    className='h-16 w-16 object-cover rounded-md border'
                                />
                            </div>
                        ) : (
                            <div className='h-16 w-16 flex items-center justify-center bg-muted rounded-md border'>
                                {getFileIcon()}
                            </div>
                        )}
                    </div>

                    {/* File details */}
                    <div className='flex-1 min-w-0'>
                        <p
                            className='text-sm font-medium truncate'
                            title={file.name}
                        >
                            {file.name}
                        </p>
                        <p className='text-xs text-muted-foreground mt-1'>{formatFileSize(file.size)}</p>
                        <p className='text-xs text-muted-foreground capitalize'>{file.type.split('/')[0] || 'file'}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
