-- RLS Policies for Data Privacy App
-- Run this SQL in the Supabase SQL editor to set up RLS policies

-- Step 1: Ensure tables have user_id columns
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Step 2: Enable RLS on all tables that need it
ALTER TABLE "companies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_preferences" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "data_sharing_policies" ENABLE ROW LEVEL SECURITY;

-- Step 3: Set up RLS policies for companies table
-- Companies - restrict to owner
DROP POLICY IF EXISTS "companies_select_policy" ON "companies";
DROP POLICY IF EXISTS "companies_insert_policy" ON "companies";
DROP POLICY IF EXISTS "companies_update_policy" ON "companies";
DROP POLICY IF EXISTS "companies_delete_policy" ON "companies";

CREATE POLICY "companies_select_policy" ON "companies" 
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "companies_insert_policy" ON "companies" 
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "companies_update_policy" ON "companies" 
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "companies_delete_policy" ON "companies" 
FOR DELETE USING (user_id = auth.uid());

-- Step 4: Set up RLS policies for users table
-- Users - users can only see/edit their own data
DROP POLICY IF EXISTS "users_select_policy" ON "users";
DROP POLICY IF EXISTS "users_update_policy" ON "users";

CREATE POLICY "users_select_policy" ON "users" 
FOR SELECT USING (id = auth.uid());

CREATE POLICY "users_update_policy" ON "users" 
FOR UPDATE USING (id = auth.uid());

-- Step 5: Set up RLS policies for user_preferences table
-- User preferences - users can only access their own preferences
DROP POLICY IF EXISTS "user_preferences_select_policy" ON "user_preferences";
DROP POLICY IF EXISTS "user_preferences_insert_policy" ON "user_preferences";
DROP POLICY IF EXISTS "user_preferences_update_policy" ON "user_preferences";
DROP POLICY IF EXISTS "user_preferences_delete_policy" ON "user_preferences";

CREATE POLICY "user_preferences_select_policy" ON "user_preferences" 
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "user_preferences_insert_policy" ON "user_preferences" 
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_preferences_update_policy" ON "user_preferences" 
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "user_preferences_delete_policy" ON "user_preferences" 
FOR DELETE USING (user_id = auth.uid());

-- Step 6: Set up RLS policies for data_sharing_policies table
-- Data sharing policies - all users can read, but only company owners can modify
DROP POLICY IF EXISTS "data_sharing_policies_select_policy" ON "data_sharing_policies";
DROP POLICY IF EXISTS "data_sharing_policies_insert_policy" ON "data_sharing_policies";
DROP POLICY IF EXISTS "data_sharing_policies_update_policy" ON "data_sharing_policies";
DROP POLICY IF EXISTS "data_sharing_policies_delete_policy" ON "data_sharing_policies";

-- Anyone can view data sharing policies
CREATE POLICY "data_sharing_policies_select_policy" ON "data_sharing_policies" 
FOR SELECT USING (true);

-- Only company owners can insert/update/delete data sharing policies
CREATE POLICY "data_sharing_policies_insert_policy" ON "data_sharing_policies" 
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM companies c 
        WHERE c.id = company_id AND c.user_id = auth.uid()
    )
);

CREATE POLICY "data_sharing_policies_update_policy" ON "data_sharing_policies" 
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM companies c 
        WHERE c.id = company_id AND c.user_id = auth.uid()
    )
);

CREATE POLICY "data_sharing_policies_delete_policy" ON "data_sharing_policies" 
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM companies c 
        WHERE c.id = company_id AND c.user_id = auth.uid()
    )
);

-- Step 7: Create an admin policy for service-role access
-- This ensures the service role can bypass RLS
DROP POLICY IF EXISTS "admin_all_access" ON "companies";
DROP POLICY IF EXISTS "admin_all_access" ON "users";
DROP POLICY IF EXISTS "admin_all_access" ON "user_preferences";
DROP POLICY IF EXISTS "admin_all_access" ON "data_sharing_policies";

CREATE POLICY "admin_all_access" ON "companies" 
USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "admin_all_access" ON "users" 
USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "admin_all_access" ON "user_preferences" 
USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "admin_all_access" ON "data_sharing_policies" 
USING (auth.jwt() ->> 'role' = 'service_role'); 