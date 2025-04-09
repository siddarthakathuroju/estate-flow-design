
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const JobDetailLoading = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container pt-24 pb-12">
        <Button 
          variant="outline" 
          onClick={() => navigate('/jobs/new')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Jobs
        </Button>
        <div className="flex items-center justify-center h-64">
          <p>Loading job details...</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobDetailLoading;
