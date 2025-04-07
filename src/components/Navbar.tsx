import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, Briefcase, User } from 'lucide-react';

const NavbarLinks = [
  { name: 'Home', href: '/' },
  { name: 'Properties', href: '/properties' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { pathname } = useLocation();
  const { user, isAuthenticated, logout, isWorker, isManager } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center font-semibold text-2xl">
          <span className="text-estate-600">NFT</span>
          <span>Property</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          {NavbarLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {isAuthenticated && isWorker && (
            <Link
              to="/jobs/new"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/jobs/new' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Jobs
            </Link>
          )}

          {/* Theme Toggle */}
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          {/* Profile Section */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar_url || ""} alt={user?.name || "Profile"} />
                  <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-64">
              <SheetHeader className="text-left">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate through the application.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4">
                <ul className="divide-y divide-border-muted">
                  {NavbarLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="flex items-center gap-3 p-2 text-muted-foreground"
                        onClick={closeMobileMenu}
                      >
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                  {isAuthenticated && isWorker && (
                    <li>
                      <Link
                        to="/jobs/new"
                        className="flex items-center gap-3 p-2 text-muted-foreground"
                        onClick={toggleMobileMenu}
                      >
                        <Briefcase className="h-5 w-5" />
                        <span>Jobs</span>
                      </Link>
                    </li>
                  )}
                  {isAuthenticated ? (
                    <>
                      <li>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 p-2 text-muted-foreground"
                          onClick={toggleMobileMenu}
                        >
                          <User className="h-5 w-5" />
                          <span>Profile</span>
                        </Link>
                      </li>
                      <li>
                        <Button variant="outline" className="w-full justify-start gap-2 mt-2" size="sm" onClick={handleLogout}>
                          <User className="h-4 w-4" />
                          Logout
                        </Button>
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link to="/auth" className="flex items-center gap-3 p-2 text-muted-foreground" onClick={toggleMobileMenu}>
                        <span>Sign In</span>
                      </Link>
                    </li>
                  )}
                </ul>
                <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-full justify-start gap-2 mt-4">
                  {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
