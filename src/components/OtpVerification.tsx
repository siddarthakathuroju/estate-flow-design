
import React, { useState } from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface OtpVerificationProps {
  onComplete: (otp: string) => void;
  length?: number;
}

export default function OtpVerification({ onComplete, length = 6 }: OtpVerificationProps) {
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleComplete = (value: string) => {
    setOtp(value);
  };

  const handleVerify = () => {
    if (otp.length !== length) {
      setError("Please enter the complete verification code");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    // Simulate verification process
    setTimeout(() => {
      if (otp === '123456') { // Demo code for testing
        setSuccess(true);
        toast({
          title: "Verification Successful",
          description: "Your wallet has been verified successfully",
        });
        onComplete(otp);
      } else {
        setError("Invalid verification code. Please try again.");
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: "The code you entered is incorrect. Please try again.",
        });
      }
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">Verify Your Wallet</h2>
        <p className="text-sm text-muted-foreground">
          Please enter the 6-digit code sent to your connected wallet
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm bg-destructive/10 border border-destructive/20 rounded-md text-destructive flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 text-sm bg-green-50 border border-green-200 rounded-md text-green-800 flex items-start">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>Wallet successfully verified! You can now access all features.</p>
        </div>
      )}

      <div className="flex justify-center">
        <InputOTP
          maxLength={length}
          value={otp}
          onChange={handleComplete}
          disabled={isSubmitting || success}
        >
          <InputOTPGroup>
            {Array.from({ length }).map((_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="space-y-3">
        <Button
          className="w-full"
          disabled={otp.length !== length || isSubmitting || success}
          onClick={handleVerify}
        >
          {isSubmitting ? "Verifying..." : "Verify Wallet"}
        </Button>

        <div className="text-center text-sm">
          <button 
            className="text-primary hover:text-primary/80 font-medium" 
            disabled={isSubmitting || success}
          >
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
}
