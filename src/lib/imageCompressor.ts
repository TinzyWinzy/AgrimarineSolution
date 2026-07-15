const MAX_WIDTH = 1920
const MAX_HEIGHT = 1920
const QUALITY = 0.7
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function compressImage(file: File): Promise<Blob> {
  if (file.size <= MAX_FILE_SIZE && !file.type.includes('jpeg') && !file.type.includes('png')) {
    return file
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height)
        width *= ratio
        height *= ratio
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) { resolve(file); return }

      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else resolve(file)
        },
        'image/jpeg',
        QUALITY
      )
    }
    img.onerror = () => resolve(file)
    img.src = url
  })
}

export function validateImage(file: File): string | null {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
  if (!allowedTypes.includes(file.type)) {
    return 'Unsupported image format. Use JPEG, PNG, or WebP.'
  }
  if (file.size > 20 * 1024 * 1024) {
    return 'Image too large. Maximum 20 MB.'
  }
  return null
}

export function generateSafeFileName(original: string): string {
  const ext = original.split('.').pop() || 'jpg'
  const timestamp = Date.now()
  const random = Math.random().toString(36).slice(2, 8)
  return `img-${timestamp}-${random}.${ext}`
}
