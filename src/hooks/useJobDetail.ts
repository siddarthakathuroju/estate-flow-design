
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/types/jobs';

// Create an interface for the RPC parameter
interface GetJobByIdParams {
  job_id: string;
}

// Create an interface for the RPC parameter for applying to a job
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
      
      const { data, error } = await supabase
        .rpc<Job[], GetJobByIdParams>('get_job_by_id', { job_id: id })
        .returns<Job[]>();
      
      if (error) {
        throw error;
      }
      
      // Safely check the data structure
      if (data && Array.isArray(data) && data.length > 0) {
        setJob(data[0]);
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
      
      const { data, error } = await supabase
        .rpc<boolean, ApplyForJobParams>('apply_for_job', {
          job_id: job.id,
          worker_id: userId
        })
        .returns<boolean>();
      
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
