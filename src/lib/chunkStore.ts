// lib/chunkStore.ts - Shared chunk storage
interface ChunkStoreEntry {
  chunks: Map<number, Buffer>
  uploadedChunks: Set<number>
  createdAt: Date
}

// In-memory store (in production, use Redis or database)
class ChunkStore {
  private store = new Map<string, ChunkStoreEntry>()

  set(uploadId: string, entry: ChunkStoreEntry) {
    this.store.set(uploadId, entry)
  }

  get(uploadId: string): ChunkStoreEntry | undefined {
    return this.store.get(uploadId)
  }

  has(uploadId: string): boolean {
    return this.store.has(uploadId)
  }

  delete(uploadId: string): boolean {
    return this.store.delete(uploadId)
  }

  // Clean up old entries (older than 1 hour)
  cleanup() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    for (const [uploadId, entry] of this.store.entries()) {
      if (entry.createdAt < oneHourAgo) {
        this.store.delete(uploadId)
      }
    }
  }

  size(): number {
    return this.store.size
  }
}

export const chunkStore = new ChunkStore()

// Clean up every 10 minutes
setInterval(() => {
  chunkStore.cleanup()
}, 10 * 60 * 1000)
