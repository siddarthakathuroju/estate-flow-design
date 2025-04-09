
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/types/jobs';

// Define empty interface for no parameters
interface EmptyParams {}

export function useWorkerJobs() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewJobs();
  }, []);

  const fetchNewJobs = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc<Job[], EmptyParams>(
        'get_new_jobs', 
        {}
      );
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setJobs(data);
      } else {
        setJobs([]);
      }
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      toast({
        variant: "destructive",
        title: "Error fetching jobs",
        description: error.message || "Could not load jobs",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    jobs,
    loading,
    fetchNewJobs
  };
}
