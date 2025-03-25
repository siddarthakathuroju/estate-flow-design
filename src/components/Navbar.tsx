
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, Home, Building2, Info, Phone, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import WalletConnect from './WalletConnect';
import UserMenu from './UserMenu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
    
    // Prevent body scroll when menu is open
    if (isMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [location, isMenuOpen, isMobile]);

  const links = [
    { path: '/', label: 'Home', icon: <Home size={16} /> },
    { path: '/properties', label: 'Properties', icon: <Building2 size={16} /> },
    { path: '/portfolio', label: 'Portfolio', icon: <BarChart3 size={16} /> },
    { path: '/about', label: 'About', icon: <Info size={16} /> },
    { path: '/contact', label: 'Contact', icon: <Phone size={16} /> }
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full',
        isScrolled 
          ? 'backdrop-blur-md bg-white/10 border-b border-white/10 py-2 shadow-lg'
          : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-semibold text-estate-600">NFT</span>
          <span className="text-xl font-semibold ml-1">Property</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center',
                location.pathname === link.path
                  ? 'bg-gradient-to-r from-estate-400 to-estate-600 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/10 backdrop-blur-sm'
              )}
            >
              <span className="mr-1.5">{link.icon}</span>
              {link.label}
            </Link>
          ))}
          <div className="ml-3 flex items-center gap-2">
            <WalletConnect />
            <UserMenu />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden gap-2">
          <UserMenu />
          <WalletConnect />
          <Button 
            variant="outline" 
            size="icon"
            className={cn(
              'h-9 w-9 rounded-full',
              isScrolled ? 'border-white/30 bg-white/10 backdrop-blur-sm' : 'border-transparent'
            )}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={cn(
          'md:hidden fixed inset-0 top-[57px] bg-black/80 backdrop-blur-md z-40 transition-transform duration-300 ease-in-out',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <nav className="flex flex-col space-y-2 p-4 h-full">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'mobile-nav-item flex items-center p-4 rounded-lg',
                location.pathname === link.path
                  ? 'bg-gradient-to-r from-estate-400/80 to-estate-600 text-white shadow-md'
                  : 'text-white hover:bg-white/10'
              )}
            >
              <span className="mr-3">{link.icon}</span>
              <span className="text-lg">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
