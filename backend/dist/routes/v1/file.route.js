import { fileController } from "../../controllers/index.js";
import auth from "../../middlewares/auth.js";
import { handleMulterError, upload } from "../../middlewares/upload.js";
import validate from "../../middlewares/validate.js";
import { fileValidation } from "../../validations/index.js";
import express from 'express';
const router = express.Router();
// Upload endpoint - note the different path to match API spec
router.route('/upload').post(auth('manageOwnFiles'), // User can manage their own files
upload.single('file'), handleMulterError, validate(fileValidation.uploadFile), fileController.uploadFile);
// Files listing endpoint
router.route('/files').get(auth('manageOwnFiles'), validate(fileValidation.getFiles), fileController.getFiles);
// File deletion endpoint
router
    .route('/files/:fileId')
    .delete(auth('manageOwnFiles'), validate(fileValidation.deleteFile), fileController.deleteFile);
export default router;
/**
 * @swagger
 * tags:
 *   name: Files
 *   description: File upload and management
 */
/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file to cloud storage
 *     description: Upload a file to cloud storage. Users can only upload files to their own account.
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload (max 10MB)
 *     responses:
 *       "201":
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "File uploaded successfully"
 *                 fileId:
 *                   type: string
 *                   example: "123"
 *                 fileUrl:
 *                   type: string
 *                   example: "https://storage.example.com/files/file_abc123.pdf"
 *       "400":
 *         description: No file provided
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "413":
 *         description: File too large
 *       "415":
 *         description: Unsupported file type
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * @swagger
 * /files:
 *   get:
 *     summary: Get user's uploaded files with pagination
 *     description: Get paginated list of files uploaded by the authenticated user.
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of files per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by file type (e.g., 'image', 'pdf', 'application')
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       filename:
 *                         type: string
 *                         example: "file_abc123.pdf"
 *                       originalName:
 *                         type: string
 *                         example: "document.pdf"
 *                       mimeType:
 *                         type: string
 *                         example: "application/pdf"
 *                       size:
 *                         type: integer
 *                         example: 1024000
 *                       url:
 *                         type: string
 *                         example: "https://storage.example.com/files/file_abc123.pdf"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-27T10:30:45Z"
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * @swagger
 * /files/{fileId}:
 *   delete:
 *     summary: Delete uploaded file by ID
 *     description: Delete a file by its ID. Users can only delete their own files.
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *         description: File ID
 *     responses:
 *       "200":
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File deleted successfully"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Access denied - user can only delete their own files
 *       "404":
 *         description: File not found
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
