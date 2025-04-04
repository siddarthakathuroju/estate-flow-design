
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield, Check, Upload, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import OtpVerification from '@/components/OtpVerification';
import { useToast } from '@/components/ui/use-toast';

// Define the form schema
const kycFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  documentType: z.string().min(1, { message: "Document type is required" }),
  documentNumber: z.string().min(2, { message: "Document number is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  address: z.string().min(5, { message: "Address is required" }),
});

// Define the stages of the KYC verification process
type KycStage = 'form' | 'document' | 'verification' | 'complete';

export default function KycVerification() {
  const [stage, setStage] = useState<KycStage>('form');
  const { toast } = useToast();

  // Setup form
  const form = useForm<z.infer<typeof kycFormSchema>>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      fullName: '',
      documentType: 'passport',
      documentNumber: '',
      country: '',
      address: '',
    },
  });

  function onSubmitForm(values: z.infer<typeof kycFormSchema>) {
    console.log(values);
    toast({
      title: "KYC information submitted",
      description: "Please continue with document upload",
    });
    setStage('document');
  }

  function handleDocumentUpload() {
    toast({
      title: "Documents uploaded",
      description: "Your documents have been uploaded successfully",
    });
    setStage('verification');
  }

  function handleVerificationComplete(otp: string) {
    console.log("Verification completed with OTP:", otp);
    setStage('complete');
  }

  return (
    <div className="max-w-3xl mx-auto my-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">KYC Verification</h1>
        <p className="text-muted-foreground">
          Complete your Know Your Customer (KYC) verification to access all features of the NFT Property platform
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className={`border ${stage === 'form' ? 'border-primary' : 'border-border'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <UserRound className={`h-5 w-5 ${stage === 'form' || stage === 'document' || stage === 'verification' || stage === 'complete' ? 'text-primary' : 'text-muted-foreground'}`} />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Provide your personal details for verification
              {stage === 'document' || stage === 'verification' || stage === 'complete' ? (
                <Check className="inline-block ml-2 h-4 w-4 text-primary" />
              ) : null}
            </CardDescription>
          </CardContent>
        </Card>

        <Card className={`border ${stage === 'document' ? 'border-primary' : 'border-border'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Upload className={`h-5 w-5 ${stage === 'document' || stage === 'verification' || stage === 'complete' ? 'text-primary' : 'text-muted-foreground'}`} />
              Document Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Upload identification documents for verification
              {stage === 'verification' || stage === 'complete' ? (
                <Check className="inline-block ml-2 h-4 w-4 text-primary" />
              ) : null}
            </CardDescription>
          </CardContent>
        </Card>

        <Card className={`border ${stage === 'verification' || stage === 'complete' ? 'border-primary' : 'border-border'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Shield className={`h-5 w-5 ${stage === 'verification' || stage === 'complete' ? 'text-primary' : 'text-muted-foreground'}`} />
              Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Complete the verification process
              {stage === 'complete' ? (
                <Check className="inline-block ml-2 h-4 w-4 text-primary" />
              ) : null}
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>
            {stage === 'form' && "Personal Information"}
            {stage === 'document' && "Document Upload"}
            {stage === 'verification' && "Verify Your Identity"}
            {stage === 'complete' && "Verification Complete"}
          </CardTitle>
          <CardDescription>
            {stage === 'form' && "Please provide your personal details for KYC verification"}
            {stage === 'document' && "Upload your identification documents"}
            {stage === 'verification' && "Complete the verification process"}
            {stage === 'complete' && "Your KYC verification has been completed successfully"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {stage === 'form' && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name (as it appears on ID)</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Document Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="drivers_license">Driver's License</SelectItem>
                          <SelectItem value="national_id">National ID</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="documentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Document number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country of Residence</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residential Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter your full address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">Continue to Document Upload</Button>
              </form>
            </Form>
          )}

          {stage === 'document' && (
            <div className="space-y-6">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Upload ID Document</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a clear image of your selected identification document
                </p>
                <Button variant="outline" className="mx-auto">Choose File</Button>
              </div>

              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Upload Proof of Address</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a utility bill or bank statement from the last 3 months
                </p>
                <Button variant="outline" className="mx-auto">Choose File</Button>
              </div>

              <Button onClick={handleDocumentUpload} className="w-full">Submit Documents</Button>
            </div>
          )}

          {stage === 'verification' && (
            <div className="py-4">
              <OtpVerification onComplete={handleVerificationComplete} length={6} />
            </div>
          )}

          {stage === 'complete' && (
            <div className="text-center py-8">
              <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-4 inline-flex mx-auto mb-4">
                <Check className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Verification Successful</h2>
              <p className="text-muted-foreground mb-6">
                Your identity has been verified successfully. You now have full access to the NFT Property platform.
              </p>
              <Button size="lg">Back to Home</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
