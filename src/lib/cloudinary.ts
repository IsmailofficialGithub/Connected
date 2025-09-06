// Install required dependencies first:

// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

// Helper functions for uploads
export const uploadToCloudinary = async (
  file: Buffer | string,
  options: {
    folder?: string
    resource_type?: 'image' | 'video' | 'raw' | 'auto'
    public_id?: string
    quality?: 'auto' | number
    format?: string
    chunk_size?: number
  } = {}
) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || 'data-transfer',
      resource_type: options.resource_type || 'auto',
      quality: options.quality || 'auto',
      chunk_size: options.chunk_size || 6000000, // 6MB chunks for large files
      ...options
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )

    if (Buffer.isBuffer(file)) {
      uploadStream.end(file)
    } else {
      // For base64 strings
      uploadStream.end(Buffer.from(file, 'base64'))
    }
  })
}

// Get optimized URL for different file types
export const getOptimizedUrl = (publicId: string, options: {
  width?: number
  height?: number
  quality?: 'auto' | number
  format?: string
  resource_type?: 'image' | 'video' | 'raw'
} = {}) => {
  const { width, height, quality = 'auto', format = 'auto', resource_type = 'image' } = options

  if (resource_type === 'video') {
    return cloudinary.url(publicId, {
      resource_type: 'video',
      quality,
      format: format === 'auto' ? 'mp4' : format,
      width,
      height,
      crop: 'limit'
    })
  }

  if (resource_type === 'image') {
    return cloudinary.url(publicId, {
      resource_type: 'image',
      quality,
      format,
      width,
      height,
      crop: 'limit'
    })
  }

  // For raw files (documents, etc.)
  return cloudinary.url(publicId, {
    resource_type: 'raw'
  })
}

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    })
    return result
  } catch (error) {
    console.error('Failed to delete from Cloudinary:', error)
    throw error
  }
}