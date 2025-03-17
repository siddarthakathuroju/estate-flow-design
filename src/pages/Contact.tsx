
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import { CONTACT_INFO } from '@/lib/constants';
import { useInView } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Linkedin, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Contact = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { ref: contactRef, isInView: contactIsInView } = useInView();
  const { ref: formRef, isInView: formIsInView } = useInView();

  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "We've received your message and will contact you soon.",
        duration: 5000,
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className={cn(
      'min-h-screen transition-opacity duration-500',
      isLoaded ? 'opacity-100' : 'opacity-0'
    )}>
      <Navbar />
      
      <Hero 
        title="Contact Us"
        subtitle="Get in touch with our team for personalized assistance"
        backgroundImage="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        className="h-[60vh]"
      />
      
      {/* Contact Info Section */}
      <section 
        ref={contactRef as React.RefObject<HTMLDivElement>}
        className="py-16 md:py-24"
      >
        <div className="container">
          <div 
            className={cn(
              'text-center max-w-2xl mx-auto mb-16 transition-all duration-700',
              contactIsInView ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'
            )}
          >
            <h2 className="text-3xl font-medium mb-4">We're Here to Help</h2>
            <p className="text-muted-foreground">
              Whether you have questions about a specific property or need guidance on your real estate journey, 
              our dedicated team is ready to assist you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              className={cn(
                'bg-white p-8 rounded-lg border border-border/50 shadow-sm transition-all duration-700 text-center',
                contactIsInView ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'
              )}
            >
              <div className="w-14 h-14 rounded-full bg-estate-100 text-estate-500 flex items-center justify-center mx-auto mb-4">
                <Mail size={24} />
              </div>
              <h3 className="text-lg font-medium mb-2">Email Us</h3>
              <p className="text-muted-foreground mb-4">For inquiries and information</p>
              <a 
                href={`mailto:${CONTACT_INFO.email}`}
                className="text-estate-500 hover:text-estate-600 font-medium transition-colors"
              >
                {CONTACT_INFO.email}
              </a>
            </div>
            
            <div 
              className={cn(
                'bg-white p-8 rounded-lg border border-border/50 shadow-sm transition-all duration-700 text-center',
                contactIsInView ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: contactIsInView ? '100ms' : '0ms' }}
            >
              <div className="w-14 h-14 rounded-full bg-estate-100 text-estate-500 flex items-center justify-center mx-auto mb-4">
                <Phone size={24} />
              </div>
              <h3 className="text-lg font-medium mb-2">Call Us</h3>
              <p className="text-muted-foreground mb-4">Speak with a representative</p>
              <a 
                href={`tel:${CONTACT_INFO.phone.replace(/\D/g, '')}`}
                className="text-estate-500 hover:text-estate-600 font-medium transition-colors"
              >
                {CONTACT_INFO.phone}
              </a>
            </div>
            
            <div 
              className={cn(
                'bg-white p-8 rounded-lg border border-border/50 shadow-sm transition-all duration-700 text-center',
                contactIsInView ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: contactIsInView ? '200ms' : '0ms' }}
            >
              <div className="w-14 h-14 rounded-full bg-estate-100 text-estate-500 flex items-center justify-center mx-auto mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-medium mb-2">Visit Us</h3>
              <p className="text-muted-foreground mb-4">Our office location</p>
              <address className="not-italic text-estate-500 font-medium">
                {CONTACT_INFO.address}
              </address>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-lg font-medium mb-4">Connect With Us</h3>
            <div className="flex justify-center space-x-4">
              <a
                href={CONTACT_INFO.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-3 rounded-full border border-border/50 text-muted-foreground",
                  "hover:bg-estate-500 hover:text-white hover:border-estate-500 transition-all"
                )}
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={CONTACT_INFO.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-3 rounded-full border border-border/50 text-muted-foreground",
                  "hover:bg-estate-500 hover:text-white hover:border-estate-500 transition-all"
                )}
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href={CONTACT_INFO.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-3 rounded-full border border-border/50 text-muted-foreground",
                  "hover:bg-estate-500 hover:text-white hover:border-estate-500 transition-all"
                )}
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href={CONTACT_INFO.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-3 rounded-full border border-border/50 text-muted-foreground",
                  "hover:bg-estate-500 hover:text-white hover:border-estate-500 transition-all"
                )}
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section 
        ref={formRef as React.RefObject<HTMLDivElement>}
        className="py-16 md:py-24 bg-secondary/30"
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div 
              className={cn(
                'transition-all duration-700',
                formIsInView ? 'opacity-100 transform-none' : 'opacity-0 -translate-x-8'
              )}
            >
              <h2 className="text-3xl font-medium mb-4">Send Us a Message</h2>
              <p className="text-muted-foreground mb-8 max-w-lg">
                Have a question or request? Fill out the form below and one of our team members will get back to you within 24 hours.
              </p>
              <div className="bg-white rounded-lg border border-border/50 shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-border rounded-lg focus:ring-1 focus:ring-estate-500 focus:border-estate-500 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-border rounded-lg focus:ring-1 focus:ring-estate-500 focus:border-estate-500 transition-all"
                        placeholder="Your email"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-3 border border-border rounded-lg focus:ring-1 focus:ring-estate-500 focus:border-estate-500 transition-all"
                        placeholder="Your phone (optional)"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full p-3 border border-border rounded-lg focus:ring-1 focus:ring-estate-500 focus:border-estate-500 transition-all"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "w-full py-3 px-4 bg-estate-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center",
                      isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-estate-600"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <Send size={16} className="ml-2" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
            
            <div 
              className={cn(
                'transition-all duration-700 delay-300',
                formIsInView ? 'opacity-100 transform-none' : 'opacity-0 translate-x-8'
              )}
            >
              <div className="h-full rounded-lg overflow-hidden">
                <iframe 
                  title="Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96771.49119351904!2d-74.04701416911034!3d40.71427295194951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25903e421a725%3A0x9eb31011d20e7b35!2sNew%20York%2C%20NY%2010001!5e0!3m2!1sen!2sus!4v1625160997175!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, minHeight: '500px' }} 
                  allowFullScreen 
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Contact;
