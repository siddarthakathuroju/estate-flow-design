import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bath, BedDouble, Square, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/animations';

interface PropertyCardProps {
  id: number;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  featured?: boolean;
  className?: string;
}

const PropertyCard = ({
  id,
  title,
  address,
  price,
  bedrooms,
  bathrooms,
  area,
  image,
  featured,
  className,
}: PropertyCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div 
      className={cn(
        'group bg-white rounded-lg overflow-hidden shadow-sm border border-border/40 transition-all duration-300 hover:shadow-md',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 overflow-hidden">
        <Link to={`/properties/${id}`}>
          <img
            src={image}
            alt={title}
            className={cn(
              'w-full h-full object-cover transition-all duration-500',
              isHovered ? 'scale-105' : 'scale-100'
            )}
          />
        </Link>
        
        <button
          className={cn(
            'absolute top-3 right-3 p-2 rounded-full transition-all duration-300 z-10',
            isFavorite 
              ? 'bg-white/90 text-red-500' 
              : 'bg-black/20 text-white hover:bg-white/90 hover:text-foreground'
          )}
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-foreground shadow-sm">
          {formatPrice(price)}
        </div>
        
        {featured && (
          <div className="absolute top-3 left-3 bg-estate-500 px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-4">
        <Link to={`/properties/${id}`} className="block">
          <h3 className="text-lg font-medium mb-1 transition-colors group-hover:text-estate-500">{title}</h3>
          <p className="text-muted-foreground text-sm mb-4">{address}</p>
        </Link>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <BedDouble size={16} className="mr-1" />
            <span>{bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}</span>
          </div>
          <div className="flex items-center">
            <Bath size={16} className="mr-1" />
            <span>{bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}</span>
          </div>
          <div className="flex items-center">
            <Square size={16} className="mr-1" />
            <span>{area.toLocaleString()} ft²</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
