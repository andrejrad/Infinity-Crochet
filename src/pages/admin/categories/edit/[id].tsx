import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import SEO from '@/components/SEO';
import ProtectedRoute from '@/components/ProtectedRoute';
import SingleImageUpload from '@/components/SingleImageUpload';
import Link from 'next/link';

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    featured: false,
  });

  useEffect(() => {
    if (id) {
      loadCategory(id as string);
    }
  }, [id]);

  const loadCategory = async (categoryId: string) => {
    try {
      const docRef = doc(db, 'categories', categoryId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          image: data.image || '',
          featured: data.featured || false,
        });
      } else {
        setError('Category not found');
      }
    } catch (err) {
      console.error('Error loading category:', err);
      setError('Failed to load category');
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.slug || !formData.description) {
        setError('Please fill in all required fields');
        setSaving(false);
        return;
      }

      // Update category in Firestore
      await updateDoc(doc(db, 'categories', id as string), {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        image: formData.image || '',
        featured: formData.featured,
      });

      // Redirect to categories list
      router.push('/admin/categories');
    } catch (err: any) {
      console.error('Error updating category:', err);
      setError(err.message || 'Failed to update category');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple mx-auto mb-4"></div>
            <p className="text-gray-600">Loading category...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <SEO title="Edit Category - Admin" />
      
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
                Edit Category
              </h1>
              <p className="text-gray-600 mt-1">
                Update category details
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
                  disabled={saving}
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
                  disabled={saving}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving Changes...' : 'Save Changes'}
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
