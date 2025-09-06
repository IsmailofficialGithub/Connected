// utils/fileHandling.ts

export interface FileMetadata {
    name: string
    size: number
    type: string
    lastModified: number
    extension: string
    category: 'image' | 'video' | 'document' | 'archive' | 'other'
  }
  
  export interface ChunkInfo {
    index: number
    total: number
    size: number
    hash?: string
  }
  
  // File type categories
  const FILE_CATEGORIES = {
    image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'],
    video: ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', '3gp'],
    document: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'pages'],
    archive: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'],
    audio: ['mp3', 'wav', 'aac', 'ogg', 'wma', 'flac'],
    code: ['js', 'ts', 'py', 'java', 'cpp', 'c', 'html', 'css', 'php', 'rb', 'go', 'rs']
  }
  
  export function getFileMetadata(file: File): FileMetadata {
    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    let category: FileMetadata['category'] = 'other'
  
    // Determine category
    for (const [cat, extensions] of Object.entries(FILE_CATEGORIES)) {
      if (extensions.includes(extension)) {
        category = cat === 'audio' || cat === 'code' ? 'document' : cat as FileMetadata['category']
        break
      }
    }
  
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      extension,
      category
    }
  }
  
  export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  export function validateFile(file: File, maxSize = 100 * 1024 * 1024): { valid: boolean; error?: string } {
    // Max file size check (default 100MB)
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(maxSize)})`
      }
    }
  
    // Blocked file types for security
    const blockedExtensions = ['exe', 'bat', 'com', 'cmd', 'scr', 'pif', 'vbs', 'js']
    const extension = file.name.split('.').pop()?.toLowerCase()
    
    if (extension && blockedExtensions.includes(extension)) {
      return {
        valid: false,
        error: `File type .${extension} is not allowed for security reasons`
      }
    }
  
    return { valid: true }
  }
  
  export async function chunkFile(file: File, chunkSize = 512 * 1024): Promise<{ chunks: Blob[]; metadata: FileMetadata & { totalChunks: number } }> {
    const metadata = getFileMetadata(file)
    const chunks: Blob[] = []
    const totalChunks = Math.ceil(file.size / chunkSize)
  
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      const chunk = file.slice(start, end)
      chunks.push(chunk)
    }
  
    return {
      chunks,
      metadata: {
        ...metadata,
        totalChunks
      }
    }
  }
  
  export async function generateFileHash(file: File): Promise<string> {
    if (!crypto.subtle) {
      // Fallback for environments without crypto.subtle
      return `${file.name}-${file.size}-${file.lastModified}`
    }
  
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
  
  export function createFilePreview(file: File): Promise<string | null> {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(null)
        return
      }
  
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(file)
    })
  }
  
  export async function compressImage(file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        resolve(file)
        return
      }
  
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
  
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
  
        canvas.width = width
        canvas.height = height
  
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to compress image'))
          }
        }, file.type, quality)
      }
  
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }
  
  export class FileUploadManager {
    private uploadId: string
    private file: File
    private chunkSize: number
    private onProgress?: (progress: number, chunk: number, total: number) => void
    private onComplete?: (result: any) => void
    private onError?: (error: Error) => void
    private aborted = false
  
    constructor(
      file: File,
      options: {
        chunkSize?: number
        onProgress?: (progress: number, chunk: number, total: number) => void
        onComplete?: (result: any) => void
        onError?: (error: Error) => void
      } = {}
    ) {
      this.uploadId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      this.file = file
      this.chunkSize = options.chunkSize || 512 * 1024 // 512KB default
      this.onProgress = options.onProgress
      this.onComplete = options.onComplete
      this.onError = options.onError
    }
  
    abort() {
      this.aborted = true
    }
  
    async upload(): Promise<string> {
      try {
        if (this.aborted) throw new Error('Upload aborted')
  
        const validation = validateFile(this.file)
        if (!validation.valid) {
          throw new Error(validation.error)
        }
  
        // For small files, use direct upload
        if (this.file.size < 1024 * 1024) { // Files under 1MB
          return await this.directUpload()
        }
  
        // For larger files, use chunked upload
        return await this.chunkedUpload()
      } catch (error) {
        this.onError?.(error as Error)
        throw error
      }
    }
  
    private async directUpload(): Promise<string> {
      const formData = new FormData()
      formData.append('file', this.file)
      formData.append('uploadId', this.uploadId)
  
      const response = await fetch('/api/upload/direct', {
        method: 'POST',
         credentials: "include",
        body: formData
      })
  
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }
  
      const result = await response.json()
      this.onProgress?.(100, 1, 1)
      this.onComplete?.(result)
      return result.fileUrl
    }
  
    private async chunkedUpload(): Promise<string> {
      // For images, compress first
      let fileToUpload: File | Blob = this.file
      if (this.file.type.startsWith('image/') && this.file.size > 1024 * 1024) {
        try {
          fileToUpload = await compressImage(this.file)
        } catch (error) {
          console.warn('Image compression failed, uploading original:', error)
          fileToUpload = this.file
        }
      }
  
      // Chunk the file
      const { chunks, metadata } = await chunkFile(fileToUpload as File, this.chunkSize)
      const fileHash = await generateFileHash(this.file)
  
      if (this.aborted) throw new Error('Upload aborted')
  
      // Upload chunks with retry logic
      for (let i = 0; i < chunks.length; i++) {
        if (this.aborted) throw new Error('Upload aborted')
  
        await this.uploadChunkWithRetry(chunks[i], i, metadata.totalChunks, fileHash, 3)
        
        this.onProgress?.(
          ((i + 1) / metadata.totalChunks) * 100,
          i + 1,
          metadata.totalChunks
        )
      }
  
      // Finalize upload with retry
      return await this.finalizeWithRetry(fileHash, 3)
    }
  
    private async uploadChunkWithRetry(
      chunk: Blob, 
      index: number, 
      totalChunks: number, 
      fileHash: string, 
      maxRetries: number
    ): Promise<void> {
      let lastError: Error
  
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const formData = new FormData()
          formData.append('chunk', chunk)
          formData.append('uploadId', this.uploadId)
          formData.append('chunkIndex', index.toString())
          formData.append('totalChunks', totalChunks.toString())
          formData.append('fileName', this.file.name)
          formData.append('fileHash', fileHash)
  
          const response = await fetch('/api/upload/chunk', {
            method: 'POST',
            body: formData
          })
  
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || `Upload failed for chunk ${index}`)
          }
  
          // Success
          return
        } catch (error) {
          lastError = error as Error
          
          if (attempt < maxRetries) {
            // Wait before retry (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
            console.log(`Retrying chunk ${index}, attempt ${attempt + 1}`)
          }
        }
      }
  
      throw lastError
    }
  
    private async finalizeWithRetry(fileHash: string, maxRetries: number): Promise<string> {
      let lastError: Error
  
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const finalizeResponse = await fetch('/api/upload/finalize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uploadId: this.uploadId,
              fileName: this.file.name,
              fileSize: this.file.size,
              fileType: this.file.type,
              totalChunks: Math.ceil(this.file.size / this.chunkSize),
              fileHash
            })
          })
  
          if (!response.ok) {
            const error = await finalizeResponse.json()
            throw new Error(error.error || 'Failed to finalize upload')
          }
  
          const result = await finalizeResponse.json()
          this.onComplete?.(result)
          return result.fileUrl
        } catch (error) {
          lastError = error as Error
          
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
            console.log(`Retrying finalize, attempt ${attempt + 1}`)
          }
        }
      }
  
      throw lastError
    }
  
    // Check upload status
    async getStatus() {
      try {
        const response = await fetch(`/api/upload/status?uploadId=${this.uploadId}`)
        return await response.json()
      } catch (error) {
        console.error('Failed to get upload status:', error)
        return null
      }
    }
  }