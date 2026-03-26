import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

/**
 * Upload an image to Firebase Storage
 * @param file - The image file to upload
 * @param path - Storage path (e.g., 'products/product-id/image.jpg')
 * @returns Download URL of the uploaded image
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

/**
 * Delete an image from Firebase Storage
 * @param url - The full download URL of the image to delete
 */
export async function deleteImage(url: string): Promise<void> {
  try {
    // Extract the path from the URL
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/o\/(.+?)\?/);
    
    if (pathMatch && pathMatch[1]) {
      const path = decodeURIComponent(pathMatch[1]);
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

/**
 * Upload multiple images for a product
 * @param files - Array of image files to upload
 * @param productId - The product ID for organizing storage
 * @param onProgress - Optional callback for upload progress
 * @returns Array of download URLs
 */
export async function uploadProductImages(
  files: File[],
  productId: string,
  onProgress?: (current: number, total: number) => void
): Promise<string[]> {
  const urls: string[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const path = `products/${productId}/${fileName}`;
    
    const url = await uploadImage(file, path);
    urls.push(url);
    
    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }
  
  return urls;
}

/**
 * Validate image file
 * @param file - The file to validate
 * @returns True if valid, throws error if invalid
 */
export function validateImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload JPG, PNG, WebP, or GIF images.');
  }
  
  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 5MB.');
  }
  
  return true;
}

/**
 * Validate video file
 * @param file - The file to validate
 * @returns True if valid, throws error if invalid
 */
export function validateVideoFile(file: File): boolean {
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  const maxSize = 50 * 1024 * 1024; // 50MB
  
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload MP4, WebM, OGG, or MOV videos.');
  }
  
  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum video size is 50MB.');
  }
  
  return true;
}

/**
 * Upload a video file for a product
 * @param file - The video file to upload
 * @param productId - The product ID for organizing storage
 * @param onProgress - Optional callback for upload progress
 * @returns Download URL of the uploaded video
 */
export async function uploadProductVideo(
  file: File,
  productId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  validateVideoFile(file);
  
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const path = `products/${productId}/video/${fileName}`;
  
  const storageRef = ref(storage, path);
  
  // For progress tracking, we'd need uploadBytesResumable, but for simplicity using uploadBytes
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  
  if (onProgress) {
    onProgress(100);
  }
  
  return downloadURL;
}

/**
 * Generate a unique ID for new products
 * @returns A unique ID string
 */
export function generateProductId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
