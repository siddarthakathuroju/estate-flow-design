
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react';
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
    { path: '/', label: 'Home' },
    { path: '/properties', label: 'Properties' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full',
        isScrolled 
          ? 'bg-background/90 backdrop-blur-md border-b border-border/40 py-2'
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
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                location.pathname === link.path
                  ? 'text-estate-600'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-2 flex items-center gap-2">
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
              'h-8 w-8',
              isScrolled ? 'border-border' : 'border-transparent'
            )}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden py-3 px-4 bg-background/95 backdrop-blur-sm border-t border-border/40 animate-in slide-in-from-top">
          <nav className="flex flex-col space-y-1">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  location.pathname === link.path
                    ? 'bg-muted text-estate-600'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
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
