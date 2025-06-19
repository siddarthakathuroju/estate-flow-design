
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Eye, ArrowLeft } from 'lucide-react';
import { useWorkerJobs } from '@/hooks/useWorkerJobs';

const WorkerJobs = () => {
  const { isAuthenticated, isWorker } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { jobs, loading } = useWorkerJobs();

  // Redirect if not authenticated or not a worker
  if (!isAuthenticated) {
    navigate('/auth', { state: { from: '/jobs/new' } });
    return null;
  }
  
  if (!isWorker) {
    navigate('/');
    toast({
      variant: "destructive",
      title: "Access denied",
      description: "You need worker permissions to access this page",
    });
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container pt-24 pb-12">
        <Button 
          variant="outline" 
          onClick={() => navigate('/properties')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Properties
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Available Jobs</h1>
            <p className="text-muted-foreground mt-1">
              Browse and apply for available job opportunities
            </p>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Job Type</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Job Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading jobs...
                  </TableCell>
                </TableRow>
              ) : jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No new jobs found. Check back later for new opportunities.
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.id.substring(0, 8)}...</TableCell>
                    <TableCell>{job.job_type}</TableCell>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>${job.pay_amount?.toLocaleString() || '0'}</TableCell>
                    <TableCell>
                      <span className="capitalize px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {job.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" /> View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default WorkerJobs;
