
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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

  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn(
      'min-h-screen transition-opacity duration-500',
      isLoaded ? 'opacity-100' : 'opacity-0'
    )}>
      <Navbar />
      
      <Hero 
        title="Discover Your Perfect Space"
        subtitle="Curated properties that match your lifestyle and aspirations"
      />
      
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
              <h2 className="text-3xl font-medium mb-4">Our Approach</h2>
              <p className="text-muted-foreground mb-6">
                {COMPANY_INFO.description}
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-border/50 shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Personalized Service</h3>
                  <p className="text-muted-foreground text-sm">
                    We take the time to understand your unique preferences and requirements.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-border/50 shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Curated Selection</h3>
                  <p className="text-muted-foreground text-sm">
                    Our properties meet the highest standards of quality and design.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-border/50 shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Seamless Experience</h3>
                  <p className="text-muted-foreground text-sm">
                    From initial search to final closing, we ensure a smooth journey.
                  </p>
                </div>
              </div>
              <Link 
                to="/about" 
                className="inline-flex items-center mt-8 text-estate-500 hover:text-estate-600 font-medium"
              >
                Learn more about us <ArrowRight size={16} className="ml-1" />
              </Link>
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
            <h2 className="text-3xl md:text-4xl font-medium mb-4">Ready to Find Your Dream Property?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Browse our curated selection of luxury properties or contact us for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/properties"
                className="px-6 py-3 bg-white text-estate-500 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                View Properties
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                Contact Us
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
