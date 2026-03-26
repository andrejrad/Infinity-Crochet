import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop';

interface ImageCropDialogProps {
  imageUrl: string;
  onCropComplete: (croppedImage: File) => void;
  onCancel: () => void;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Canvas is empty'));
      }
    }, 'image/jpeg', 0.95);
  });
}

export default function ImageCropDialog({ imageUrl, onCropComplete, onCancel }: ImageCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropChange = (location: { x: number; y: number }) => {
    setCrop(location);
  };

  const onCropAreaChange = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropConfirm = async () => {
    if (!croppedAreaPixels) return;

    setProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(imageUrl, croppedAreaPixels);
      const file = new File([croppedBlob], `cropped-${Date.now()}.jpg`, { type: 'image/jpeg' });
      onCropComplete(file);
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Failed to crop image. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 overflow-y-auto"
      style={{ position: 'fixed' }}
    >
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onCancel();
        }}
      >
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col overflow-hidden my-8">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-xl font-bold text-purple-dark">Crop Image</h2>
            <p className="text-sm text-gray-600 mt-1">Adjust the position and zoom to crop your image</p>
          </div>

          {/* Crop Area */}
          <div className="relative bg-gray-900 h-64 sm:h-80 flex-shrink-0">
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={onCropChange}
              onCropComplete={onCropAreaChange}
              onZoomChange={setZoom}
            />
          </div>

        {/* Controls */}
        <div className="p-4 border-t border-gray-200 space-y-4 flex-shrink-0">
          {/* Zoom Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zoom: {zoom.toFixed(1)}x
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #9333ea 0%, #9333ea ${((zoom - 1) / 2) * 100}%, #e5e7eb ${((zoom - 1) / 2) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={processing}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCropConfirm}
              disabled={processing}
              className="px-6 py-2 bg-purple text-white rounded-lg hover:bg-purple-dark transition-colors disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Crop & Use'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
