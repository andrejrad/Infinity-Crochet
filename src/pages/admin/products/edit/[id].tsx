import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import SEO from '@/components/SEO';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import type { Category } from '@/types/user';
import ImageUploadManager from '@/components/ImageUploadManager';
import { uploadProductImages, deleteImage, uploadProductVideo } from '@/lib/imageUpload';
import ColorMultiSelect from '@/components/ColorMultiSelect';
import VideoUpload from '@/components/VideoUpload';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  
  const [existingVideoUrl, setExistingVideoUrl] = useState<string>('');
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<string>('');
  
  const [colorOption1Colors, setColorOption1Colors] = useState<string[]>([]);
  const [colorOption2Colors, setColorOption2Colors] = useState<string[]>([]);
  const [colorOption3Colors, setColorOption3Colors] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'amigurumi',
    price: '',
    description: '',
    featured: false,
    inStock: true,
    tags: '',
    width: '',
    height: '',
    depth: '',
    dimensionUnit: 'cm' as 'cm' | 'inches',
    weight: '',
    weightUnit: 'kg' as 'kg' | 'lbs',
    colorOption1Enabled: false,
    colorOption1Label: '',
    colorOption2Enabled: false,
    colorOption2Label: '',
    colorOption3Enabled: false,
    colorOption3Label: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (id) {
      loadProduct(id as string);
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const categoriesRef = collection(db, 'categories');
      const snapshot = await getDocs(categoriesRef);
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadProduct = async (productId: string) => {
    try {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          category: data.category || 'amigurumi',
          price: data.price?.toString() || '',
          description: data.description || '',
          featured: data.featured || false,
          inStock: data.inStock !== undefined ? data.inStock : true,
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          width: data.dimensions?.width?.toString() || '',
          height: data.dimensions?.height?.toString() || '',
          depth: data.dimensions?.depth?.toString() || '',
          dimensionUnit: data.dimensions?.unit || 'cm',
          weight: data.weight?.value?.toString() || '',
          weightUnit: data.weight?.unit || 'kg',
          colorOption1Enabled: data.colorOptions?.option1?.enabled || false,
          colorOption1Label: data.colorOptions?.option1?.label || '',
          colorOption2Enabled: data.colorOptions?.option2?.enabled || false,
          colorOption2Label: data.colorOptions?.option2?.label || '',
          colorOption3Enabled: data.colorOptions?.option3?.enabled || false,
          colorOption3Label: data.colorOptions?.option3?.label || '',
        });
        
        // Load color options
        setColorOption1Colors(data.colorOptions?.option1?.availableColors || []);
        setColorOption2Colors(data.colorOptions?.option2?.availableColors || []);
        setColorOption3Colors(data.colorOptions?.option3?.availableColors || []);
        
        // Load video if exists
        if (data.video) {
          setExistingVideoUrl(data.video);
        }
        
        // Load existing images
        const images = Array.isArray(data.images) ? data.images : [];
        setExistingImages(images);
        setPreviewImages(images);
        
        // Find main image index
        if (data.image && images.length > 0) {
          const mainIndex = images.findIndex((img: string) => img === data.image);
          setMainImageIndex(mainIndex >= 0 ? mainIndex : 0);
        }
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error loading product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleImagesChange = (previews: string[], files: File[]) => {
    setPreviewImages(previews);
    // The files array only contains new File objects, not existing URLs
    // So we just need to append to existing newImageFiles
    setNewImageFiles(files);
  };

  const handleImageDelete = (index: number) => {
    // Update preview images
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newPreviews);
    
    // If it's an existing image, mark for deletion
    if (index < existingImages.length) {
      const imageUrl = existingImages[index];
      setImagesToDelete([...imagesToDelete, imageUrl]);
      setExistingImages(existingImages.filter((_, i) => i !== index));
    } else {
      // It's a new image, just remove from new files
      const newIndex = index - existingImages.length;
      setNewImageFiles(newImageFiles.filter((_, i) => i !== newIndex));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate images
    if (previewImages.length === 0) {
      setError('Product must have at least one image');
      return;
    }

    setSaving(true);
    setUploading(true);

    try {
      // Delete removed images from storage
      for (const imageUrl of imagesToDelete) {
        try {
          await deleteImage(imageUrl);
        } catch (err) {
          console.error('Failed to delete image:', err);
        }
      }

      // Delete old video if new one is being uploaded
      if (newVideoFile && existingVideoUrl) {
        try {
          await deleteImage(existingVideoUrl);
        } catch (err) {
          console.error('Failed to delete old video:', err);
        }
      }
      // Delete video if explicitly marked for deletion
      if (videoToDelete) {
        try {
          await deleteImage(videoToDelete);
        } catch (err) {
          console.error('Failed to delete video:', err);
        }
      }

      // Upload new images
      let newImageUrls: string[] = [];
      if (newImageFiles.length > 0) {
        newImageUrls = await uploadProductImages(
          newImageFiles,
          id as string,
          (current, total) => setUploadProgress({ current, total })
        );
      }

      // Upload new video if provided
      let videoUrl: string | undefined = existingVideoUrl || undefined;
      if (newVideoFile) {
        videoUrl = await uploadProductVideo(newVideoFile, id as string);
      } else if (videoToDelete) {
        videoUrl = undefined;
      }

      setUploading(false);

      // Combine existing and new image URLs
      const allImageUrls = [...existingImages, ...newImageUrls];

      // Prepare tags
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      // Prepare dimensions if provided
      const dimensions = formData.width && formData.height && formData.depth ? {
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        depth: parseFloat(formData.depth),
        unit: formData.dimensionUnit,
      } : undefined;

      // Prepare weight if provided
      const weight = formData.weight ? {
        value: parseFloat(formData.weight),
        unit: formData.weightUnit,
      } : undefined;

      // Prepare color options if provided
      const colorOptions: any = {};
      if (formData.colorOption1Enabled && formData.colorOption1Label.trim() && colorOption1Colors.length > 0) {
        colorOptions.option1 = { 
          enabled: true, 
          label: formData.colorOption1Label.trim(),
          availableColors: colorOption1Colors
        };
      }
      if (formData.colorOption2Enabled && formData.colorOption2Label.trim() && colorOption2Colors.length > 0) {
        colorOptions.option2 = { 
          enabled: true, 
          label: formData.colorOption2Label.trim(),
          availableColors: colorOption2Colors
        };
      }
      if (formData.colorOption3Enabled && formData.colorOption3Label.trim() && colorOption3Colors.length > 0) {
        colorOptions.option3 = { 
          enabled: true, 
          label: formData.colorOption3Label.trim(),
          availableColors: colorOption3Colors
        };
      }
      const hasColorOptions = Object.keys(colorOptions).length > 0;

      // Update product document
      await updateDoc(doc(db, 'products', id as string), {
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
        image: allImageUrls[mainImageIndex], // Main image
        images: allImageUrls, // All images
        ...(videoUrl ? { video: videoUrl } : { video: undefined }),
        featured: formData.featured,
        inStock: formData.inStock,
        tags: tagsArray,
        ...(dimensions && { dimensions }),
        ...(weight && { weight }),
        ...(hasColorOptions && { colorOptions }),
        updatedAt: new Date(),
      });

      router.push('/admin/products');
    } catch (err: any) {
      console.error('Error updating product:', err);
      setError(err.message || 'Failed to update product');
      setUploading(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <SEO 
        title={`Edit ${formData.name} - Admin`}
        description="Edit product details"
      />
      
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container-custom max-w-3xl">
          <div className="mb-6">
            <Link href="/admin/products" className="text-purple hover:text-purple-dark">
              ← Back to Products
            </Link>
          </div>

          <div className="card p-8">
            <h1 className="text-3xl font-bold text-purple-dark mb-6">
              Edit Product
            </h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="Cuddle Bunny"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug *
                </label>
                <input
                  id="slug"
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="cuddle-bunny"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                {loadingCategories ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    Loading categories...
                  </div>
                ) : (
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                <ImageUploadManager
                  images={previewImages}
                  mainImageIndex={mainImageIndex}
                  onImagesChange={handleImagesChange}
                  onMainImageChange={setMainImageIndex}
                  onImageDelete={handleImageDelete}
                  maxImages={10}
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Video (Optional)
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Upload a video to showcase your product. Customers will see it on the product page.
                </p>
                <VideoUpload
                  videoUrl={existingVideoUrl}
                  videoFile={newVideoFile}
                  onVideoChange={(file) => {
                    setNewVideoFile(file);
                    if (!file && existingVideoUrl) {
                      setVideoToDelete(existingVideoUrl);
                      setExistingVideoUrl('');
                    }
                  }}
                  disabled={saving}
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="35.00"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="A beautiful handmade crochet item..."
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  id="tags"
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="amigurumi, bunny, kids, gift"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Customer Color Customization (optional)
                </label>
                <p className="text-xs text-gray-600 mb-4">
                  Allow customers to choose colors for different parts of this product. Enable up to 3 color options.
                </p>
                
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  {/* Color Option 1 */}
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.colorOption1Enabled}
                        onChange={(e) => setFormData({ ...formData, colorOption1Enabled: e.target.checked })}
                        className="mr-2 w-4 h-4 text-purple border-gray-300 rounded focus:ring-2 focus:ring-purple"
                      />
                      <span className="text-sm text-gray-700">Color Option 1</span>
                    </label>
                    {formData.colorOption1Enabled && (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={formData.colorOption1Label}
                          onChange={(e) => setFormData({ ...formData, colorOption1Label: e.target.value })}
                          placeholder="e.g., Flower color, Body color"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent text-sm"
                        />
                        <ColorMultiSelect
                          selectedColors={colorOption1Colors}
                          onChange={setColorOption1Colors}
                          label="Available colors for this option"
                        />
                      </div>
                    )}
                  </div>

                  {/* Color Option 2 */}
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.colorOption2Enabled}
                        onChange={(e) => setFormData({ ...formData, colorOption2Enabled: e.target.checked })}
                        className="mr-2 w-4 h-4 text-purple border-gray-300 rounded focus:ring-2 focus:ring-purple"
                      />
                      <span className="text-sm text-gray-700">Color Option 2</span>
                    </label>
                    {formData.colorOption2Enabled && (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={formData.colorOption2Label}
                          onChange={(e) => setFormData({ ...formData, colorOption2Label: e.target.value })}
                          placeholder="e.g., Leaf color, Tail color"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent text-sm"
                        />
                        <ColorMultiSelect
                          selectedColors={colorOption2Colors}
                          onChange={setColorOption2Colors}
                          label="Available colors for this option"
                        />
                      </div>
                    )}
                  </div>

                  {/* Color Option 3 */}
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.colorOption3Enabled}
                        onChange={(e) => setFormData({ ...formData, colorOption3Enabled: e.target.checked })}
                        className="mr-2 w-4 h-4 text-purple border-gray-300 rounded focus:ring-2 focus:ring-purple"
                      />
                      <span className="text-sm text-gray-700">Color Option 3</span>
                    </label>
                    {formData.colorOption3Enabled && (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={formData.colorOption3Label}
                          onChange={(e) => setFormData({ ...formData, colorOption3Label: e.target.value })}
                          placeholder="e.g., Head color, Eye color"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent text-sm"
                        />
                        <ColorMultiSelect
                          selectedColors={colorOption3Colors}
                          onChange={setColorOption3Colors}
                          label="Available colors for this option"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Dimensions (optional)
                </label>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <label htmlFor="width" className="block text-xs text-gray-600 mb-1">Width</label>
                    <input
                      id="width"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.width}
                      onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label htmlFor="height" className="block text-xs text-gray-600 mb-1">Height</label>
                    <input
                      id="height"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <label htmlFor="depth" className="block text-xs text-gray-600 mb-1">Depth</label>
                    <input
                      id="depth"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.depth}
                      onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      placeholder="8"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="dimensionUnit"
                      value="cm"
                      checked={formData.dimensionUnit === 'cm'}
                      onChange={(e) => setFormData({ ...formData, dimensionUnit: e.target.value as 'cm' | 'inches' })}
                      className="mr-2 text-purple focus:ring-purple"
                    />
                    <span className="text-sm text-gray-700">cm</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="dimensionUnit"
                      value="inches"
                      checked={formData.dimensionUnit === 'inches'}
                      onChange={(e) => setFormData({ ...formData, dimensionUnit: e.target.value as 'cm' | 'inches' })}
                      className="mr-2 text-purple focus:ring-purple"
                    />
                    <span className="text-sm text-gray-700">inches</span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Weight (optional)
                </label>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <input
                      id="weight"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      placeholder="0.5"
                    />
                  </div>
                  <div className="flex gap-4 pb-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="weightUnit"
                        value="kg"
                        checked={formData.weightUnit === 'kg'}
                        onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value as 'kg' | 'lbs' })}
                        className="mr-2 text-purple focus:ring-purple"
                      />
                      <span className="text-sm text-gray-700">kg</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="weightUnit"
                        value="lbs"
                        checked={formData.weightUnit === 'lbs'}
                        onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value as 'kg' | 'lbs' })}
                        className="mr-2 text-purple focus:ring-purple"
                      />
                      <span className="text-sm text-gray-700">lbs</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="mr-2 w-5 h-5 text-purple border-gray-300 rounded focus:ring-2 focus:ring-purple"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Product</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="mr-2 w-5 h-5 text-purple border-gray-300 rounded focus:ring-2 focus:ring-purple"
                  />
                  <span className="text-sm font-medium text-gray-700">In Stock</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving Changes...' : 'Save Changes'}
                </button>
                <Link
                  href="/admin/products"
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-soft hover:bg-gray-50 transition-all text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
