
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ALL_PROPERTIES } from '@/lib/constants';
import { formatPrice } from '@/lib/animations';
import { ArrowLeft, MapPin, BedDouble, Bath, Square, ChevronRight, Heart, Share2, Wallet, Bitcoin, CircleDollarSign, Blocks, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  const property = ALL_PROPERTIES.find(p => p.id === Number(id));
  
  // NFT specific data for demonstration
  const propertyId = Number(id);
  const useEthereum = propertyId % 2 === 0;
  const cryptoSymbol = useEthereum ? 'ETH' : 'BTC';
  const cryptoPrice = useEthereum ? (property?.price ? property.price / 3000 : 0).toFixed(2) : (property?.price ? property.price / 40000 : 0).toFixed(4);
  const tokenId = `#${Math.floor(10000 + Math.random() * 90000)}`;
  const blockchain = useEthereum ? 'Ethereum' : 'Bitcoin (via Ordinals)';
  const contractAddress = useEthereum 
    ? `0x${Math.random().toString(16).slice(2, 42)}` 
    : `bc1${Math.random().toString(16).slice(2, 28)}`;
  
  // Transaction history (simulated)
  const transactions = [
    { date: '2023-12-15', action: 'Minted', from: '0x0000...', to: '0xAbC1...', price: useEthereum ? '1.2 ETH' : '0.09 BTC' },
    { date: '2024-01-03', action: 'Transfer', from: '0xAbC1...', to: '0xDeF2...', price: '-' },
    { date: '2024-02-18', action: 'Listed', from: '0xDeF2...', to: '-', price: cryptoPrice + ' ' + cryptoSymbol },
  ];
  
  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    window.scrollTo(0, 0);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-medium mb-4">Property Not Found</h1>
            <button
              onClick={() => navigate('/properties')}
              className="px-4 py-2 bg-estate-500 text-white rounded-lg hover:bg-estate-600 transition-colors"
            >
              Back to Properties
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className={cn(
      'min-h-screen transition-opacity duration-500',
      isLoaded ? 'opacity-100' : 'opacity-0'
    )}>
      <Navbar />
      
      {/* Property Header */}
      <section className="pt-24 pb-8">
        <div className="container">
          <div className="mb-6">
            <button
              onClick={() => navigate('/properties')}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to Properties
            </button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="animate-fade-in">
                <h1 className="text-3xl font-medium">{property.title}</h1>
                <div className="flex items-center text-muted-foreground mt-1">
                  <MapPin size={16} className="mr-1" />
                  <span>{property.address}</span>
                </div>
                <div className="flex items-center mt-2 text-purple-600 text-sm font-medium">
                  <Blocks size={16} className="mr-1" />
                  <span>NFT Property • Token {tokenId} • {blockchain}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 animate-fade-in delay-200">
                <div className="flex flex-col items-end">
                  <div className="flex items-center text-xl font-medium">
                    {useEthereum ? <CircleDollarSign size={18} className="mr-1 text-purple-500" /> : <Bitcoin size={18} className="mr-1 text-orange-500" />}
                    <span>{cryptoPrice} {cryptoSymbol}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatPrice(property.price)}
                  </div>
                </div>
                
                <button
                  className={cn(
                    "p-2 rounded-full border transition-all",
                    isFavorite 
                      ? "bg-red-50 border-red-200 text-red-500" 
                      : "border-border hover:bg-secondary/50"
                  )}
                  onClick={() => setIsFavorite(!isFavorite)}
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                </button>
                
                <button
                  className="p-2 rounded-full border border-border hover:bg-secondary/50 transition-all"
                  aria-label="Share property"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Property Image */}
          <div className="aspect-[16/9] rounded-lg overflow-hidden mb-8 animate-fade-in delay-100">
            <img 
              src={property.image} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Property Tabs */}
          <div className="border-b border-border mb-8">
            <div className="flex space-x-8">
              <button
                className={cn(
                  "pb-2 font-medium transition-colors", 
                  activeTab === 'details'
                    ? "border-b-2 border-estate-500 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setActiveTab('details')}
              >
                Property Details
              </button>
              <button
                className={cn(
                  "pb-2 font-medium transition-colors", 
                  activeTab === 'nft'
                    ? "border-b-2 border-estate-500 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setActiveTab('nft')}
              >
                NFT Information
              </button>
              <button
                className={cn(
                  "pb-2 font-medium transition-colors", 
                  activeTab === 'history'
                    ? "border-b-2 border-estate-500 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setActiveTab('history')}
              >
                Transaction History
              </button>
            </div>
          </div>
          
          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 animate-fade-in delay-200">
              
              {activeTab === 'details' && (
                <>
                  <div className="flex items-center justify-between bg-secondary/50 p-4 rounded-lg mb-8">
                    <div className="flex items-center">
                      <BedDouble size={20} className="mr-2 text-estate-500" />
                      <div>
                        <div className="font-medium">{property.bedrooms}</div>
                        <div className="text-xs text-muted-foreground">Bedrooms</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Bath size={20} className="mr-2 text-estate-500" />
                      <div>
                        <div className="font-medium">{property.bathrooms}</div>
                        <div className="text-xs text-muted-foreground">Bathrooms</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Square size={20} className="mr-2 text-estate-500" />
                      <div>
                        <div className="font-medium">{property.area.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Square Feet</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-xl font-medium mb-4">Description</h2>
                    <div className="prose prose-slate max-w-none">
                      <p>{property.description}</p>
                      <p>
                        This exceptional property features spacious living areas with premium finishes throughout. 
                        The open-concept design connects living, dining, and kitchen spaces, creating a perfect environment for both entertaining and everyday living.
                      </p>
                      <p>
                        Located in a prestigious neighborhood, this home offers convenient access to top-rated schools, shopping, dining, and transportation options.
                      </p>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="mb-8">
                    <h2 className="text-xl font-medium mb-4">Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <ChevronRight size={16} className="mr-2 text-estate-500" />
                        <span>Central Air Conditioning</span>
                      </div>
                      <div className="flex items-center">
                        <ChevronRight size={16} className="mr-2 text-estate-500" />
                        <span>Gourmet Kitchen</span>
                      </div>
                      <div className="flex items-center">
                        <ChevronRight size={16} className="mr-2 text-estate-500" />
                        <span>Hardwood Floors</span>
                      </div>
                      <div className="flex items-center">
                        <ChevronRight size={16} className="mr-2 text-estate-500" />
                        <span>Walk-in Closets</span>
                      </div>
                      <div className="flex items-center">
                        <ChevronRight size={16} className="mr-2 text-estate-500" />
                        <span>Smart Home Features</span>
                      </div>
                      <div className="flex items-center">
                        <ChevronRight size={16} className="mr-2 text-estate-500" />
                        <span>Private Balcony</span>
                      </div>
                      <div className="flex items-center">
                        <ChevronRight size={16} className="mr-2 text-estate-500" />
                        <span>High Ceilings</span>
                      </div>
                      <div className="flex items-center">
                        <ChevronRight size={16} className="mr-2 text-estate-500" />
                        <span>Energy Efficient</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === 'nft' && (
                <div>
                  <div className="bg-violet-50 border border-violet-200 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-medium mb-4 text-violet-800">NFT Property Information</h2>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-32 text-sm font-medium text-violet-700">Token ID:</div>
                        <div>{tokenId}</div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-32 text-sm font-medium text-violet-700">Blockchain:</div>
                        <div>{blockchain}</div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-32 text-sm font-medium text-violet-700">Contract:</div>
                        <div className="flex items-center text-sm">
                          <span className="mr-2 font-mono">{contractAddress}</span>
                          <button className="text-violet-600 hover:text-violet-800 transition-colors">View</button>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-32 text-sm font-medium text-violet-700">Token Standard:</div>
                        <div>{useEthereum ? 'ERC-721' : 'Ordinals BRC-20'}</div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-32 text-sm font-medium text-violet-700">Metadata:</div>
                        <div className="flex items-center">
                          <span className="mr-2">IPFS/Arweave Decentralized Storage</span>
                          <ShieldCheck size={16} className="text-green-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-xl font-medium mb-4">Digital Ownership Benefits</h2>
                    <div className="space-y-4">
                      <div className="bg-white border border-border rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2">Immutable Ownership Record</h3>
                        <p className="text-muted-foreground">The property deed is secured on the blockchain, providing an immutable record of ownership that cannot be altered, forged, or disputed.</p>
                      </div>
                      
                      <div className="bg-white border border-border rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2">Fractional Ownership</h3>
                        <p className="text-muted-foreground">This property can be fractionalized, allowing multiple investors to own a percentage of the property and share in its value appreciation.</p>
                      </div>
                      
                      <div className="bg-white border border-border rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2">Smart Contract Features</h3>
                        <p className="text-muted-foreground">Built-in smart contracts automate rental payments, maintenance schedules, and property management tasks, reducing friction and overhead costs.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'history' && (
                <div>
                  <h2 className="text-xl font-medium mb-4">Transaction History</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx, index) => (
                        <TableRow key={index}>
                          <TableCell>{tx.date}</TableCell>
                          <TableCell>{tx.action}</TableCell>
                          <TableCell className="font-mono text-xs">{tx.from}</TableCell>
                          <TableCell className="font-mono text-xs">{tx.to}</TableCell>
                          <TableCell>{tx.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
            
            {/* Contact Card */}
            <div className="md:col-span-1 animate-fade-in delay-300">
              <div className="bg-white rounded-lg border border-border/60 shadow-sm p-6 sticky top-32">
                <h3 className="text-lg font-medium mb-4">Purchase this NFT Property</h3>
                
                <div className="flex items-center justify-between bg-violet-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center">
                    {useEthereum ? <CircleDollarSign size={16} className="mr-1 text-purple-500" /> : <Bitcoin size={16} className="mr-1 text-orange-500" />}
                    <span className="text-violet-900 font-medium">{cryptoPrice} {cryptoSymbol}</span>
                  </div>
                  <span className="text-sm text-violet-700">{formatPrice(property.price)}</span>
                </div>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Wallet Address</label>
                    <Input
                      type="text"
                      placeholder="0x..."
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Network Fee</span>
                      <span>{useEthereum ? '0.005 ETH' : '0.0001 BTC'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span>Total Amount</span>
                      <span>
                        {useEthereum ? 
                          (parseFloat(cryptoPrice) + 0.005).toFixed(2) : 
                          (parseFloat(cryptoPrice) + 0.0001).toFixed(4)
                        } {cryptoSymbol}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    className="w-full py-3 px-4 bg-estate-500 text-white font-medium rounded-lg hover:bg-estate-600 transition-colors"
                  >
                    Buy NFT Property
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                  >
                    Make an Offer
                  </Button>
                  
                  <div className="text-xs text-center text-muted-foreground">
                    By completing this purchase, you agree to our terms and receive full digital ownership rights to this NFT property.
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default PropertyDetail;
