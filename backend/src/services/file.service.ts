import prisma from '../client.ts';
import { File, Prisma } from '../generated/prisma/index.js';
import { getInstance } from '../storage/main.ts';
import ApiError from '../utils/ApiError.ts';
import { getRandomString } from '../utils/string.ts';
import httpStatus from 'http-status';
import path from 'path';

/**
 * Upload file to storage and create database record
 * @param {Object} fileData - File data from multer
 * @param {number} userId - ID of the user uploading the file
 * @returns {Promise<File>}
 */
const uploadFile = async (fileData: Express.Multer.File, userId: number): Promise<File> => {
    const storage = getInstance();

    // Generate unique filename with extension
    const fileExtension = path.extname(fileData.originalname);
    const uniqueFilename = `${getRandomString('alphanumeric', 16)}${fileExtension}`;
    const key = `uploads/${userId}/${uniqueFilename}`;

    try {
        // Upload to cloud storage
        await storage.uploadData({
            data: fileData.buffer,
            destinationKey: key,
            contentType: fileData.mimetype
        });

        // Get public URL
        const url = await storage.generateDownloadSignedUrl({ key });

        // Save file metadata to database
        const file = await prisma.file.create({
            data: {
                filename: uniqueFilename,
                originalName: fileData.originalname,
                mimeType: fileData.mimetype,
                size: fileData.size,
                url,
                userId
            }
        });

        return file;
    } catch (error) {
        console.error('File upload failed:', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'File upload failed');
    }
};

/**
 * Query for user's files with pagination and filtering
 * @param {number} userId - User ID to filter files
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUserFiles = async (
    userId: number,
    filter: { type?: string } = {},
    options: {
        limit?: number;
        page?: number;
        sortBy?: string;
        sortType?: 'asc' | 'desc';
    }
): Promise<{
    results: Pick<File, 'id' | 'filename' | 'originalName' | 'mimeType' | 'size' | 'url' | 'createdAt'>[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
}> => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const sortBy = options.sortBy ?? 'createdAt';
    const sortType = options.sortType ?? 'desc';

    // Build where clause
    const where: Prisma.FileWhereInput = {
        userId,
        ...(filter.type && { mimeType: { contains: filter.type, mode: 'insensitive' } })
    };

    // Get total count for pagination
    const totalResults = await prisma.file.count({ where });
    const totalPages = Math.ceil(totalResults / limit);

    const files = await prisma.file.findMany({
        where,
        select: {
            id: true,
            filename: true,
            originalName: true,
            mimeType: true,
            size: true,
            url: true,
            createdAt: true
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortType }
    });

    return {
        results: files,
        page,
        limit,
        totalPages,
        totalResults
    };
};

/**
 * Get file by id for a specific user
 * @param {number} fileId - File ID
 * @param {number} userId - User ID
 * @returns {Promise<File | null>}
 */
const getFileById = async (fileId: number, userId: number): Promise<File | null> => {
    return await prisma.file.findFirst({
        where: {
            id: fileId,
            userId
        }
    });
};

/**
 * Delete file by id for a specific user
 * @param {number} fileId - File ID
 * @param {number} userId - User ID
 * @returns {Promise<void>}
 */
const deleteFileById = async (fileId: number, userId: number): Promise<void> => {
    // Get file to check ownership and get storage key
    const file = await getFileById(fileId, userId);
    if (!file) {
        throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
    }

    const storage = getInstance();
    const key = `uploads/${userId}/${file.filename}`;

    try {
        // Delete from storage
        await storage.deleteFile({ key });

        // Delete from database
        await prisma.file.delete({
            where: { id: fileId }
        });
    } catch (error) {
        console.error('File deletion failed:', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'File deletion failed');
    }
};

export default {
    uploadFile,
    queryUserFiles,
    getFileById,
    deleteFileById
};
