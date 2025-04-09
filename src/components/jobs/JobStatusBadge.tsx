
import React from 'react';

interface JobStatusBadgeProps {
  status: string;
  className?: string;
}

const JobStatusBadge = ({ status, className = '' }: JobStatusBadgeProps) => {
  return (
    <span className={`capitalize px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 ${className}`}>
      {status}
    </span>
  );
};

export default JobStatusBadge;
