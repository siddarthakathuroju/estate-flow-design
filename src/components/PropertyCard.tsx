
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bath, BedDouble, Square, Heart, Tag, Clock, Wallet, Bitcoin, CircleDollarSign } from 'lucide-react';
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

  // Randomly determine if the property uses ETH or BTC for demo purposes
  const useEthereum = id % 2 === 0;
  const cryptoSymbol = useEthereum ? 'ETH' : 'BTC';
  const cryptoPrice = useEthereum ? (price / 3000).toFixed(2) : (price / 40000).toFixed(4);
  
  // Generate random token ID for NFT properties
  const tokenId = `#${Math.floor(10000 + Math.random() * 90000)}`;

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
        
        <div className="absolute bottom-3 left-3 flex items-center space-x-2">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-foreground shadow-sm flex items-center">
            {useEthereum ? <CircleDollarSign size={14} className="mr-1 text-purple-500" /> : <Bitcoin size={14} className="mr-1 text-orange-500" />}
            <span>{cryptoPrice} {cryptoSymbol}</span>
          </div>
          <div className="bg-gray-900/90 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
            {formatPrice(price)}
          </div>
        </div>
        
        {featured && (
          <div className="absolute top-3 left-3 bg-estate-500 px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm">
            Featured
          </div>
        )}
        
        {/* NFT Token Badge */}
        <div className="absolute top-12 left-3 bg-violet-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm flex items-center">
          <Wallet size={12} className="mr-1" /> NFT {tokenId}
        </div>
        
        {/* Marketplace Indicators */}
        <div className="absolute top-[5.5rem] left-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm flex items-center">
          <Tag size={12} className="mr-1" /> For Sale
        </div>
        
        <div className="absolute top-24 left-3 bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm flex items-center">
          <Clock size={12} className="mr-1" /> New (2 days)
        </div>
      </div>
      
      <div className="p-4">
        <Link to={`/properties/${id}`} className="block">
          <h3 className="text-lg font-medium mb-1 transition-colors group-hover:text-estate-500">{title}</h3>
          <p className="text-muted-foreground text-sm mb-2">{address}</p>
          <p className="text-xs text-purple-600 font-semibold mb-4">Blockchain Verified • Smart Contract Enabled</p>
        </Link>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
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
        
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-estate-200 border-2 border-white flex items-center justify-center text-xs text-estate-700">JD</div>
            <div className="w-7 h-7 rounded-full bg-estate-300 border-2 border-white flex items-center justify-center text-xs text-white">AM</div>
            <div className="w-7 h-7 rounded-full bg-estate-400 border-2 border-white flex items-center justify-center text-xs text-white">+3</div>
          </div>
          <Link 
            to={`/properties/${id}`}
            className="text-xs font-medium text-estate-500 hover:text-estate-600"
          >
            View NFT Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
