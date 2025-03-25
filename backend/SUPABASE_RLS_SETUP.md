# Setting Up Row Level Security (RLS) in Supabase

This guide outlines how to set up Row Level Security (RLS) policies in Supabase for the Data Privacy App.

## What is RLS?

Row Level Security (RLS) is a feature in PostgreSQL (which Supabase uses) that allows you to restrict access to rows in a table based on the user making the request. This is essential for our Data Privacy App where users should only be able to access their own data.

## Prerequisites

1. Access to the Supabase dashboard for your project
2. Admin/Owner permissions for the project

## Setup Instructions

### 1. Log into Supabase Dashboard

1. Navigate to [https://app.supabase.io](https://app.supabase.io)
2. Select your project

### 2. Run the RLS Policy SQL Script

1. Go to the SQL Editor in the Supabase dashboard
2. Copy the contents of the `rls_policies.sql` file in the `backend/scripts` directory
3. Paste the SQL into the editor
4. Click "Run" to execute the SQL statements

The script will:
- Add `user_id` columns to tables that need them
- Enable RLS on all tables
- Create appropriate policies for SELECT, INSERT, UPDATE, and DELETE operations
- Set up special policies for admin/service-role access

### 3. Test the Policies

After setting up the policies, test them by:

1. Logging in with a regular user account and verifying you can only see/modify your own data
2. Using the service-role key to verify admin access works correctly

### 4. Troubleshooting

If you encounter issues with the RLS policies:

#### Common RLS Issues:

- **Can't see any data**: Make sure your authenticated user has the correct user_id associated with the data
- **401/403 errors**: Check that you're properly authenticated and your JWT token is being passed correctly
- **Can't insert data**: Ensure the user_id is being set correctly when inserting new records

#### Fixing Issues:

1. Temporarily disable RLS on a table to check if that's the issue:
   ```sql
   ALTER TABLE "table_name" DISABLE ROW LEVEL SECURITY;
   ```

2. Add a permissive policy to troubleshoot:
   ```sql
   CREATE POLICY "troubleshoot_policy" ON "table_name" USING (true);
   ```

3. Check the RLS policies for a table:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'table_name';
   ```

## Understanding the RLS Policies

Our RLS policies follow these patterns:

1. **Companies**: Users can only see and modify companies they own (where `user_id = auth.uid()`)
2. **Users**: Users can only access their own user record (where `id = auth.uid()`)
3. **User Preferences**: Users can only access their own preferences (where `user_id = auth.uid()`)
4. **Data Sharing Policies**: 
   - Everyone can view all policies (using `true` for SELECT)
   - Only company owners can modify policies related to their companies

## Code Integration

The frontend and backend code has been updated to work with these RLS policies:

- Frontend components now include `user_id` in requests
- Backend models ensure `user_id` is properly set when saving data
- API endpoints use the correct methods that respect RLS policies

## Conclusion

With these RLS policies in place, the Data Privacy App now has proper data isolation and security. Users can only access their own data, which is essential for a privacy-focused application. 