
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import JobDetailCard from '@/components/jobs/JobDetailCard';
import JobDetailLoading from '@/components/jobs/JobDetailLoading';
import JobNotFound from '@/components/jobs/JobNotFound';
import { useJobDetail } from '@/hooks/useJobDetail';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const {
    job,
    loading,
    applyingForJob,
    handleApplyForJob
  } = useJobDetail(id, user?.id);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/auth', { state: { from: `/jobs/${id}` } });
    return null;
  }

  if (loading) {
    return <JobDetailLoading />;
  }

  if (!job) {
    return <JobNotFound />;
  }

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
        
        <JobDetailCard 
          job={job} 
          userId={user?.id} 
          applyingForJob={applyingForJob}
          onApplyForJob={handleApplyForJob}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default JobDetail;
