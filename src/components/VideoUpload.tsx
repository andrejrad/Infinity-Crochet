import { useState, useRef } from 'react';
import { validateVideoFile } from '@/lib/imageUpload';

interface VideoUploadProps {
  videoUrl?: string;
  videoFile?: File | null;
  onVideoChange: (file: File | null) => void;
  disabled?: boolean;
}

export default function VideoUpload({ videoUrl, videoFile, onVideoChange, disabled }: VideoUploadProps) {
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(videoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');

    if (!file) return;

    try {
      validateVideoFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onVideoChange(file);
    } catch (err: any) {
      setError(err.message);
      onVideoChange(null);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onVideoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {!previewUrl ? (
        <div>
          <label className="block">
            <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg appearance-none cursor-pointer hover:border-purple focus:outline-none">
              <div className="flex flex-col items-center space-y-2">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <div className="text-center">
                  <span className="text-sm text-gray-600">
                    Upload a product video (optional)
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    MP4, WebM, or MOV (max 50MB)
                  </p>
                </div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              onChange={handleFileSelect}
              disabled={disabled}
            />
          </label>
        </div>
      ) : (
        <div className="relative">
          <video
            src={previewUrl}
            controls
            className="w-full h-64 object-contain bg-black rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
            aria-label="Remove video"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="mt-2 text-sm text-gray-600">
            {videoFile ? (
              <span>New video: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)</span>
            ) : (
              <span>Current video</span>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
