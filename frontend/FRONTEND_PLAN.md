# Frontend Implementation Plan - Minimal File Upload App

## Project Overview

Build an extremely minimal React 19 application for uploading image or PDF files (<5MB) with modern slick UI using Vite, shadcn/ui, and Tailwind v4.

## Tech Stack

- **React 19** - Latest React with concurrent features
- **Vite 7** - Fast build tool and dev server
- **shadcn/ui** - Pre-built accessible components
- **Tailwind v4** - Utility-first CSS framework
- **TypeScript** - Type safety
- **React Hook Form + Zod** - Form handling and validation
- **Axios** - HTTP client for API calls

## Page-by-Page Implementation Plan

### 1. Main Upload Page (`/`)

**File**: `src/pages/UploadPage.tsx`

**Components needed**:

- `FileUploadZone` - Drag & drop area with click to upload
- `FilePreview` - Show selected file with remove option
- `UploadProgress` - Progress bar during upload
- `SuccessMessage` - Confirmation after upload

**Utils/Hooks**:

- `useFileUpload` - Custom hook for upload logic
- `validateFile` - File validation utility (size, type)
- `formatFileSize` - Display file size utility

**API Endpoints**:

- `POST /api/upload` - Upload file endpoint

**Types**:

- `FileUploadState` - Upload state interface
- `UploadResponse` - API response interface

### 2. Common Components & Layout

**Layout Components**:

- `Layout` - Main app wrapper with header
- `Header` - Simple app title/branding

**Reusable Components**:

- `LoadingSpinner` - Loading indicator
- `ErrorAlert` - Error message display
- `Toast` - Success/error notifications (using sonner)

### 3. Core Utilities & Services

**File Management**:

- `src/lib/fileUtils.ts` - File validation, size formatting
- `src/lib/uploadService.ts` - Upload API integration
- `src/hooks/useFileUpload.ts` - Upload state management

**Constants**:

- `src/lib/constants.ts` - File size limits, accepted types

**Types**:

- `src/types/upload.ts` - Upload-related interfaces

## Implementation Phases

### Phase 1: Basic File Upload Interface

1. Create main upload page layout
2. Implement drag & drop file zone
3. Add file validation (size, type)
4. Show file preview with remove option

### Phase 2: Upload Functionality

1. Integrate upload API service
2. Add upload progress tracking
3. Implement error handling
4. Add success confirmation

### Phase 3: UI Polish & Responsiveness

1. Apply modern styling with Tailwind v4
2. Add animations and transitions
3. Ensure mobile responsiveness
4. Add toast notifications

### Phase 4: Testing & Optimization

1. Add error boundaries
2. Implement loading states
3. Add file upload cancellation
4. Performance optimizations

## File Structure

```
src/
├── components/
│   ├── ui/ (shadcn components - already exists)
│   ├── FileUploadZone.tsx
│   ├── FilePreview.tsx
│   ├── UploadProgress.tsx
│   ├── Layout.tsx
│   └── LoadingSpinner.tsx
├── hooks/
│   └── useFileUpload.ts
├── lib/
│   ├── fileUtils.ts
│   ├── uploadService.ts
│   └── constants.ts
├── pages/
│   └── UploadPage.tsx
├── types/
│   └── upload.ts
└── App.tsx (update routing)
```

## Key Features

- **File Validation**: Images (jpg, png, gif) & PDFs only, max 5MB
- **Drag & Drop**: Intuitive file selection
- **Progress Tracking**: Real-time upload progress
- **Error Handling**: Clear error messages
- **Responsive Design**: Works on all devices
- **Accessibility**: Screen reader friendly
- **Modern UI**: Clean, minimal design with smooth animations

## API Requirements

- Single upload endpoint accepting multipart/form-data
- File size validation on backend
- Return upload success/error responses
- Optional: file URL/ID for confirmation
