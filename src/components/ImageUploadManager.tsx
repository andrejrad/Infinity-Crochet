import { useState, useRef, ChangeEvent } from 'react';
import { validateImageFile } from '@/lib/imageUpload';
import ImageCropDialog from './ImageCropDialog';

interface ImageUploadProps {
  images: string[];
  mainImageIndex: number;
  onImagesChange: (images: string[], files: File[]) => void;
  onMainImageChange: (index: number) => void;
  onImageDelete: (index: number) => void;
  maxImages?: number;
  disabled?: boolean;
}

export default function ImageUploadManager({
  images,
  mainImageIndex,
  onImagesChange,
  onMainImageChange,
  onImageDelete,
  maxImages = 10,
  disabled = false,
}: ImageUploadProps) {
  const [previewImages, setPreviewImages] = useState<string[]>(images);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');
  const [cropImage, setCropImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    setError('');
    const files = Array.from(e.target.files || []);
    
    // Check total count
    if (previewImages.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    // If single file, show crop dialog
    if (files.length === 1) {
      const file = files[0];
      try {
        validateImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setCropImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      } catch (err: any) {
        setError(err.message);
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Multiple files - process without cropping
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of files) {
      try {
        validateImageFile(file);
        validFiles.push(file);
        
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === validFiles.length) {
            const updatedPreviews = [...previewImages, ...newPreviews];
            const updatedFiles = [...pendingFiles, ...validFiles];
            setPreviewImages(updatedPreviews);
            setPendingFiles(updatedFiles);
            onImagesChange(updatedPreviews, updatedFiles);
          }
        };
        reader.readAsDataURL(file);
      } catch (err: any) {
        setError(err.message);
        break;
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    // Create preview URL for cropped image
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedPreviews = [...previewImages, reader.result as string];
      const updatedFiles = [...pendingFiles, croppedFile];
      setPreviewImages(updatedPreviews);
      setPendingFiles(updatedFiles);
      onImagesChange(updatedPreviews, updatedFiles);
      setCropImage(null);
    };
    reader.readAsDataURL(croppedFile);
  };

  const handleCropCancel = () => {
    setCropImage(null);
  };

  const handleDelete = (index: number) => {
    const newPreviews = previewImages.filter((_, i) => i !== index);
    const newFiles = pendingFiles.filter((_, i) => i !== index);
    
    setPreviewImages(newPreviews);
    setPendingFiles(newFiles);
    onImageDelete(index);
    
    // Adjust main image index if needed
    if (mainImageIndex === index) {
      onMainImageChange(0);
    } else if (mainImageIndex > index) {
      onMainImageChange(mainImageIndex - 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Images ({previewImages.length}/{maxImages})
          </label>
          <p className="text-xs text-gray-500">
            Upload images (JPG, PNG, WebP, GIF - Max 5MB each). Single image uploads allow cropping.
          </p>
        </div>
        
        {previewImages.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="btn-secondary !py-2 !px-4 disabled:opacity-50"
          >
            + Add Images
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {previewImages.length === 0 ? (
        <div 
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-gray-300 rounded-lg p-12 text-center ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-purple'
          }`}
        >
          <div className="text-6xl mb-4">📸</div>
          <p className="text-gray-600 mb-2">Click to upload product images</p>
          <p className="text-sm text-gray-400">or drag and drop</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {previewImages.map((preview, index) => (
            <div
              key={index}
              className={`relative group rounded-lg overflow-hidden border-2 ${
                mainImageIndex === index
                  ? 'border-purple shadow-lg'
                  : 'border-gray-200'
              }`}
            >
              <div className="aspect-square bg-gray-100">
                <img
                  src={preview}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Main image badge */}
              {mainImageIndex === index && (
                <div className="absolute top-2 left-2 bg-purple text-white text-xs px-2 py-1 rounded-full font-medium">
                  Main
                </div>
              )}

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {mainImageIndex !== index && (
                  <button
                    type="button"
                    onClick={() => onMainImageChange(index)}
                    disabled={disabled}
                    className="px-3 py-1 bg-purple text-white text-xs rounded-full hover:bg-purple-dark disabled:opacity-50"
                  >
                    Set as Main
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  disabled={disabled}
                  className="px-3 py-1 bg-red-500 text-white text-xs rounded-full hover:bg-red-600 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>

              {/* Image number */}
              <div className="absolute bottom-2 right-2 bg-white text-gray-700 text-xs px-2 py-0.5 rounded font-medium">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {previewImages.length > 0 && (
        <p className="text-xs text-gray-500">
          💡 Tip: Click "Set as Main" to choose the main product image. Click "Delete" to remove an image.
        </p>
      )}

      {/* Crop Dialog */}
      {cropImage && (
        <ImageCropDialog
          imageUrl={cropImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}
