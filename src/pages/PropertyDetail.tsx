import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ALL_PROPERTIES } from '@/lib/constants';
import { formatPrice } from '@/lib/animations';
import { ArrowLeft, MapPin, BedDouble, Bath, Square, ChevronRight, Heart, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const property = ALL_PROPERTIES.find(p => p.id === Number(id));
  
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
              </div>
              
              <div className="flex items-center space-x-4 animate-fade-in delay-200">
                <div className="text-3xl font-medium text-estate-500">
                  {formatPrice(property.price)}
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
          
          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 animate-fade-in delay-200">
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
            </div>
            
            {/* Contact Card */}
            <div className="md:col-span-1 animate-fade-in delay-300">
              <div className="bg-white rounded-lg border border-border/60 shadow-sm p-6 sticky top-32">
                <h3 className="text-lg font-medium mb-4">Interested in this property?</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full p-2 border border-border rounded-md focus:ring-1 focus:ring-estate-500 focus:border-estate-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full p-2 border border-border rounded-md focus:ring-1 focus:ring-estate-500 focus:border-estate-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      placeholder="Your phone"
                      className="w-full p-2 border border-border rounded-md focus:ring-1 focus:ring-estate-500 focus:border-estate-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <textarea
                      rows={4}
                      placeholder="I'm interested in this property..."
                      className="w-full p-2 border border-border rounded-md focus:ring-1 focus:ring-estate-500 focus:border-estate-500 transition-all"
                      defaultValue={`I'm interested in ${property.title} at ${property.address}.`}
                    />
                  </div>
                  <button
                    type="button"
                    className="w-full py-3 px-4 bg-estate-500 text-white font-medium rounded-lg hover:bg-estate-600 transition-colors"
                  >
                    Request Information
                  </button>
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
