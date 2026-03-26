import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  image: string;
  featured?: boolean;
  inStock?: boolean;
}

export default function ProductCard({ 
  id, 
  name, 
  slug, 
  category, 
  price, 
  description, 
  image, 
  inStock = true 
}: ProductCardProps) {
  return (
    <Link href={`/shop/product/${slug}`} className="card group">
      <div className="relative h-80 overflow-hidden bg-gradient-to-br from-lilac-light to-white">
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-7xl">
            🧶
          </div>
        )}
        {!inStock && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Out of Stock
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-purple-dark group-hover:text-purple transition-colors">
            {name}
          </h3>
          <span className="text-lg font-bold text-purple">
            ${price.toFixed(2)}
          </span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {description}
        </p>
        <div className="flex justify-end items-center">
          <span className="text-purple text-sm group-hover:translate-x-1 transition-transform inline-block">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
