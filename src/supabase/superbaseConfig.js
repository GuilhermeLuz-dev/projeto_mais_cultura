import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://crppxwidcqhqgnagstzb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycHB4d2lkY3FocWduYWdzdHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMTMxNDQsImV4cCI6MjA1OTg4OTE0NH0.ZJyJltJLDnTEdN6-hO5piwaif1-Y_rAfGynzLLzkY_8";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
