
-- Function to get a job by id
CREATE OR REPLACE FUNCTION public.get_job_by_id(job_id UUID)
RETURNS SETOF public.jobs
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.jobs
  WHERE id = job_id;
$$;

-- Function to get all jobs with status "New"
CREATE OR REPLACE FUNCTION public.get_new_jobs()
RETURNS SETOF public.jobs
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.jobs
  WHERE status = 'New'
  ORDER BY created_at DESC;
$$;

-- Function for a worker to apply for a job
CREATE OR REPLACE FUNCTION public.apply_for_job(job_id UUID, worker_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.jobs
  SET status = 'Applied',
      assigned_to = worker_id
  WHERE id = job_id
    AND status = 'New';
    
  RETURN FOUND;
END;
$$;
