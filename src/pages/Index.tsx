
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Home, Building2, Clock, Award, Wallet, Info, Check } from 'lucide-react';
import Hero from '@/components/Hero';
import FeaturedProperties from '@/components/FeaturedProperties';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { COMPANY_INFO, FEATURED_PROPERTIES } from '@/lib/constants';
import { useInView } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWalletConnection } from '@/hooks/use-wallet';
import PropertyCard from '@/components/PropertyCard';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref: aboutRef, isInView: aboutIsInView } = useInView();
  const { ref: ctaRef, isInView: ctaIsInView } = useInView();
  const { ref: searchRef, isInView: searchIsInView } = useInView();
  const { ref: benefitsRef, isInView: benefitsIsInView } = useInView();
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  
  // New state for filtered properties
  const [displayedProperties, setDisplayedProperties] = useState(FEATURED_PROPERTIES);
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Wallet state
  const { isActive: isWalletConnected, connectMetaMask } = useWalletConnection();

  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter properties by type
  const filterProperties = (filter: string) => {
    setActiveFilter(filter);
    
    if (filter === 'all') {
      setDisplayedProperties(FEATURED_PROPERTIES);
      return;
    }
    
    let filtered;
    switch(filter) {
      case 'residential':
        filtered = FEATURED_PROPERTIES.filter(p => p.type === 'residential');
        break;
      case 'commercial':
        filtered = FEATURED_PROPERTIES.filter(p => p.type === 'commercial');
        break;
      case 'new':
        filtered = FEATURED_PROPERTIES.filter(p => p.isNew);
        break;
      case 'featured':
        filtered = FEATURED_PROPERTIES.filter(p => p.featured);
        break;
      default:
        filtered = FEATURED_PROPERTIES;
    }
    
    setDisplayedProperties(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would navigate to search results
    const searchResults = FEATURED_PROPERTIES.filter(property => 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      property.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDisplayedProperties(searchResults);
  };

  return (
    <div className={cn(
      'min-h-screen transition-opacity duration-500',
      isLoaded ? 'opacity-100' : 'opacity-0'
    )}>
      <Navbar />
      
      <Hero 
        title="Real Estate Tokenization Marketplace"
        subtitle="Buy, sell, and invest in tokenized properties secured by blockchain technology"
        backgroundImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        showExplanation={true}
      />
      
      {/* Search Section */}
      <section 
        ref={searchRef}
        className="relative -mt-16 z-10 px-4"
      >
        <div 
          className={cn(
            "max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 transition-all duration-700",
            searchIsInView ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
          )}
        >
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by location, property name..."
                    className="pl-10 pr-4 py-3 w-full border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-estate-500/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-auto">
                <select
                  className="w-full md:w-auto px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-estate-500/50 bg-white"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="all">All Properties</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="px-6 py-3 bg-estate-500 text-white font-medium rounded-lg hover:bg-estate-600 transition-colors w-full md:w-auto"
              >
                Search
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center text-sm bg-estate-100 text-estate-700 px-3 py-1 rounded-full">
                <Home size={14} className="mr-1" /> Residential
              </div>
              <div className="flex items-center text-sm bg-estate-100 text-estate-700 px-3 py-1 rounded-full">
                <Building2 size={14} className="mr-1" /> Commercial
              </div>
              <div className="flex items-center text-sm bg-estate-100 text-estate-700 px-3 py-1 rounded-full">
                <Award size={14} className="mr-1" /> Featured
              </div>
              <div className="flex items-center text-sm bg-estate-100 text-estate-700 px-3 py-1 rounded-full">
                <Clock size={14} className="mr-1" /> New Listings
              </div>
            </div>
          </form>
        </div>
      </section>
      
      {/* NFT Property Explanation */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium mb-4">NFT Property Marketplace</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Revolutionizing real estate investment through blockchain technology and fractional ownership
            </p>
          </div>
          
          {!isWalletConnected && (
            <div className="max-w-3xl mx-auto mb-12 p-6 border border-estate-200 bg-estate-50 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-medium mb-2 flex items-center">
                  <Wallet className="mr-2 text-estate-500" size={20} />
                  Connect Your Wallet
                </h3>
                <p className="text-muted-foreground">
                  Connect your MetaMask wallet to browse, purchase, and manage NFT properties
                </p>
              </div>
              <Button 
                className="whitespace-nowrap bg-estate-500 hover:bg-estate-600"
                onClick={connectMetaMask}
              >
                Connect MetaMask
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover-lift border-estate-100">
              <CardContent className="pt-6">
                <div className="bg-estate-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Wallet className="text-estate-600" size={24} />
                </div>
                <h3 className="text-xl font-medium mb-2">Tokenized Ownership</h3>
                <p className="text-muted-foreground">
                  Each property is represented as a unique NFT on the blockchain, 
                  providing verifiable ownership and transparency for investors.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift border-estate-100">
              <CardContent className="pt-6">
                <div className="bg-estate-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Building2 className="text-estate-600" size={24} />
                </div>
                <h3 className="text-xl font-medium mb-2">Fractional Investment</h3>
                <p className="text-muted-foreground">
                  Invest in portions of high-value properties, lowering the entry barrier 
                  to premium real estate markets around the world.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift border-estate-100">
              <CardContent className="pt-6">
                <div className="bg-estate-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <ArrowRight className="text-estate-600" size={24} />
                </div>
                <h3 className="text-xl font-medium mb-2">Instant Liquidity</h3>
                <p className="text-muted-foreground">
                  Trade property tokens instantly without traditional closing processes, 
                  bringing unprecedented liquidity to real estate investments.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Property Filter Section */}
      <section className="py-12 bg-slate-50">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-medium mb-4 md:mb-0">Browse NFT Properties</h2>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                className={activeFilter === 'all' ? 'bg-estate-500 hover:bg-estate-600' : ''}
                onClick={() => filterProperties('all')}
              >
                All Properties
              </Button>
              <Button 
                variant={activeFilter === 'residential' ? 'default' : 'outline'}
                className={activeFilter === 'residential' ? 'bg-estate-500 hover:bg-estate-600' : ''}
                onClick={() => filterProperties('residential')}
              >
                <Home size={16} className="mr-2" />
                Residential
              </Button>
              <Button 
                variant={activeFilter === 'commercial' ? 'default' : 'outline'}
                className={activeFilter === 'commercial' ? 'bg-estate-500 hover:bg-estate-600' : ''}
                onClick={() => filterProperties('commercial')}
              >
                <Building2 size={16} className="mr-2" />
                Commercial
              </Button>
              <Button 
                variant={activeFilter === 'new' ? 'default' : 'outline'}
                className={activeFilter === 'new' ? 'bg-estate-500 hover:bg-estate-600' : ''}
                onClick={() => filterProperties('new')}
              >
                <Clock size={16} className="mr-2" />
                New Listings
              </Button>
              <Button 
                variant={activeFilter === 'featured' ? 'default' : 'outline'}
                className={activeFilter === 'featured' ? 'bg-estate-500 hover:bg-estate-600' : ''}
                onClick={() => filterProperties('featured')}
              >
                <Award size={16} className="mr-2" />
                Featured
              </Button>
            </div>
          </div>
          
          {displayedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No properties found matching your criteria.</p>
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link
              to="/properties"
              className="inline-flex items-center px-6 py-3 bg-estate-500 text-white font-medium rounded-lg hover:bg-estate-600 transition-colors"
            >
              View All Properties <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section 
        ref={benefitsRef}
        className="py-16 md:py-24 bg-white"
      >
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-medium mb-4">Benefits of NFT Property Investment</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover how blockchain technology is transforming real estate investment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className={cn(
              "transition-all duration-700 delay-200",
              benefitsIsInView ? "opacity-100 transform-none" : "opacity-0 -translate-x-8"
            )}>
              <img 
                src="https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="NFT Property Benefits"
                className="rounded-lg shadow-lg w-full object-cover aspect-[4/3]"
              />
            </div>
            
            <div className={cn(
              "space-y-6 transition-all duration-700 delay-400",
              benefitsIsInView ? "opacity-100 transform-none" : "opacity-0 translate-x-8"
            )}>
              <div className="flex items-start gap-4">
                <div className="bg-estate-100 rounded-full p-2 mt-1">
                  <Check className="text-estate-600" size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Lower Investment Threshold</h3>
                  <p className="text-muted-foreground">
                    Fractional ownership allows investors to participate with smaller capital, 
                    democratizing access to premium real estate.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-estate-100 rounded-full p-2 mt-1">
                  <Check className="text-estate-600" size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Enhanced Liquidity</h3>
                  <p className="text-muted-foreground">
                    Trade property tokens 24/7 on digital marketplaces without the lengthy 
                    processes associated with traditional real estate transactions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-estate-100 rounded-full p-2 mt-1">
                  <Check className="text-estate-600" size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Transparent Ownership</h3>
                  <p className="text-muted-foreground">
                    Blockchain-based records provide immutable proof of ownership and transaction 
                    history, eliminating disputes and reducing fraud.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-estate-100 rounded-full p-2 mt-1">
                  <Check className="text-estate-600" size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Global Market Access</h3>
                  <p className="text-muted-foreground">
                    Invest in properties worldwide without geographical limitations or 
                    complex international legal processes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-estate-100 rounded-full p-2 mt-1">
                  <Check className="text-estate-600" size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Smart Contract Automation</h3>
                  <p className="text-muted-foreground">
                    Automated distribution of rental income and simplified property management 
                    through blockchain smart contracts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section 
        ref={aboutRef}
        className="py-16 md:py-24 bg-secondary/30"
      >
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div 
              className={cn(
                'transition-all duration-700',
                aboutIsInView ? 'opacity-100 transform-none' : 'opacity-0 -translate-x-8'
              )}
            >
              <div className="relative">
                <div className="aspect-[4/5] bg-estate-100 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="About EstateFlow" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 p-6 bg-white rounded-lg shadow-md max-w-[200px]">
                  <p className="text-sm text-muted-foreground">Established</p>
                  <p className="text-3xl font-medium text-estate-500">{COMPANY_INFO.founded}</p>
                </div>
              </div>
            </div>
            
            <div 
              className={cn(
                'transition-all duration-700 delay-300',
                aboutIsInView ? 'opacity-100 transform-none' : 'opacity-0 translate-x-8'
              )}
            >
              <h2 className="text-3xl font-medium mb-4">Our NFT Marketplace</h2>
              <p className="text-muted-foreground mb-6">
                {COMPANY_INFO.description}
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-border/50 shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Buy NFT Properties</h3>
                  <p className="text-muted-foreground text-sm">
                    Browse our curated selection of tokenized properties and make secure blockchain investments.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-border/50 shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Sell Tokenized Properties</h3>
                  <p className="text-muted-foreground text-sm">
                    List your property on our marketplace and convert it into tradable NFT tokens.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-border/50 shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Secure Blockchain Transactions</h3>
                  <p className="text-muted-foreground text-sm">
                    Our platform ensures secure, transparent, and immutable property transactions.
                  </p>
                </div>
              </div>
              <Link 
                to="/about" 
                className="inline-flex items-center mt-8 text-estate-500 hover:text-estate-600 font-medium"
              >
                Learn more about our marketplace <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-estate-50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-estate-500">500+</p>
              <p className="text-muted-foreground mt-2">Tokenized Properties</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-estate-500">2.5K+</p>
              <p className="text-muted-foreground mt-2">NFT Investors</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-estate-500">$850M+</p>
              <p className="text-muted-foreground mt-2">Token Market Value</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-estate-500">15+</p>
              <p className="text-muted-foreground mt-2">Countries Covered</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className="py-16 md:py-24 bg-estate-500 text-white"
      >
        <div className="container">
          <div 
            className={cn(
              'max-w-3xl mx-auto text-center transition-all duration-700',
              ctaIsInView ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'
            )}
          >
            <h2 className="text-3xl md:text-4xl font-medium mb-4">Ready to Invest in NFT Properties?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Discover opportunities to buy, sell, or invest in tokenized real estate on the blockchain.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/properties"
                className="px-6 py-3 bg-white text-estate-500 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Explore NFT Listings
              </Link>
              <Button
                variant="outline"
                className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                onClick={!isWalletConnected ? connectMetaMask : undefined}
              >
                {!isWalletConnected ? 'Connect Wallet' : 'List Your Property'}
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
