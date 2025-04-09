import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Job } from '@/types/jobs';

// Define interfaces for RPC function parameters
interface GetJobByIdParams {
  job_id: string;
}

interface ApplyForJobParams {
  job_id: string;
  worker_id: string;
}

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyingForJob, setApplyingForJob] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: `/jobs/${id}` } });
      return;
    }
    
    // Fetch job details
    fetchJobDetails();
  }, [isAuthenticated, id, navigate]);

  const fetchJobDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      // Explicitly type the parameters and call with string literals
      const { data, error } = await supabase.rpc(
        'get_job_by_id', 
        { job_id: id } as GetJobByIdParams
      );
      
      if (error) {
        throw error;
      }
      
      // Type assertion for the returned data
      const jobsData = data as Job[];
      
      if (jobsData && Array.isArray(jobsData) && jobsData.length > 0) {
        setJob(jobsData[0]);
      } else {
        setJob(null);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching job details",
        description: error.message || "Could not load job details",
      });
      navigate('/jobs/new');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyForJob = async () => {
    if (!job || !user) return;
    
    try {
      setApplyingForJob(true);
      
      // Explicitly type the parameters
      const { data, error } = await supabase.rpc(
        'apply_for_job', 
        { 
          job_id: job.id, 
          worker_id: user.id 
        } as ApplyForJobParams
      );
      
      if (error) {
        throw error;
      }
      
      // Type assertion for the returned data
      const result = data as boolean;
      
      if (result === true) {
        toast({
          title: "Application successful",
          description: "You have successfully applied for this job",
        });
        
        // Refresh job details
        fetchJobDetails();
      } else {
        throw new Error("Unable to apply for this job");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error applying for job",
        description: error.message || "Could not apply for job",
      });
    } finally {
      setApplyingForJob(false);
    }
  };

  if (loading) {
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
  }

  if (!job) {
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
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
            <p className="text-muted-foreground mb-4">The job you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const canApply = job?.status === 'New' && !job.assigned_to;
  const hasApplied = job?.assigned_to === user?.id;

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
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl">{job?.title}</CardTitle>
                <CardDescription>Job ID: {job?.id}</CardDescription>
              </div>
              <span className="capitalize px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {job?.status}
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Job Type</h3>
                <p>{job?.job_type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Pay Amount</h3>
                <p>${job?.pay_amount?.toLocaleString() || '0'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Job Description</h3>
              <p className="whitespace-pre-wrap">{job?.description}</p>
            </div>
            
            {job && user && (
              <>
                {job.status === 'New' && !job.assigned_to && (
                  <Button 
                    onClick={handleApplyForJob} 
                    className="w-full sm:w-auto mt-4"
                    disabled={applyingForJob}
                  >
                    {applyingForJob ? 'Applying...' : 'Apply for Job'}
                  </Button>
                )}
                
                {job.assigned_to === user.id && (
                  <div className="bg-green-50 border border-green-200 rounded p-4 text-green-700 mt-4">
                    You have applied for this job. The property manager will review your application.
                  </div>
                )}
                
                {job.status !== 'New' && job.assigned_to !== user.id && (
                  <div className="bg-amber-50 border border-amber-200 rounded p-4 text-amber-700 mt-4">
                    This job is no longer available for applications.
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default JobDetail;
