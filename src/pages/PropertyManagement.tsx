
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Building, Plus, Edit, Trash2 } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description?: string;
  status: string;
  created_at: string;
}

const PropertyManagement = () => {
  const { isAuthenticated, isManager } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    description: '',
  });

  useEffect(() => {
    // Redirect if not authenticated or not a manager
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/properties/manage' } });
      return;
    }
    
    if (!isManager) {
      navigate('/');
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You need manager permissions to access this page",
      });
      return;
    }
    
    // Fetch properties
    fetchProperties();
  }, [isAuthenticated, isManager, navigate]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setProperties(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching properties",
        description: error.message || "Could not load properties",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      if (!formData.title || !formData.address || !formData.price) {
        toast({
          variant: "destructive",
          title: "Missing required fields",
          description: "Please fill in all required fields",
        });
        return;
      }
      
      const propertyData = {
        title: formData.title,
        address: formData.address,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms || '0'),
        bathrooms: parseInt(formData.bathrooms || '0'),
        area: parseFloat(formData.area || '0'),
        description: formData.description,
        status: 'available',
      };
      
      const { data, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Property created",
        description: "The property has been added successfully",
      });
      
      // Reset form and fetch updated properties
      setFormData({
        title: '',
        address: '',
        price: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        description: '',
      });
      setShowForm(false);
      fetchProperties();
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating property",
        description: error.message || "Could not create property",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Building className="mr-2" />
              Property Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your real estate portfolio
            </p>
          </div>
          
          <Button 
            onClick={() => setShowForm(!showForm)} 
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'Cancel' : 'Add New Property'}
          </Button>
        </div>
        
        {showForm && (
          <div className="bg-card border rounded-lg p-6 mb-8 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Add New Property</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Property Title *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter property title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Address *
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter property address"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium">
                    Price ($) *
                  </label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="area" className="text-sm font-medium">
                    Area (sq ft)
                  </label>
                  <Input
                    id="area"
                    name="area"
                    type="number"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="Enter area in square feet"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="bedrooms" className="text-sm font-medium">
                    Bedrooms
                  </label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    placeholder="Number of bedrooms"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="bathrooms" className="text-sm font-medium">
                    Bathrooms
                  </label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    placeholder="Number of bathrooms"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter property description"
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Create Property
                </Button>
              </div>
            </form>
          </div>
        )}
        
        <div className="bg-card border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">Bedrooms</TableHead>
                <TableHead className="hidden md:table-cell">Bathrooms</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading properties...
                  </TableCell>
                </TableRow>
              ) : properties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No properties found. Create your first property using the "Add New Property" button.
                  </TableCell>
                </TableRow>
              ) : (
                properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.title}</TableCell>
                    <TableCell>{property.address}</TableCell>
                    <TableCell>${property.price.toLocaleString()}</TableCell>
                    <TableCell className="hidden md:table-cell">{property.bedrooms}</TableCell>
                    <TableCell className="hidden md:table-cell">{property.bathrooms}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="capitalize px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {property.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PropertyManagement;
