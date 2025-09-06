import { Cloudinary } from '@cloudinary/url-gen'

export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  }
})

// Get upload signature from our API
export const getUploadSignature = async () => {
  const response = await fetch('/api/cloudinary/signature', {
    method: 'POST'
  })
  return response.json()
}

// Direct upload to Cloudinary from client
export const uploadToCloudinaryDirect = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<any> => {
  try {
    // Get signature from our backend
    const { signature, timestamp, apiKey, cloudName } = await getUploadSignature()
    
    // Create form data for direct upload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('signature', signature)
    formData.append('timestamp', timestamp.toString())
    formData.append('api_key', apiKey)
    formData.append('folder', 'data-transfer')
    
    // For videos, add specific transformations
    if (file.type.startsWith('video/')) {
      formData.append('resource_type', 'video')
      formData.append('quality', 'auto')
      formData.append('format', 'mp4') // Ensure MP4 output
    }

    // Upload directly to Cloudinary
    const xhr = new XMLHttpRequest()
    
    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100
          onProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText)
          resolve(result)
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'))
      })

      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timed out'))
      })

      xhr.timeout = 400000 // 5 minutes timeout
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/upload`)
      xhr.send(formData)
    })
  } catch (error) {
    console.error('Direct upload error:', error)
    throw error
  }
}