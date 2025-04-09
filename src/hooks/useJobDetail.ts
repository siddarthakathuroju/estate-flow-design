
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/types/jobs';

// Define interfaces for RPC function parameters
interface GetJobByIdParams {
  job_id: string;
}

interface ApplyForJobParams {
  job_id: string;
  worker_id: string;
}

export function useJobDetail(id: string | undefined, userId: string | undefined) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyingForJob, setApplyingForJob] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      // Use type assertion for parameters and don't provide generic type parameters
      const { data, error } = await supabase.rpc('get_job_by_id', { job_id: id });
      
      if (error) {
        throw error;
      }
      
      // Type the response data properly
      if (data && Array.isArray(data) && data.length > 0) {
        setJob(data[0] as Job);
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
    if (!job || !userId) return;
    
    try {
      setApplyingForJob(true);
      
      // Use type assertion for parameters and don't provide generic type parameters
      const { data, error } = await supabase.rpc(
        'apply_for_job', 
        { 
          job_id: job.id, 
          worker_id: userId 
        }
      );
      
      if (error) {
        throw error;
      }
      
      if (data === true) {
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

  return {
    job,
    loading,
    applyingForJob,
    handleApplyForJob,
    fetchJobDetails
  };
}
