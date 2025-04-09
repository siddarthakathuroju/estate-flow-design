
import React from 'react';
import { Card } from '@/components/ui/card';
import { Job } from '@/types/jobs';
import JobDetailHeader from './JobDetailHeader';
import JobDetailContent from './JobDetailContent';

interface JobDetailCardProps {
  job: Job;
  userId?: string;
  applyingForJob: boolean;
  onApplyForJob: () => Promise<void>;
}

const JobDetailCard = ({ job, userId, applyingForJob, onApplyForJob }: JobDetailCardProps) => {
  return (
    <Card className="mb-8">
      <JobDetailHeader job={job} />
      <JobDetailContent 
        job={job} 
        userId={userId} 
        isApplying={applyingForJob}
        onApplyForJob={onApplyForJob}
      />
    </Card>
  );
};

export default JobDetailCard;
