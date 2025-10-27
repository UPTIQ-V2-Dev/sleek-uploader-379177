import { useCallback, useState } from 'react';
import { Upload, FileIcon, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ACCEPTED_FILE_TYPES } from '@/lib/fileUtils';

interface FileUploadZoneProps {
    onFileSelect: (file: File) => void;
    disabled?: boolean;
    className?: string;
}

export const FileUploadZone = ({ onFileSelect, disabled, className }: FileUploadZoneProps) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (!disabled) {
                setIsDragOver(true);
            }
        },
        [disabled]
    );

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(false);

            if (disabled) return;

            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                onFileSelect(files[0]);
            }
        },
        [onFileSelect, disabled]
    );

    const handleFileInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                onFileSelect(files[0]);
            }
            // Reset input value to allow selecting the same file again
            e.target.value = '';
        },
        [onFileSelect]
    );

    const handleClick = useCallback(() => {
        if (!disabled) {
            const input = document.getElementById('file-input') as HTMLInputElement;
            input?.click();
        }
    }, [disabled]);

    return (
        <div className={cn('relative', className)}>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
                className={cn(
                    'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                    'hover:border-primary/50 hover:bg-muted/25',
                    isDragOver && 'border-primary bg-primary/5',
                    disabled && 'opacity-50 cursor-not-allowed',
                    !disabled &&
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
                )}
                tabIndex={disabled ? -1 : 0}
                role='button'
                aria-label='Upload file'
            >
                <input
                    id='file-input'
                    type='file'
                    accept={ACCEPTED_FILE_TYPES.join(',')}
                    onChange={handleFileInputChange}
                    disabled={disabled}
                    className='hidden'
                    aria-hidden='true'
                />

                <div className='flex flex-col items-center gap-4'>
                    <div className='flex items-center gap-2 text-muted-foreground'>
                        <Upload className='h-8 w-8' />
                        <div className='flex gap-1'>
                            <ImageIcon className='h-6 w-6' />
                            <FileIcon className='h-6 w-6' />
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <p className='text-lg font-medium'>
                            Drop your file here, or <span className='text-primary underline'>browse</span>
                        </p>
                        <p className='text-sm text-muted-foreground'>Images (JPEG, PNG, GIF) and PDF files up to 5MB</p>
                    </div>

                    <Button
                        type='button'
                        variant='outline'
                        disabled={disabled}
                        className='pointer-events-none'
                    >
                        Choose File
                    </Button>
                </div>
            </div>
        </div>
    );
};
