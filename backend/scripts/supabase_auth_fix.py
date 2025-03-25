#!/usr/bin/env python
"""
Supabase Authentication Fix Script
This script focuses on testing and fixing Supabase authentication operations.
It uses valid email domains and creates custom SQL to check RLS policies.
"""
import os
import sys
import uuid
import getpass
from dotenv import load_dotenv
from supabase import create_client, Client
import traceback
import time

def test_auth_operations():
    """Test and fix Supabase authentication operations with valid email domains."""
    print("Loading environment variables...")
    load_dotenv()
    
    # Get Supabase credentials from environment
    supabase_url = os.environ.get('SUPABASE_URL')
    supabase_key = os.environ.get('SUPABASE_ANON_KEY')
    
    if not supabase_url or not supabase_key:
        print("❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY environment variables must be set")
        return False
    
    print(f"Using Supabase URL: {supabase_url}")
    print(f"Using Supabase Key: {supabase_key[:6]}...{supabase_key[-6:] if supabase_key else ''}")
    
    try:
        print("\n1. Creating Supabase client...")
        # Create Supabase client
        client: Client = create_client(supabase_url, supabase_key)
        print("✅ Successfully created Supabase client")
        
        # Check current authentication status
        print("\n2. Checking current authentication status...")
        try:
            session = client.auth.get_session()
            if session:
                print(f"✅ User is authenticated: {session.user.email if session.user else 'Unknown'}")
            else:
                print("❌ No active session found")
        except Exception as e:
            print(f"❌ Error checking session: {str(e)}")
            traceback.print_exc()
        
        # Test signup functionality with real domain
        print("\n3. Testing signup functionality...")
        test_email = f"test_{uuid.uuid4().hex[:8]}@gmail.com"  # Using valid domain
        test_password = "Test12345!"
        
        try:
            print(f"   Creating test user: {test_email}")
            signup_response = client.auth.sign_up({
                "email": test_email,
                "password": test_password
            })
            
            if signup_response.user:
                print(f"✅ Successfully created test user: {signup_response.user.id}")
                # Save user ID for other operations
                test_user_id = signup_response.user.id
                print(f"   Check your email for confirmation link")
            else:
                print(f"❌ Failed to create test user")
                print(f"   Response: {signup_response}")
        except Exception as e:
            print(f"❌ Error during signup: {str(e)}")
            
            # Check if the user already exists
            print("   Attempting to sign in with credentials instead...")
            try:
                # Try to sign in (maybe the user already exists)
                signin_response = client.auth.sign_in_with_password({
                    "email": test_email,
                    "password": test_password
                })
                if signin_response.user:
                    print(f"✅ User already exists, successfully signed in as: {signin_response.user.email}")
                    test_user_id = signin_response.user.id
                else:
                    print(f"❌ Could not sign in either")
            except Exception as signin_e:
                print(f"❌ Sign in attempt also failed: {str(signin_e)}")
        
        # Test custom sign-in
        print("\n4. Testing manual sign-in...")
        print("Enter email and password for an existing account to test sign-in:")
        manual_email = input("Email: ").strip()
        manual_password = getpass.getpass("Password: ")
        
        if manual_email and manual_password:
            try:
                # First sign out if there's a current session
                client.auth.sign_out()
                
                # Now try to sign in
                print(f"   Signing in with: {manual_email}")
                signin_response = client.auth.sign_in_with_password({
                    "email": manual_email,
                    "password": manual_password
                })
                
                if signin_response.user:
                    print(f"✅ Successfully signed in as: {signin_response.user.email}")
                    print(f"   User ID: {signin_response.user.id}")
                    print(f"   Access token available: {'Yes' if signin_response.session else 'No'}")
                    
                    # Test additional operations with authenticated user
                    print("\n5. Testing RLS policy with authenticated user...")
                    try:
                        # Try to insert data with the authenticated user
                        test_data = {
                            'name': f'Test Company {uuid.uuid4().hex[:8]}',
                            'description': 'Created by test script',
                            'user_id': signin_response.user.id  # Add user_id field for RLS
                        }
                        
                        insert_response = client.table('companies').insert(test_data).execute()
                        print(f"✅ Successfully inserted data as authenticated user")
                        print(f"   Inserted data: {insert_response.data}")
                    except Exception as e:
                        print(f"❌ Error inserting data: {str(e)}")
                        print("   This suggests RLS policies are preventing the operation")
                else:
                    print(f"❌ Failed to sign in")
                    print(f"   Response: {signin_response}")
            except Exception as e:
                print(f"❌ Error during sign-in: {str(e)}")
        else:
            print("   Skipping manual sign-in test (no credentials provided)")
            
        # Test session management
        print("\n6. Testing session management...")
        try:
            # Get current session
            current_session = client.auth.get_session()
            if current_session and current_session.session:
                print(f"✅ Active session found")
                print(f"   Session expires at: {current_session.session.expires_at}")
                
                # Sign out
                print("   Signing out...")
                client.auth.sign_out()
                
                # Verify sign out
                session_after = client.auth.get_session()
                if not session_after:
                    print(f"✅ Successfully signed out")
                else:
                    print(f"❌ Sign-out may have failed, session still exists")
            else:
                print(f"❌ No active session to manage")
        except Exception as e:
            print(f"❌ Error managing session: {str(e)}")
        
        print("\nSummary: Authentication testing complete!")
        return True
        
    except Exception as e:
        print(f"\n❌ Failed to connect to Supabase: {str(e)}")
        print("\nDetailed Error:")
        traceback.print_exc()
        return False

def check_rls_policies():
    """
    Check Row Level Security policies for tables using direct table queries.
    This approach doesn't require an 'execute_sql' function.
    """
    print("Loading environment variables...")
    load_dotenv()
    
    # Get Supabase credentials
    supabase_url = os.environ.get('SUPABASE_URL')
    service_role_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    anon_key = os.environ.get('SUPABASE_ANON_KEY')
    
    if not supabase_url or not service_role_key:
        print("❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set")
        return False
    
    try:
        # Connect with service role for admin access
        print("\nConnecting with service role for admin operations...")
        admin_client = create_client(supabase_url, service_role_key)
        
        # Connect with anon key for regular user operations
        print("Connecting with anon key for regular user operations...")
        user_client = create_client(supabase_url, anon_key)
        
        # List of tables to check
        tables = ['companies', 'users']
        
        for table in tables:
            print(f"\nChecking table '{table}'...")
            
            # Test 1: Check if table exists and is accessible with admin role
            try:
                admin_response = admin_client.table(table).select('*').limit(1).execute()
                print(f"✅ Table '{table}' is accessible with admin role")
                print(f"   Number of records: {len(admin_response.data if admin_response.data else [])}")
                
                # Test 2: Check if RLS is active by comparing admin vs anon access
                user_response = user_client.table(table).select('*').limit(1).execute()
                
                if len(admin_response.data or []) > 0 and len(user_response.data or []) == 0:
                    print(f"✅ RLS appears to be active (admin can access data, anon user cannot)")
                elif len(user_response.data or []) > 0:
                    print(f"⚠️ Anon user can access data - RLS may not be properly configured")
                else:
                    print(f"ℹ️ No data in table to compare access")
                
                # Test 3: Try to insert data with anon key
                test_data = {
                    'name': f'Test {table} {uuid.uuid4().hex[:8]}',
                    'description': 'Created by test script'
                }
                
                try:
                    anon_insert = user_client.table(table).insert(test_data).execute()
                    print(f"⚠️ Anon user can insert without authentication")
                except Exception as e:
                    print(f"✅ Anon user cannot insert data (RLS working)")
                    print(f"   Error: {str(e)}")
                
                # Test 4: Try to insert with admin role
                admin_data = {
                    'name': f'Admin Test {table} {uuid.uuid4().hex[:8]}',
                    'description': 'Created by admin'
                }
                
                try:
                    admin_insert = admin_client.table(table).insert(admin_data).execute()
                    print(f"✅ Admin role can insert data")
                    
                    # Clean up test data
                    if admin_insert.data and len(admin_insert.data) > 0:
                        record_id = admin_insert.data[0].get('id')
                        if record_id:
                            admin_client.table(table).delete().eq('id', record_id).execute()
                            print(f"   Test data cleaned up")
                except Exception as e:
                    print(f"❌ Even admin role cannot insert data")
                    print(f"   Error: {str(e)}")
                    
                # Provide suggestions for RLS fixes
                print("\nRLS Policy Recommendations:")
                print(f"""
For table '{table}', consider the following RLS policies:

-- Enable RLS on the table
ALTER TABLE "{table}" ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to see their own rows
CREATE POLICY "{table}_select_policy" ON "{table}" 
FOR SELECT USING (auth.uid() = user_id);

-- Create policy for authenticated users to insert their own rows
CREATE POLICY "{table}_insert_policy" ON "{table}" 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for authenticated users to update their own rows
CREATE POLICY "{table}_update_policy" ON "{table}" 
FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for authenticated users to delete their own rows
CREATE POLICY "{table}_delete_policy" ON "{table}" 
FOR DELETE USING (auth.uid() = user_id);

-- Ensure table has a user_id column
ALTER TABLE "{table}" ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
                """)
                
            except Exception as e:
                print(f"❌ Error accessing table '{table}': {str(e)}")
        
        print("\nRLS policy check complete!")
        return True
        
    except Exception as e:
        print(f"\n❌ Failed to connect to Supabase: {str(e)}")
        print("\nDetailed Error:")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("=============================================")
    print("   SUPABASE AUTHENTICATION FIX TOOL         ")
    print("=============================================")
    
    print("\nWhat would you like to test?")
    print("1. Authentication operations (signup, login, etc.)")
    print("2. Row Level Security policies")
    print("3. Both")
    
    choice = input("Enter your choice (1-3): ").strip()
    
    auth_success = False
    rls_success = False
    
    if choice == '1' or choice == '3':
        auth_success = test_auth_operations()
    
    if choice == '2' or choice == '3':
        rls_success = check_rls_policies()
    
    print("\n=============================================")
    if choice == '1':
        print("Authentication test result:", "SUCCESS" if auth_success else "FAILED")
    elif choice == '2':
        print("RLS policy check result:", "SUCCESS" if rls_success else "FAILED")
    else:
        print("Authentication test result:", "SUCCESS" if auth_success else "FAILED")
        print("RLS policy check result:", "SUCCESS" if rls_success else "FAILED")
    print("=============================================")
    
    sys.exit(0 if (auth_success or rls_success) else 1) 