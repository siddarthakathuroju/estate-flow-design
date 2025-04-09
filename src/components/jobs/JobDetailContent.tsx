
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Job } from '@/types/jobs';

interface JobDetailContentProps {
  job: Job;
  userId?: string;
  isApplying: boolean;
  onApplyForJob: () => Promise<void>;
}

const JobDetailContent = ({ job, userId, isApplying, onApplyForJob }: JobDetailContentProps) => {
  const canApply = job.status === 'New' && !job.assigned_to;
  const hasApplied = job.assigned_to === userId;

  return (
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Job Type</h3>
          <p>{job.job_type}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Pay Amount</h3>
          <p>${job.pay_amount?.toLocaleString() || '0'}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Job Description</h3>
        <p className="whitespace-pre-wrap">{job.description}</p>
      </div>
      
      {userId && (
        <>
          {canApply && (
            <Button 
              onClick={onApplyForJob} 
              className="w-full sm:w-auto mt-4"
              disabled={isApplying}
            >
              {isApplying ? 'Applying...' : 'Apply for Job'}
            </Button>
          )}
          
          {hasApplied && (
            <div className="bg-green-50 border border-green-200 rounded p-4 text-green-700 mt-4">
              You have applied for this job. The property manager will review your application.
            </div>
          )}
          
          {job.status !== 'New' && job.assigned_to !== userId && (
            <div className="bg-amber-50 border border-amber-200 rounded p-4 text-amber-700 mt-4">
              This job is no longer available for applications.
            </div>
          )}
        </>
      )}
    </CardContent>
  );
};

export default JobDetailContent;
