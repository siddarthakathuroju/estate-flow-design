
import { useInView } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  className?: string;
}

const Hero = ({ 
  title, 
  subtitle, 
  backgroundImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  className 
}: HeroProps) => {
  const { ref, isInView } = useInView();

  return (
    <section 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        'relative h-[80vh] flex items-center justify-center overflow-hidden',
        className
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black/30 z-10" />
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
      
      {/* Content */}
      <div className="container relative z-20 text-center text-white">
        <h1 
          className={cn(
            'max-w-4xl mx-auto mb-4 transition-all duration-700',
            isInView ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p 
            className={cn(
              'max-w-2xl mx-auto text-lg md:text-xl text-white/90 transition-all duration-700 delay-300',
              isInView ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default Hero;
