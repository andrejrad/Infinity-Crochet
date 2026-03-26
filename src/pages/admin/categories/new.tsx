import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import SEO from '@/components/SEO';
import ProtectedRoute from '@/components/ProtectedRoute';
import SingleImageUpload from '@/components/SingleImageUpload';
import Link from 'next/link';

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    featured: false,
  });

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.slug || !formData.description) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Add category to Firestore
      await addDoc(collection(db, 'categories'), {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        image: formData.image || '',
        featured: formData.featured,
      });

      // Redirect to categories list
      router.push('/admin/categories');
    } catch (err: any) {
      console.error('Error adding category:', err);
      setError(err.message || 'Failed to add category');
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <SEO title="Add New Category - Admin" />
      
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container-custom max-w-3xl">
          <div className="mb-6">
            <Link href="/admin/categories" className="text-purple hover:text-purple-dark">
              ← Back to Categories
            </Link>
          </div>

          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-purple-dark">
                Add New Category
              </h1>
              <p className="text-gray-600 mt-1">
                Create a new product category for your shop
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="Amigurumi"
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
                  placeholder="amigurumi"
                />
                <p className="text-sm text-gray-500 mt-1">Auto-generated from name. Make it URL-friendly.</p>
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
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="Cute handmade crochet animals and characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Icon/Image
                </label>
                <SingleImageUpload 
                  currentImage={formData.image}
                  onImageChange={(url) => setFormData({ ...formData, image: url })}
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Upload an icon or representative image for this category
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 text-purple border-gray-300 rounded focus:ring-2 focus:ring-purple"
                />
                <label htmlFor="featured" className="ml-3 text-sm font-medium text-gray-700">
                  Featured Category (show on homepage)
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding Category...' : 'Add Category'}
                </button>
                <Link
                  href="/admin/categories"
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
