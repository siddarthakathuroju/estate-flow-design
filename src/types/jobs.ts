
export interface Job {
  id: string;
  job_type: string;
  title: string;
  description?: string;
  pay_amount: number;
  status: string;
  created_at: string;
  assigned_to?: string | null;
  property_id?: string | null;
}
