// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yedoxjazmwtfpeaihtth.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZG94amF6bXd0ZnBlYWlodHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NDI3MjUsImV4cCI6MjA1OTIxODcyNX0.gEAzcx59Nd-LszcIo2anwgxK6aZWbei_aTUxabdFTvQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);