import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import SEO from '@/components/SEO';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import type { Category } from '@/types/user';
import ImageUploadManager from '@/components/ImageUploadManager';
import { uploadProductImages, generateProductId, uploadProductVideo } from '@/lib/imageUpload';
import ColorMultiSelect from '@/components/ColorMultiSelect';
import VideoUpload from '@/components/VideoUpload';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
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

  const [colorOption1Colors, setColorOption1Colors] = useState<string[]>([]);
  const [colorOption2Colors, setColorOption2Colors] = useState<string[]>([]);
  const [colorOption3Colors, setColorOption3Colors] = useState<string[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesRef = collection(db, 'categories');
      const snapshot = await getDocs(categoriesRef);
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      setCategories(categoriesData);
      // Set first category as default if available
      if (categoriesData.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: categoriesData[0].id }));
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoadingCategories(false);
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
    setImageFiles(files);
  };

  const handleImageDelete = (index: number) => {
    // Images are already removed by the component
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate images
    if (imageFiles.length === 0) {
      setError('Please upload at least one product image');
      return;
    }

    setLoading(true);
    setUploading(true);

    try {
      // Generate unique product ID
      const productId = generateProductId();

      // Upload images to Firebase Storage
      const uploadedUrls = await uploadProductImages(
        imageFiles,
        productId,
        (current, total) => setUploadProgress({ current, total })
      );

      // Upload video if provided
      let videoUrl: string | undefined = undefined;
      if (videoFile) {
        videoUrl = await uploadProductVideo(videoFile, productId);
      }

      setUploading(false);

      // Prepare tags array
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

      // Create product document with uploaded image URLs
      await setDoc(doc(db, 'products', productId), {
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
        image: uploadedUrls[mainImageIndex], // Main image
        images: uploadedUrls, // All images
        ...(videoUrl && { video: videoUrl }),
        featured: formData.featured,
        inStock: formData.inStock,
        tags: tagsArray,
        ...(dimensions && { dimensions }),
        ...(weight && { weight }),
        ...(hasColorOptions && { colorOptions }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      router.push('/admin/products');
    } catch (err: any) {
      console.error('Error adding product:', err);
      setError(err.message || 'Failed to add product');
      setUploading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <SEO 
        title="Add New Product - Admin"
        description="Add a new product to the shop"
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
              Add New Product
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
                <p className="text-sm text-gray-500 mt-1">Auto-generated from name. Make it URL-friendly.</p>
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
                    <option value="">Select a category</option>
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
                  disabled={loading}
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
                  videoFile={videoFile}
                  onVideoChange={setVideoFile}
                  disabled={loading}
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
                    <div className="flex items-center gap-4">
                      <label className="flex items-center min-w-[120px]">
                        <input
                          type="checkbox"
                          checked={formData.colorOption1Enabled}
                          onChange={(e) => setFormData({ ...formData, colorOption1Enabled: e.target.checked })}
                          className="mr-2 w-4 h-4 text-purple border-gray-300 rounded focus:ring-2 focus:ring-purple"
                        />
                        <span className="text-sm text-gray-700">Color Option 1</span>
                      </label>
                      {formData.colorOption1Enabled && (
                        <input
                          type="text"
                          value={formData.colorOption1Label}
                          onChange={(e) => setFormData({ ...formData, colorOption1Label: e.target.value })}
                          placeholder="e.g., Flower color, Body color"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent text-sm"
                        />
                      )}
                    </div>
                    {formData.colorOption1Enabled && (
                      <div className="ml-[136px]">
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
                    <div className="flex items-center gap-4">
                      <label className="flex items-center min-w-[120px]">
                        <input
                          type="checkbox"
                          checked={formData.colorOption2Enabled}
                          onChange={(e) => setFormData({ ...formData, colorOption2Enabled: e.target.checked })}
                          className="mr-2 w-4 h-4 text-purple border-gray-300 rounded focus:ring-2 focus:ring-purple"
                        />
                        <span className="text-sm text-gray-700">Color Option 2</span>
                      </label>
                      {formData.colorOption2Enabled && (
                        <input
                          type="text"
                          value={formData.colorOption2Label}
                          onChange={(e) => setFormData({ ...formData, colorOption2Label: e.target.value })}
                          placeholder="e.g., Leaf color, Tail color"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent text-sm"
                        />
                      )}
                    </div>
                    {formData.colorOption2Enabled && (
                      <div className="ml-[136px]">
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
                    <div className="flex items-center gap-4">
                      <label className="flex items-center min-w-[120px]">
                        <input
                          type="checkbox"
                          checked={formData.colorOption3Enabled}
                          onChange={(e) => setFormData({ ...formData, colorOption3Enabled: e.target.checked })}
                          className="mr-2 w-4 h-4 text-purple border-gray-300 rounded focus:ring-2 focus:ring-purple"
                        />
                        <span className="text-sm text-gray-700">Color Option 3</span>
                      </label>
                      {formData.colorOption3Enabled && (
                        <input
                          type="text"
                          value={formData.colorOption3Label}
                          onChange={(e) => setFormData({ ...formData, colorOption3Label: e.target.value })}
                          placeholder="e.g., Head color, Eye color"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent text-sm"
                        />
                      )}
                    </div>
                    {formData.colorOption3Enabled && (
                      <div className="ml-[136px]">
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
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding Product...' : 'Add Product'}
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