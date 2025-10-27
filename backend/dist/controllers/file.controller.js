import { fileService } from "../services/index.js";
import ApiError from "../utils/ApiError.js";
import catchAsyncWithAuth from "../utils/catchAsyncWithAuth.js";
import pick from "../utils/pick.js";
import httpStatus from 'http-status';
const uploadFile = catchAsyncWithAuth(async (req, res) => {
    if (!req.file) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No file provided');
    }
    const file = await fileService.uploadFile(req.file, req.user.id);
    res.status(httpStatus.CREATED).send({
        success: true,
        message: 'File uploaded successfully',
        fileId: file.id.toString(),
        fileUrl: file.url
    });
});
const getFiles = catchAsyncWithAuth(async (req, res) => {
    const filter = pick(req.validatedQuery, ['type']);
    const options = pick(req.validatedQuery, ['limit', 'page']);
    const result = await fileService.queryUserFiles(req.user.id, filter, options);
    res.send(result);
});
const deleteFile = catchAsyncWithAuth(async (req, res) => {
    const fileId = parseInt(req.params.fileId);
    await fileService.deleteFileById(fileId, req.user.id);
    res.send({ message: 'File deleted successfully' });
});
export default {
    uploadFile,
    getFiles,
    deleteFile
};
