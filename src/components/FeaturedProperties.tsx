
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
      </div>
    </section>
  );
};

export default FeaturedProperties;
