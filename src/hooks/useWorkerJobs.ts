
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/types/jobs';

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
      
      // Type parameter as Record<string, never> to avoid type error
      const { data, error } = await supabase.rpc<Job[]>('get_new_jobs', {} as unknown as Record<string, never>);
      
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
