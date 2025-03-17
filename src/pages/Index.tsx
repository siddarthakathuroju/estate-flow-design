
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Home, MapPin } from 'lucide-react';
import Hero from '@/components/Hero';
import FeaturedProperties from '@/components/FeaturedProperties';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { COMPANY_INFO } from '@/lib/constants';
import { useInView } from '@/lib/animations';
import { cn } from '@/lib/utils';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref: aboutRef, isInView: aboutIsInView } = useInView();
  const { ref: ctaRef, isInView: ctaIsInView } = useInView();
  const { ref: searchRef, isInView: searchIsInView } = useInView();
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('all');

  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would navigate to search results
    window.location.href = `/properties?search=${searchQuery}&type=${propertyType}`;
  };

  return (
    <div className={cn(
      'min-h-screen transition-opacity duration-500',
      isLoaded ? 'opacity-100' : 'opacity-0'
    )}>
      <Navbar />
      
      <Hero 
        title="Discover Your Dream Property Investment"
        subtitle="Buy, sell, and explore premium real estate opportunities in the digital marketplace"
        backgroundImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
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
                <MapPin size={14} className="mr-1" /> New York
              </div>
              <div className="flex items-center text-sm bg-estate-100 text-estate-700 px-3 py-1 rounded-full">
                Top Rated
              </div>
              <div className="flex items-center text-sm bg-estate-100 text-estate-700 px-3 py-1 rounded-full">
                Premium
              </div>
            </div>
          </form>
        </div>
      </section>
      
      <FeaturedProperties />
      
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
              <h2 className="text-3xl font-medium mb-4">Our Marketplace</h2>
              <p className="text-muted-foreground mb-6">
                {COMPANY_INFO.description}
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-border/50 shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Buy Properties</h3>
                  <p className="text-muted-foreground text-sm">
                    Browse our curated selection of premium properties and make secure investments.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-border/50 shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Sell Properties</h3>
                  <p className="text-muted-foreground text-sm">
                    List your property on our marketplace and connect with potential buyers worldwide.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-border/50 shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Secure Transactions</h3>
                  <p className="text-muted-foreground text-sm">
                    Our platform ensures safe, transparent transactions for all parties involved.
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
              <p className="text-muted-foreground mt-2">Active Listings</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-estate-500">2.5K+</p>
              <p className="text-muted-foreground mt-2">Happy Clients</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-estate-500">$850M+</p>
              <p className="text-muted-foreground mt-2">Property Value</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-estate-500">15+</p>
              <p className="text-muted-foreground mt-2">Years Experience</p>
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
            <h2 className="text-3xl md:text-4xl font-medium mb-4">Ready to Join Our Property Marketplace?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Discover opportunities to buy, sell, or invest in premium real estate properties.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/properties"
                className="px-6 py-3 bg-white text-estate-500 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Explore Listings
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;

