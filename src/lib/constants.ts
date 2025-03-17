
// Navigation
export const NAV_LINKS = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'properties', label: 'Properties', path: '/properties' },
  { id: 'about', label: 'About', path: '/about' },
  { id: 'contact', label: 'Contact', path: '/contact' },
];

// Sample Property Data
export const FEATURED_PROPERTIES = [
  {
    id: 1,
    title: 'Modern Minimalist Villa',
    address: '123 Palm Avenue, Miami, FL',
    price: 1250000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    description: 'Contemporary villa with clean lines and open concept living spaces.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 2,
    title: 'Luxury Penthouse',
    address: '456 Skyline Drive, New York, NY',
    price: 3500000,
    bedrooms: 3,
    bathrooms: 3.5,
    area: 3200,
    description: 'Stunning penthouse with panoramic city views and premium finishes.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 3,
    title: 'Seaside Retreat',
    address: '789 Ocean Boulevard, Malibu, CA',
    price: 4750000,
    bedrooms: 5,
    bathrooms: 4,
    area: 4100,
    description: 'Breathtaking beachfront property with direct access to private beach.',
    image: 'https://images.unsplash.com/photo-1600607687644-4e4512d79987?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 4,
    title: 'Urban Loft Apartment',
    address: '321 Downtown Street, Chicago, IL',
    price: 875000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1800,
    description: 'Stylish loft in the heart of the city with industrial design elements.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
];

export const ALL_PROPERTIES = [
  ...FEATURED_PROPERTIES,
  {
    id: 5,
    title: 'Mountain Cabin',
    address: '555 Pine Trail, Aspen, CO',
    price: 950000,
    bedrooms: 3,
    bathrooms: 2,
    area: 2100,
    description: 'Cozy mountain retreat with stunning views and rustic charm.',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 6,
    title: 'Historic Brownstone',
    address: '777 Heritage Lane, Boston, MA',
    price: 1850000,
    bedrooms: 4,
    bathrooms: 3.5,
    area: 3000,
    description: 'Beautifully restored historic home with modern amenities.',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 7,
    title: 'Waterfront Estate',
    address: '888 Lake View Drive, Seattle, WA',
    price: 5250000,
    bedrooms: 6,
    bathrooms: 5,
    area: 5500,
    description: 'Expansive estate with private dock and incredible water views.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e4a59aaf650?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 8,
    title: 'Desert Oasis',
    address: '999 Saguaro Road, Scottsdale, AZ',
    price: 1650000,
    bedrooms: 4,
    bathrooms: 4,
    area: 3800,
    description: 'Modern desert home with infinity pool and mountain views.',
    image: 'https://images.unsplash.com/photo-1600566753104-685f4b68f975?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
];

// Company information
export const COMPANY_INFO = {
  name: 'Estate Flow',
  founded: 2015,
  mission: 'To connect discerning clients with extraordinary properties through a seamless and personalized experience.',
  description: 'Estate Flow is a premium real estate firm specializing in luxury properties across the United States. Our curated approach and attention to detail ensure that each client finds their perfect space.',
  team: [
    {
      name: 'Alex Morgan',
      position: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Jordan Chen',
      position: 'Principal Broker',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Taylor Williams',
      position: 'Director of Acquisitions',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Jamie Richardson',
      position: 'Head of Marketing',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
  ],
};

// Contact information
export const CONTACT_INFO = {
  email: 'info@estateflow.com',
  phone: '+1 (555) 123-4567',
  address: '1234 Luxury Lane, Suite 500, New York, NY 10001',
  social: {
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com',
  },
};
