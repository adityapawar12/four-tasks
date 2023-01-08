import { createClient } from "@supabase/supabase-js";

console.log(import.meta.env.VITE_REACT_APP_SUPABASE_URL);
const supabaseUrl = import.meta.env.VITE_REACT_APP_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(
  "https://vxgcmomqjxseuetwnbua.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4Z2Ntb21xanhzZXVldHduYnVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzMxMTYyNzYsImV4cCI6MTk4ODY5MjI3Nn0.A1vkUJL4nUxyEhS4T92bhYqcXTFi2sXzxT8yuVXQvlE"
);
