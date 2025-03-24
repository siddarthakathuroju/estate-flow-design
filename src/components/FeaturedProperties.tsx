
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { ALL_PROPERTIES } from '@/lib/constants';
import { useInView } from '@/lib/animations';
import { cn } from '@/lib/utils';

// Define the property types
type PropertyType = 'all' | 'residential' | 'commercial' | 'new' | 'featured';

const FeaturedProperties = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { ref, isInView } = useInView();
  const [activeFilter, setActiveFilter] = useState<PropertyType>('all');

  // Filter properties based on the active filter
  const filteredProperties = ALL_PROPERTIES.filter(property => {
    if (activeFilter === 'all') return property.featured;
    if (activeFilter === 'residential') return property.type === 'residential' && property.featured;
    if (activeFilter === 'commercial') return property.type === 'commercial' && property.featured;
    if (activeFilter === 'new') return property.isNew === true && property.featured;
    if (activeFilter === 'featured') return property.featured;
    return property.featured;
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth * 0.7;
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Handle filter change
  const handleFilterChange = (filter: PropertyType) => {
    setActiveFilter(filter);
  };

  return (
    <section ref={ref as React.RefObject<HTMLDivElement>} className="py-16 md:py-24">
      <div className="container">
        <div className="flex items-center justify-between mb-10">
          <div 
            className={cn(
              'transition-all duration-700',
              isInView ? 'opacity-100 transform-none' : 'opacity-0 -translate-x-8'
            )}
          >
            <h2 className="text-3xl font-medium">Featured Properties</h2>
            <p className="text-muted-foreground mt-2">Discover our handpicked selection of exceptional properties</p>
          </div>
          
          <div 
            className={cn(
              'flex space-x-2 transition-all duration-700',
              isInView ? 'opacity-100 transform-none' : 'opacity-0 translate-x-8'
            )}
          >
            <Link 
              to="/properties"
              className="text-estate-500 hover:text-estate-600 font-medium text-sm mr-4 flex items-center"
            >
              View All Properties <ChevronRight size={16} className="ml-1" />
            </Link>
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full border border-border hover:bg-secondary transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full border border-border hover:bg-secondary transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            className={cn(
              "px-4 py-2 rounded-full text-sm transition-colors",
              activeFilter === 'all' 
                ? "bg-estate-500 text-white" 
                : "bg-white border border-border hover:bg-secondary/50"
            )}
            onClick={() => handleFilterChange('all')}
          >
            All Properties
          </button>
          <button 
            className={cn(
              "px-4 py-2 rounded-full text-sm transition-colors",
              activeFilter === 'residential' 
                ? "bg-estate-500 text-white" 
                : "bg-white border border-border hover:bg-secondary/50"
            )}
            onClick={() => handleFilterChange('residential')}
          >
            Residential
          </button>
          <button 
            className={cn(
              "px-4 py-2 rounded-full text-sm transition-colors",
              activeFilter === 'commercial' 
                ? "bg-estate-500 text-white" 
                : "bg-white border border-border hover:bg-secondary/50"
            )}
            onClick={() => handleFilterChange('commercial')}
          >
            Commercial
          </button>
          <button 
            className={cn(
              "px-4 py-2 rounded-full text-sm transition-colors",
              activeFilter === 'new' 
                ? "bg-estate-500 text-white" 
                : "bg-white border border-border hover:bg-secondary/50"
            )}
            onClick={() => handleFilterChange('new')}
          >
            New Listings
          </button>
          <button 
            className={cn(
              "px-4 py-2 rounded-full text-sm transition-colors",
              activeFilter === 'featured' 
                ? "bg-estate-500 text-white" 
                : "bg-white border border-border hover:bg-secondary/50"
            )}
            onClick={() => handleFilterChange('featured')}
          >
            Featured
          </button>
        </div>
        
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-8 -mx-4 px-4 space-x-6 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property, index) => (
              <div 
                key={property.id}
                className={cn(
                  'min-w-[320px] md:min-w-[380px] transition-all duration-700',
                  isInView 
                    ? 'opacity-100 transform-none' 
                    : 'opacity-0 translate-y-8',
                  index === 0 ? '' : `delay-${index * 100}`
                )}
                style={{ 
                  transitionDelay: isInView ? `${index * 100}ms` : '0ms',
                }}
              >
                <PropertyCard {...property} />
              </div>
            ))
          ) : (
            <div className="w-full text-center py-12">
              <p className="text-muted-foreground">No properties found matching this filter.</p>
            </div>
          )}
        </div>
        
        {/* Trending Indicators */}
        <div className="flex justify-center mt-8 space-x-10">
          <div className="flex items-center text-sm">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>High Demand Areas</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span>Investment Opportunities</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
            <span>Price Reduced</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
