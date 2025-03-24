
import { useInView } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  className?: string;
  showExplanation?: boolean;
}

const Hero = ({ 
  title, 
  subtitle, 
  backgroundImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  className,
  showExplanation = false
}: HeroProps) => {
  const { ref, isInView } = useInView();
  const isMobile = useIsMobile();

  return (
    <section 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        'relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden',
        className
      )}
    >
      {/* Background Image with parallax effect */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10" />
        <img 
          src={backgroundImage} 
          alt="Hero background" 
          className="w-full h-full object-cover" 
          style={{ 
            transform: isInView ? 'scale(1)' : 'scale(1.1)',
            transition: 'transform 1.5s ease-out',
          }}
        />
      </div>
      
      {/* Overlay pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yfDJ2MWgtMnYtMXptLTIgMmgydjFoLTJ2LTF6bS0yLTJoMnYxaC0ydi0xem0xNi0xM2gydjFoLTJ2LTF6bS0yIDJoMnYxaC0ydi0xem0tMi0yaDF2MmgtMXYtMnptLTItMmgxdjJoLTF2LTJ6bS0yLTloMXYxaC0xdi0xem0tMiAyaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS0yLTJoMXYxaC0xdi0xem0tMiAwaDJ2MWgtMnYtMXptLTItMmgxdjJoLTF2LTJ6bS0yIDBoMXYyaC0xdi0yem0tMi0zaDF2MmgtMXYtMnptLTIgMGgxdjJoLTF2LTJ6bS0yIDBIMXYyaC0xdi0yek0xIDNoMXYySDF2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40 z-[5]" />
      
      {/* Content */}
      <div className="container relative z-20 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 
            className={cn(
              'mb-4 text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-xl transition-all duration-700', 
              isInView ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p 
              className={cn(
                'max-w-2xl mx-auto text-base md:text-lg lg:text-xl text-white/90 drop-shadow-md transition-all duration-700 delay-300',
                isInView ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'
              )}
            >
              {subtitle}
            </p>
          )}
          
          {showExplanation && (
            <div className={cn(
              "mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left transition-all duration-1000 delay-500",
              isInView ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
            )}>
              <div className="glass-morph p-4 backdrop-blur-md rounded-lg">
                <h3 className="text-white text-lg font-medium mb-2">What is Real Estate Tokenization?</h3>
                <p className="text-white/80 text-sm">
                  Tokenization converts real estate assets into digital tokens on the blockchain, 
                  enabling fractional ownership and simplified trading of property investments.
                </p>
              </div>
              <div className="glass-morph p-4 backdrop-blur-md rounded-lg">
                <h3 className="text-white text-lg font-medium mb-2">NFT Property Ownership</h3>
                <p className="text-white/80 text-sm">
                  NFTs (Non-Fungible Tokens) represent unique digital ownership rights to specific properties, 
                  secured by blockchain technology for transparency and authenticity.
                </p>
              </div>
              <div className="glass-morph p-4 backdrop-blur-md rounded-lg">
                <h3 className="text-white text-lg font-medium mb-2">Benefits for Investors</h3>
                <p className="text-white/80 text-sm">
                  Simplified transactions, lower entry barriers, instant liquidity, and 
                  global market access make tokenized real estate an innovative investment option.
                </p>
              </div>
            </div>
          )}
          
          {/* Decorative elements */}
          <div 
            className={cn(
              "w-20 h-1 bg-gradient-to-r from-estate-400 to-estate-600 mx-auto mt-6 md:mt-8 rounded-full transition-all duration-1000 glow",
              isInView ? "opacity-100 w-20" : "opacity-0 w-0"
            )}
          />
        </div>
      </div>
      
      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;
