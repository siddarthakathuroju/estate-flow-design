
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, Home, Building2, Info, Phone } from 'lucide-react';
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
  }, [location]);

  const links = [
    { path: '/', label: 'Home', icon: <Home size={16} /> },
    { path: '/properties', label: 'Properties', icon: <Building2 size={16} /> },
    { path: '/about', label: 'About', icon: <Info size={16} /> },
    { path: '/contact', label: 'Contact', icon: <Phone size={16} /> }
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full',
        isScrolled 
          ? 'glass py-2'
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
                  ? 'special-gradient text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
      {isMenuOpen && (
        <div className="md:hidden py-3 px-4 glass animate-in slide-in-from-top">
          <nav className="flex flex-col space-y-1">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'mobile-nav-item flex items-center',
                  location.pathname === link.path
                    ? 'special-gradient text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/10'
                )}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
