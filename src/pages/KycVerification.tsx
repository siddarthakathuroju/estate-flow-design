
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KycVerification from '@/components/kyc/KycVerification';
import { useAuth } from '@/context/AuthContext';

export default function KycVerificationPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect unauthenticated users to the login page
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/kyc' } });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return <KycVerification />;
}
