import Link from 'next/link';
import Image from 'next/image';

interface CategoryTileProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export default function CategoryTile({ id, name, slug, description, image }: CategoryTileProps) {
  return (
    <Link href={`/shop/category/${slug}`} className="card group">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-lilac-light to-lilac">
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            🧶
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="py-3 px-6">
        <h3 className="text-2xl font-semibold text-purple-dark mb-2">
          {name}
        </h3>
      </div>
    </Link>
  );
}
