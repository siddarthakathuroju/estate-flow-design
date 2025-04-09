
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import JobStatusBadge from './JobStatusBadge';
import { Job } from '@/types/jobs';

interface JobDetailHeaderProps {
  job: Job;
}

const JobDetailHeader = ({ job }: JobDetailHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-3xl">{job.title}</CardTitle>
          <CardDescription>Job ID: {job.id}</CardDescription>
        </div>
        <JobStatusBadge status={job.status} />
      </div>
    </CardHeader>
  );
};

export default JobDetailHeader;
