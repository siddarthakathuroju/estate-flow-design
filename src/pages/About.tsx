
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import { COMPANY_INFO } from '@/lib/constants';
import { useInView } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref: missionRef, isInView: missionIsInView } = useInView();
  const { ref: teamRef, isInView: teamIsInView } = useInView();
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
        title="About Us"
        subtitle="Learn more about EstateFlow and our approach to real estate"
        backgroundImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        className="h-[60vh]"
      />
      
      {/* Mission Section */}
      <section 
        ref={missionRef as React.RefObject<HTMLDivElement>}
        className="py-16 md:py-24"
      >
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div 
              className={cn(
                'transition-all duration-700',
                missionIsInView ? 'opacity-100 transform-none' : 'opacity-0 -translate-x-8'
              )}
            >
              <div className="relative">
                <div className="aspect-square bg-estate-100 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Our Mission" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 p-6 bg-estate-500 text-white rounded-lg shadow-lg max-w-[200px]">
                  <p className="text-3xl font-medium">Est.</p>
                  <p className="text-4xl font-medium">{COMPANY_INFO.founded}</p>
                </div>
              </div>
            </div>
            
            <div 
              className={cn(
                'transition-all duration-700 delay-300',
                missionIsInView ? 'opacity-100 transform-none' : 'opacity-0 translate-x-8'
              )}
            >
              <h2 className="text-3xl font-medium mb-2">Our Story</h2>
              <div className="w-20 h-1 bg-estate-500 mb-6"></div>
              <p className="text-muted-foreground mb-6">
                Founded in {COMPANY_INFO.founded}, EstateFlow began with a simple vision: to transform the 
                real estate experience by focusing on quality, design, and personalized service.
              </p>
              <p className="text-muted-foreground mb-6">
                What started as a boutique agency in New York has grown into a respected name in luxury real 
                estate across the United States. Throughout our growth, we've remained committed to our founding 
                principles and the clients we serve.
              </p>
              <h3 className="text-xl font-medium mb-4">Our Mission</h3>
              <p className="text-muted-foreground mb-6">
                {COMPANY_INFO.mission}
              </p>
              <div className="bg-secondary/50 p-6 rounded-lg border border-border/50">
                <h3 className="text-lg font-medium mb-3">Our Values</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-estate-500 text-white flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</div>
                    <div>
                      <span className="font-medium">Excellence</span>
                      <p className="text-muted-foreground text-sm">We maintain the highest standards in every aspect of our service.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-estate-500 text-white flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</div>
                    <div>
                      <span className="font-medium">Integrity</span>
                      <p className="text-muted-foreground text-sm">We build lasting relationships through honesty and transparency.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-estate-500 text-white flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</div>
                    <div>
                      <span className="font-medium">Innovation</span>
                      <p className="text-muted-foreground text-sm">We embrace new ideas and technologies to enhance the client experience.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section 
        ref={teamRef as React.RefObject<HTMLDivElement>}
        className="py-16 md:py-24 bg-secondary/30"
      >
        <div className="container">
          <div 
            className={cn(
              'text-center max-w-2xl mx-auto mb-12 transition-all duration-700',
              teamIsInView ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'
            )}
          >
            <h2 className="text-3xl font-medium mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground">
              Our team of experienced professionals is dedicated to providing exceptional service 
              and expertise to every client.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {COMPANY_INFO.team.map((member, index) => (
              <div 
                key={member.name}
                className={cn(
                  'bg-white rounded-lg overflow-hidden border border-border/50 shadow-sm transition-all duration-700',
                  teamIsInView ? 'opacity-100 transform-none' : 'opacity-0 translate-y-12'
                )}
                style={{ 
                  transitionDelay: teamIsInView ? `${index * 100}ms` : '0ms',
                }}
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-1">{member.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{member.position}</p>
                  <div className="flex space-x-2">
                    <a href="#" className="p-2 rounded-full bg-secondary/70 text-muted-foreground hover:bg-estate-500 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                    <a href="#" className="p-2 rounded-full bg-secondary/70 text-muted-foreground hover:bg-estate-500 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                      </svg>
                    </a>
                    <a href="#" className="p-2 rounded-full bg-secondary/70 text-muted-foreground hover:bg-estate-500 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        ref={ctaRef as React.RefObject<HTMLDivElement>}
        className="py-16 md:py-24 bg-estate-500 text-white"
      >
        <div className="container">
          <div 
            className={cn(
              'max-w-3xl mx-auto text-center transition-all duration-700',
              ctaIsInView ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'
            )}
          >
            <h2 className="text-3xl md:text-4xl font-medium mb-4">Work With Us</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Whether you're looking to buy, sell, or just explore the market, our team is here to guide you through every step of the process.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-estate-500 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Us <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
