
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Gauge } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { FEATURED_PROPERTIES } from '@/lib/constants';
import { useInView } from '@/lib/animations';
import { cn } from '@/lib/utils';

const FeaturedProperties = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { ref, isInView } = useInView();

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
          <button className="px-4 py-2 rounded-full bg-estate-500 text-white text-sm">
            All Properties
          </button>
          <button className="px-4 py-2 rounded-full bg-white border border-border text-sm hover:bg-secondary/50">
            Residential
          </button>
          <button className="px-4 py-2 rounded-full bg-white border border-border text-sm hover:bg-secondary/50">
            Commercial
          </button>
          <button className="px-4 py-2 rounded-full bg-white border border-border text-sm hover:bg-secondary/50">
            New Listings
          </button>
          <button className="px-4 py-2 rounded-full bg-white border border-border text-sm hover:bg-secondary/50">
            Featured
          </button>
        </div>
        
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-8 -mx-4 px-4 space-x-6 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {FEATURED_PROPERTIES.map((property, index) => (
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
          ))}
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
