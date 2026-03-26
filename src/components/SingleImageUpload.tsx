import { useState, ChangeEvent } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

interface SingleImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  disabled?: boolean;
}

export default function SingleImageUpload({ currentImage, onImageChange, disabled }: SingleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentImage || '');
  const [error, setError] = useState<string>('');

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Please upload JPG, PNG, WebP, or GIF.';
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'File too large. Maximum size is 5MB.';
    }
    
    return null;
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setUploading(true);

    try {
      // Create storage reference
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const storageRef = ref(storage, `categories/${filename}`);

      // Upload file
      await uploadBytes(storageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Update preview and notify parent
      setPreview(downloadURL);
      onImageChange(downloadURL);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!preview || !confirm('Remove this image?')) return;

    try {
      // Try to delete from storage if it's a Firebase Storage URL
      if (preview.includes('firebasestorage.googleapis.com')) {
        const imageRef = ref(storage, preview);
        await deleteObject(imageRef);
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      // Continue anyway - we'll just remove the reference
    }

    setPreview('');
    onImageChange('');
  };

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative inline-block">
          <img 
            src={preview} 
            alt="Category icon"
            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled || uploading}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            ×
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple transition-colors">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            disabled={disabled || uploading}
            className="hidden"
            id="category-image-upload"
          />
          <label 
            htmlFor="category-image-upload"
            className={`cursor-pointer ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="text-4xl mb-2">📁</div>
            <p className="text-sm text-gray-600 mb-1">
              {uploading ? 'Uploading...' : 'Click to upload category icon'}
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, WebP, or GIF (max 5MB)
            </p>
          </label>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple"></div>
          <span>Uploading image...</span>
        </div>
      )}
    </div>
  );
}
