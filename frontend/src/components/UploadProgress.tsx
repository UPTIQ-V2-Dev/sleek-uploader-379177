import { CheckCircle2, Upload, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface UploadProgressProps {
    progress: number;
    isUploading: boolean;
    success: boolean;
    error: string | null;
    fileName?: string;
}

export const UploadProgress = ({ progress, isUploading, success, error, fileName }: UploadProgressProps) => {
    const getStatusIcon = () => {
        if (error) {
            return <AlertCircle className='h-5 w-5 text-destructive' />;
        }
        if (success) {
            return <CheckCircle2 className='h-5 w-5 text-green-500' />;
        }
        if (isUploading) {
            return <Upload className='h-5 w-5 text-primary animate-pulse' />;
        }
        return null;
    };

    const getStatusText = () => {
        if (error) {
            return 'Upload failed';
        }
        if (success) {
            return 'Upload complete';
        }
        if (isUploading) {
            return `Uploading... ${progress}%`;
        }
        return '';
    };

    const getStatusColor = () => {
        if (error) return 'text-destructive';
        if (success) return 'text-green-600';
        if (isUploading) return 'text-primary';
        return 'text-muted-foreground';
    };

    if (!isUploading && !success && !error) {
        return null;
    }

    return (
        <Card
            className={cn(
                'transition-all duration-200',
                error && 'border-destructive/50 bg-destructive/5',
                success && 'border-green-500/50 bg-green-50 dark:bg-green-950/20'
            )}
        >
            <CardContent className='p-4'>
                <div className='space-y-3'>
                    <div className='flex items-center gap-3'>
                        {getStatusIcon()}
                        <div className='flex-1'>
                            <p className={cn('text-sm font-medium', getStatusColor())}>{getStatusText()}</p>
                            {fileName && <p className='text-xs text-muted-foreground truncate'>{fileName}</p>}
                        </div>
                    </div>

                    {isUploading && (
                        <Progress
                            value={progress}
                            className='h-2'
                            aria-label={`Upload progress: ${progress}%`}
                        />
                    )}

                    {error && <p className='text-xs text-destructive'>{error}</p>}
                </div>
            </CardContent>
        </Card>
    );
};
