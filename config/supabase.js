const  { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://isrvxqdgfhabdgqtubui.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzcnZ4cWRnZmhhYmRncXR1YnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODgzMjcsImV4cCI6MjA4MDE2NDMyN30.VE9bhCL8UpLG-GhM_94FIuxoiTvIuTymAEa-xA6kBIw"


const supabase = createClient(supabaseUrl, supabaseKey)


module.exports = supabase