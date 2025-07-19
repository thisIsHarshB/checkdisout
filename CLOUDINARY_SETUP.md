# Cloudinary Setup Guide

## Required Environment Variables

Add these to your `.env.local` file:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here
```

## How to Get Cloudinary Credentials

1. **Sign up at [Cloudinary](https://cloudinary.com/)**
2. **Go to Dashboard** → Your cloud name, API Key, and API Secret are displayed
3. **Create Upload Preset:**
   - Go to Settings → Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Set signing mode to "Unsigned" for client-side uploads
   - Save the preset name

## What's Been Set Up

✅ **Cloudinary SDK installed**  
✅ **Configuration files created:**
- `lib/cloudinary/config.ts`
- `lib/cloudinary/upload.ts`
- `lib/hooks/useCloudinary.ts`
- `app/api/cloudinary/delete/route.ts`

✅ **All tasks updated** to use Cloudinary instead of Firebase Storage

## Usage

```typescript
import { useCloudinary } from '@/lib/hooks/useCloudinary';

const { uploadProfileImage, uploadProjectBanner, uploadCertificate } = useCloudinary();
``` 