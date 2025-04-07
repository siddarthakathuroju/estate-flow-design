
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Web3ReactProvider } from '@web3-react/core';

import Index from './pages/Index';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import PropertyManagement from './pages/PropertyManagement';
import About from './pages/About';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Portfolio from './pages/Portfolio';
import NotFound from './pages/NotFound';
import KycVerification from './pages/KycVerification';
import WorkerJobs from './pages/WorkerJobs';
import JobDetail from './pages/JobDetail';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import { connectors } from '@/lib/wallet-connectors';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <Web3ReactProvider connectors={connectors}>
          <AuthProvider>
            <Router>
              <div className="flex flex-col min-h-screen">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/properties/:id" element={<PropertyDetail />} />
                  <Route path="/properties/manage" element={<PropertyManagement />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/kyc" element={<KycVerification />} />
                  <Route path="/jobs/new" element={<WorkerJobs />} />
                  <Route path="/jobs/:id" element={<JobDetail />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </Router>
            <Toaster />
          </AuthProvider>
        </Web3ReactProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
