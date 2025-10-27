import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUploadZone } from '@/components/FileUploadZone';
import { FilePreview } from '@/components/FilePreview';
import { UploadProgress } from '@/components/UploadProgress';
import { useFileUpload } from '@/hooks/useFileUpload';
import { authService } from '@/services/auth';
import { getStoredUser } from '@/lib/api';
import { UploadIcon, RefreshCcw, LogOut, User } from 'lucide-react';

export const UploadPage = () => {
    const { file, isUploading, progress, error, success, selectFile, startUpload, clearFile, reset } = useFileUpload();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();
    const user = getStoredUser();

    const handleNewUpload = () => {
        reset();
    };

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await authService.logout();
            navigate('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20'>
            <div className='container mx-auto px-4 py-8'>
                <div className='max-w-2xl mx-auto'>
                    {/* Header with User Info */}
                    <div className='flex justify-between items-center mb-8'>
                        <div className='flex items-center gap-3'>
                            <div className='p-3 bg-primary/10 rounded-full'>
                                <UploadIcon className='h-8 w-8 text-primary' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold tracking-tight'>File Upload</h1>
                                <p className='text-muted-foreground'>
                                    Upload your images and PDF files quickly and securely
                                </p>
                            </div>
                        </div>

                        <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                                <User className='h-4 w-4' />
                                <span>{user?.email}</span>
                            </div>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className='flex items-center gap-2'
                            >
                                <LogOut className='h-4 w-4' />
                                {isLoggingOut ? 'Logging out...' : 'Logout'}
                            </Button>
                        </div>
                    </div>

                    {/* Upload Card */}
                    <Card className='shadow-lg'>
                        <CardHeader>
                            <CardTitle className='text-xl'>Upload File</CardTitle>
                            <CardDescription>
                                Select or drag and drop your file to get started. Maximum file size is 5MB.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            {!file && (
                                <FileUploadZone
                                    onFileSelect={selectFile}
                                    disabled={isUploading}
                                />
                            )}

                            {file && !success && (
                                <div className='space-y-4'>
                                    <FilePreview
                                        file={file}
                                        onRemove={clearFile}
                                        disabled={isUploading}
                                    />

                                    {!isUploading && !error && (
                                        <Button
                                            onClick={startUpload}
                                            className='w-full'
                                            size='lg'
                                        >
                                            <UploadIcon className='h-4 w-4 mr-2' />
                                            Upload File
                                        </Button>
                                    )}
                                </div>
                            )}

                            <UploadProgress
                                progress={progress}
                                isUploading={isUploading}
                                success={success}
                                error={error}
                                fileName={file?.name}
                            />

                            {(success || error) && (
                                <div className='flex gap-2'>
                                    <Button
                                        onClick={handleNewUpload}
                                        variant='outline'
                                        className='flex-1'
                                    >
                                        <RefreshCcw className='h-4 w-4 mr-2' />
                                        Upload Another File
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Features */}
                    <div className='grid md:grid-cols-3 gap-4 mt-8'>
                        <Card className='text-center p-4'>
                            <CardContent className='p-0'>
                                <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2'>
                                    <UploadIcon className='h-4 w-4 text-blue-600' />
                                </div>
                                <p className='text-sm font-medium'>Fast Upload</p>
                                <p className='text-xs text-muted-foreground'>Quick and reliable file transfers</p>
                            </CardContent>
                        </Card>

                        <Card className='text-center p-4'>
                            <CardContent className='p-0'>
                                <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2'>
                                    <svg
                                        className='h-4 w-4 text-green-600'
                                        fill='currentColor'
                                        viewBox='0 0 20 20'
                                    >
                                        <path
                                            fillRule='evenodd'
                                            d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                                            clipRule='evenodd'
                                        />
                                    </svg>
                                </div>
                                <p className='text-sm font-medium'>Secure</p>
                                <p className='text-xs text-muted-foreground'>Your files are protected</p>
                            </CardContent>
                        </Card>

                        <Card className='text-center p-4'>
                            <CardContent className='p-0'>
                                <div className='w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2'>
                                    <svg
                                        className='h-4 w-4 text-purple-600'
                                        fill='currentColor'
                                        viewBox='0 0 20 20'
                                    >
                                        <path
                                            fillRule='evenodd'
                                            d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'
                                            clipRule='evenodd'
                                        />
                                    </svg>
                                </div>
                                <p className='text-sm font-medium'>Multiple Formats</p>
                                <p className='text-xs text-muted-foreground'>Images and PDF files supported</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
