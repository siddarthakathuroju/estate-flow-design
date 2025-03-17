
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import Hero from '@/components/Hero';
import { ALL_PROPERTIES } from '@/lib/constants';
import { useInView } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { Search, Filter, X } from 'lucide-react';

// Types
interface FilterState {
  minPrice: number | '';
  maxPrice: number | '';
  bedrooms: number | '';
  bathrooms: number | '';
}

const Properties = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
  });
  const { ref: propertiesRef, isInView: propertiesIsInView } = useInView();

  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter properties based on search and filters
  const filteredProperties = ALL_PROPERTIES.filter((property) => {
    // Search filter
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price filter
    const matchesMinPrice = filters.minPrice === '' || property.price >= filters.minPrice;
    const matchesMaxPrice = filters.maxPrice === '' || property.price <= filters.maxPrice;
    
    // Room filters
    const matchesBedrooms = filters.bedrooms === '' || property.bedrooms >= filters.bedrooms;
    const matchesBathrooms = filters.bathrooms === '' || property.bathrooms >= filters.bathrooms;
    
    return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesBedrooms && matchesBathrooms;
  });

  const resetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
    });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value === '' ? '' : parseInt(value),
    });
  };

  const hasActiveFilters = 
    filters.minPrice !== '' || 
    filters.maxPrice !== '' || 
    filters.bedrooms !== '' || 
    filters.bathrooms !== '';

  return (
    <div className={cn(
      'min-h-screen transition-opacity duration-500',
      isLoaded ? 'opacity-100' : 'opacity-0'
    )}>
      <Navbar />
      
      <Hero 
        title="Properties"
        subtitle="Browse our collection of exceptional properties"
        backgroundImage="https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        className="h-[60vh]"
      />
      
      {/* Filters Section */}
      <section className="py-8 border-b border-border/50 sticky top-16 bg-background/95 backdrop-blur-sm z-10">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-auto md:flex-1 max-w-lg">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={18} className="text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search by location or property name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-1 focus:ring-estate-500 focus:border-estate-500 transition-all"
              />
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "flex items-center px-4 py-2 rounded-lg border border-border transition-colors",
                isFilterOpen || hasActiveFilters ? "bg-estate-500 text-white border-estate-500" : "hover:bg-secondary"
              )}
            >
              <Filter size={18} className="mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 bg-white text-estate-500 text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                  {Object.values(filters).filter(val => val !== '').length}
                </span>
              )}
            </button>
          </div>
          
          {/* Expanded Filter Panel */}
          {isFilterOpen && (
            <div className="mt-4 p-4 border border-border rounded-lg animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Min Price</label>
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="No minimum"
                    className="w-full p-2 border border-border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Price</label>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="No maximum"
                    className="w-full p-2 border border-border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bedrooms</label>
                  <select
                    name="bedrooms"
                    value={filters.bedrooms}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-border rounded-md"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bathrooms</label>
                  <select
                    name="bathrooms"
                    value={filters.bathrooms}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-border rounded-md"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={resetFilters}
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center"
                >
                  <X size={14} className="mr-1" /> Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Properties Grid */}
      <section 
        ref={propertiesRef as React.RefObject<HTMLDivElement>}
        className="py-12 md:py-16"
      >
        <div className="container">
          {filteredProperties.length > 0 ? (
            <>
              <div className="mb-8">
                <p className="text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{filteredProperties.length}</span> properties
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property, index) => (
                  <div
                    key={property.id}
                    className={cn(
                      'transition-all duration-700',
                      propertiesIsInView ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'
                    )}
                    style={{ 
                      transitionDelay: propertiesIsInView ? `${Math.min(index * 100, 500)}ms` : '0ms',
                    }}
                  >
                    <PropertyCard {...property} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">No properties found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search criteria</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-estate-500 text-white rounded-lg hover:bg-estate-600 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Properties;
