import { useState } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import SEO from '@/components/SEO';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import productsData from '@/data/products.json';

export default function MigratePage() {
  const [migrating, setMigrating] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleMigrate = async () => {
    setMigrating(true);
    setResult('');

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const product of productsData) {
        try {
          await setDoc(doc(db, 'products', product.id), {
            name: product.name,
            slug: product.slug,
            category: product.category,
            price: product.price,
            description: product.description,
            image: product.image,
            images: product.images,
            featured: product.featured,
            inStock: product.inStock,
            tags: product.tags,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          successCount++;
        } catch (err) {
          console.error(`Error migrating ${product.name}:`, err);
          errorCount++;
        }
      }

      setResult(`Migration complete! ${successCount} products migrated successfully. ${errorCount} errors.`);
    } catch (err: any) {
      setResult(`Migration failed: ${err.message}`);
    } finally {
      setMigrating(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <SEO 
        title="Migrate Data - Admin"
        description="Migrate product data to Firestore"
      />
      
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container-custom max-w-2xl">
          <div className="mb-6">
            <Link href="/admin" className="text-purple hover:text-purple-dark">
              ← Back to Dashboard
            </Link>
          </div>

          <div className="card p-8">
            <h1 className="text-3xl font-bold text-purple-dark mb-4">
              Migrate Products to Firestore
            </h1>
            
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
              <p className="font-medium mb-2">⚠️ Important:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>This will copy all products from JSON files to Firestore</li>
                <li>Existing products in Firestore with the same ID will be overwritten</li>
                <li>You only need to run this once</li>
                <li>After migration, products will be managed through the admin dashboard</li>
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                Found <strong>{productsData.length} products</strong> in JSON files ready to migrate.
              </p>
            </div>

            {result && (
              <div className={`px-4 py-3 rounded-lg mb-6 ${
                result.includes('failed') || result.includes('errors')
                  ? 'bg-red-50 border border-red-200 text-red-700'
                  : 'bg-green-50 border border-green-200 text-green-700'
              }`}>
                {result}
              </div>
            )}

            <button
              onClick={handleMigrate}
              disabled={migrating}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {migrating ? 'Migrating...' : 'Start Migration'}
            </button>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">After Migration:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Go to <Link href="/admin/products" className="text-purple hover:underline">Manage Products</Link> to see migrated data</li>
                <li>✓ The shop pages will automatically use Firestore data</li>
                <li>✓ You can add, edit, or delete products through the admin panel</li>
                <li>✓ JSON files will remain as backup but won't be used</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
