import { fileService } from "../services/index.js";
import pick from "../utils/pick.js";
import { z } from 'zod';
const fileSchema = z.object({
    id: z.number(),
    filename: z.string(),
    originalName: z.string(),
    mimeType: z.string(),
    size: z.number(),
    url: z.string(),
    createdAt: z.string()
});
const getFilesTool = {
    id: 'file_get_all',
    name: 'Get User Files',
    description: 'Get paginated list of files uploaded by a user',
    inputSchema: z.object({
        userId: z.number().int(),
        page: z.number().int().min(1).optional(),
        limit: z.number().int().min(1).max(100).optional(),
        type: z.string().optional() // Filter by mimeType
    }),
    outputSchema: z.object({
        results: z.array(fileSchema),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
        totalResults: z.number()
    }),
    fn: async (inputs) => {
        const filter = pick(inputs, ['type']);
        const options = pick(inputs, ['page', 'limit']);
        const result = await fileService.queryUserFiles(inputs.userId, filter, options);
        return result;
    }
};
const getFileByIdTool = {
    id: 'file_get_by_id',
    name: 'Get File By ID',
    description: 'Get a specific file by its ID for a user',
    inputSchema: z.object({
        fileId: z.number().int(),
        userId: z.number().int()
    }),
    outputSchema: z.object({
        id: z.number(),
        filename: z.string(),
        originalName: z.string(),
        mimeType: z.string(),
        size: z.number(),
        url: z.string(),
        userId: z.number(),
        createdAt: z.string(),
        updatedAt: z.string()
    }),
    fn: async (inputs) => {
        const file = await fileService.getFileById(inputs.fileId, inputs.userId);
        if (!file) {
            throw new Error('File not found or access denied');
        }
        return {
            ...file,
            createdAt: file.createdAt.toISOString(),
            updatedAt: file.updatedAt.toISOString()
        };
    }
};
const deleteFileTool = {
    id: 'file_delete',
    name: 'Delete File',
    description: 'Delete a file by its ID for a user',
    inputSchema: z.object({
        fileId: z.number().int(),
        userId: z.number().int()
    }),
    outputSchema: z.object({
        success: z.boolean(),
        message: z.string()
    }),
    fn: async (inputs) => {
        await fileService.deleteFileById(inputs.fileId, inputs.userId);
        return {
            success: true,
            message: 'File deleted successfully'
        };
    }
};
export const fileTools = [getFilesTool, getFileByIdTool, deleteFileTool];
