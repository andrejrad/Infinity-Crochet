import { useState, useEffect } from 'react';
import SEO from '@/components/SEO';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Category } from '@/types/user';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesRef = collection(db, 'categories');
      const snapshot = await getDocs(categoriesRef);
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      setCategories(categoriesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(id);
    try {
      await deleteDoc(doc(db, 'categories', id));
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <SEO title="Manage Categories - Admin" />
      
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container-custom">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/admin" className="text-purple hover:text-purple-dark">
              ← Back to Dashboard
            </Link>
            <Link href="/admin/categories/new" className="btn-primary">
              + Add New Category
            </Link>
          </div>

          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-purple-dark">
                Category Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your shop categories and organization
              </p>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📂</div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No categories yet</h2>
                <p className="text-gray-600 mb-6">Get started by creating your first category</p>
                <Link href="/admin/categories/new" className="btn-primary">
                  + Add New Category
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Icon
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Slug
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Featured
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map(category => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {category.image ? (
                            <img 
                              src={category.image} 
                              alt={category.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-2xl">
                              📂
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{category.name}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {category.slug}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                          {category.description}
                        </td>
                        <td className="px-6 py-4">
                          {category.featured ? (
                            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-dark rounded-full">
                              Featured
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                              Regular
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Link 
                            href={`/admin/categories/edit/${category.id}`}
                            className="text-purple hover:text-purple-dark font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(category.id, category.name)}
                            disabled={deleting === category.id}
                            className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                          >
                            {deleting === category.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
