
import { Link } from 'react-router-dom';
import { NAV_LINKS, CONTACT_INFO } from '@/lib/constants';
import { Instagram, Twitter, Facebook, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/50 border-t border-border/50">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="text-2xl font-medium tracking-tight inline-block mb-4">
              Estate<span className="text-estate-500">Flow</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Connecting discerning clients with extraordinary properties through a seamless and personalized experience.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-base font-medium mb-4">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.id}
                  to={link.path}
                  className="text-muted-foreground hover:text-estate-500 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-base font-medium mb-4">Contact</h4>
            <div className="space-y-3">
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center text-sm text-muted-foreground hover:text-estate-500 transition-colors"
              >
                <Mail size={16} className="mr-2" />
                {CONTACT_INFO.email}
              </a>
              <a
                href={`tel:${CONTACT_INFO.phone.replace(/\D/g, '')}`}
                className="flex items-center text-sm text-muted-foreground hover:text-estate-500 transition-colors"
              >
                <Phone size={16} className="mr-2" />
                {CONTACT_INFO.phone}
              </a>
              <div className="flex items-start text-sm text-muted-foreground">
                <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
                <span>{CONTACT_INFO.address}</span>
              </div>
            </div>
          </div>
          
          {/* Social */}
          <div>
            <h4 className="text-base font-medium mb-4">Follow Us</h4>
            <div className="flex space-x-3">
              <a
                href={CONTACT_INFO.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-2 rounded-full border border-border/50 text-muted-foreground",
                  "hover:bg-estate-500 hover:text-white hover:border-estate-500 transition-all"
                )}
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href={CONTACT_INFO.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-2 rounded-full border border-border/50 text-muted-foreground",
                  "hover:bg-estate-500 hover:text-white hover:border-estate-500 transition-all"
                )}
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href={CONTACT_INFO.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-2 rounded-full border border-border/50 text-muted-foreground",
                  "hover:bg-estate-500 hover:text-white hover:border-estate-500 transition-all"
                )}
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href={CONTACT_INFO.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-2 rounded-full border border-border/50 text-muted-foreground",
                  "hover:bg-estate-500 hover:text-white hover:border-estate-500 transition-all"
                )}
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-border/50 mt-10 pt-6 text-sm text-muted-foreground text-center">
          <p>© {currentYear} EstateFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
