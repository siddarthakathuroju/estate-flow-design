
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bath, BedDouble, Square, Heart, Tag, Clock, Wallet, Bitcoin, CircleDollarSign, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/components/ui/use-toast';
import { addTransaction } from '@/services/transactionService';

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
  const [transactionType, setTransactionType] = useState<'buy' | 'sell'>('buy');
  const { isConnected, address: walletAddress } = useWallet();
  const { toast } = useToast();

  // Randomly determine if the property uses ETH or BTC for demo purposes
  const useEthereum = id % 2 === 0;
  const cryptoSymbol = useEthereum ? 'ETH' : 'BTC';
  const cryptoPrice = useEthereum ? (price / 3000).toFixed(2) : (price / 40000).toFixed(4);
  
  // Generate random token ID for NFT properties
  const tokenId = `#${Math.floor(10000 + Math.random() * 90000)}`;
  
  // Generate a fallback image if the provided image URL is empty or undefined
  const propertyImage = image || getPropertyImage(id);

  // Toggle between buy and sell
  const toggleTransactionType = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTransactionType(transactionType === 'buy' ? 'sell' : 'buy');
  };

  // Quick purchase or sell function
  const handleTransaction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isConnected || !walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to purchase this property",
        variant: "destructive"
      });
      return;
    }
    
    // Add transaction to history
    addTransaction({
      userId: walletAddress,
      propertyId: id.toString(),
      propertyName: title,
      propertyImage: propertyImage,
      type: transactionType,
      amount: parseFloat(cryptoPrice),
      status: 'completed'
    });
    
    toast({
      title: transactionType === 'buy' ? "Purchase Successful!" : "Sale Successful!",
      description: transactionType === 'buy' 
        ? `You have purchased ${title} for ${cryptoPrice} ${cryptoSymbol}`
        : `You have sold ${title} for ${cryptoPrice} ${cryptoSymbol}`,
    });
  };

  return (
    <div 
      className={cn(
        'group glass-card rounded-xl overflow-hidden transition-all duration-300 hover-lift card-shimmer',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 overflow-hidden">
        <Link to={`/properties/${id}`}>
          <img
            src={propertyImage}
            alt={title}
            className={cn(
              'w-full h-full object-cover transition-all duration-500',
              isHovered ? 'scale-110' : 'scale-100'
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
          <div className="glass px-3 py-1 rounded-full text-sm font-medium text-white shadow-md flex items-center">
            {useEthereum ? <CircleDollarSign size={14} className="mr-1 text-purple-500" /> : <Bitcoin size={14} className="mr-1 text-orange-500" />}
            <span>{cryptoPrice} {cryptoSymbol}</span>
          </div>
          <div className="special-gradient text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
            {formatPrice(price)}
          </div>
        </div>
        
        {featured && (
          <div className="absolute top-3 left-3 special-gradient px-3 py-1 rounded-full text-xs font-medium text-white shadow-md">
            Featured
          </div>
        )}
        
        {/* NFT Token Badge */}
        <div className="absolute top-12 left-3 bg-violet-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium shadow-md flex items-center">
          <Wallet size={12} className="mr-1" /> NFT {tokenId}
        </div>
        
        {/* Marketplace Indicators */}
        <div className="absolute top-[5.5rem] left-3 bg-amber-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium shadow-md flex items-center">
          <Tag size={12} className="mr-1" /> For {transactionType === 'buy' ? 'Sale' : 'Purchase'}
        </div>
        
        <div className="absolute top-24 left-3 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium shadow-md flex items-center">
          <Clock size={12} className="mr-1" /> New (2 days)
        </div>

        {/* Transaction Type Toggle - Shows up when hovered */}
        {isHovered && (
          <Button
            className="absolute bottom-12 right-3 bg-white hover:bg-gray-100 text-gray-800 text-xs font-medium transition-all shadow-md z-10"
            size="sm"
            onClick={toggleTransactionType}
          >
            <ArrowLeftRight size={14} className="mr-1" />
            Switch to {transactionType === 'buy' ? 'Sell' : 'Buy'}
          </Button>
        )}

        {/* Quick Buy/Sell Button - Only shown when hovered */}
        {isHovered && (
          <Button
            className={cn(
              "absolute bottom-3 right-3 text-white shadow-md text-xs font-medium transition-all z-10",
              transactionType === 'buy' 
                ? "bg-estate-500 hover:bg-estate-600" 
                : "bg-orange-500 hover:bg-orange-600"
            )}
            size="sm"
            onClick={handleTransaction}
          >
            Quick {transactionType === 'buy' ? 'Buy' : 'Sell'}
          </Button>
        )}
      </div>
      
      <div className="p-5">
        <Link to={`/properties/${id}`} className="block">
          <h3 className="text-lg font-medium mb-1 transition-colors group-hover:text-estate-500">{title}</h3>
          <p className="text-muted-foreground text-sm mb-2">{address}</p>
          <p className="text-xs text-gradient font-semibold mb-4">Blockchain Verified • Smart Contract Enabled</p>
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
            <div className="w-7 h-7 rounded-full bg-estate-200 border-2 border-white flex items-center justify-center text-xs text-estate-700 float">JD</div>
            <div className="w-7 h-7 rounded-full bg-estate-300 border-2 border-white flex items-center justify-center text-xs text-white float" style={{ animationDelay: "0.2s" }}>AM</div>
            <div className="w-7 h-7 rounded-full bg-estate-400 border-2 border-white flex items-center justify-center text-xs text-white float" style={{ animationDelay: "0.4s" }}>+3</div>
          </div>
          <Link 
            to={`/properties/${id}`}
            className="text-xs font-medium text-estate-500 hover:text-estate-600 group-hover:text-estate-600 transition-colors"
          >
            View NFT Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

// Function to generate a property image based on the property ID
function getPropertyImage(id: number): string {
  const imagePool = [
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
  ];
  
  // Use modulo to cycle through the image pool
  return imagePool[id % imagePool.length];
}

export default PropertyCard;
