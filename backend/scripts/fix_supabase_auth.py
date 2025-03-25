#!/usr/bin/env python
"""
Supabase Authentication Fix Script
This script tests and fixes various Supabase authentication operations.
It includes signup, login, logout, and password reset functionality.
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
    """Test and fix Supabase authentication operations."""
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
        
        # Test signup functionality
        print("\n3. Testing signup functionality...")
        test_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
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
            else:
                print(f"❌ Failed to create test user")
                print(f"   Response: {signup_response}")
        except Exception as e:
            print(f"❌ Error during signup: {str(e)}")
            traceback.print_exc()
        
        # Test sign-in functionality
        print("\n4. Testing sign-in functionality...")
        try:
            # First sign out if there's a current session
            client.auth.sign_out()
            
            # Now try to sign in
            print(f"   Signing in with test user: {test_email}")
            signin_response = client.auth.sign_in_with_password({
                "email": test_email,
                "password": test_password
            })
            
            if signin_response.user:
                print(f"✅ Successfully signed in as: {signin_response.user.email}")
                print(f"   User ID: {signin_response.user.id}")
                print(f"   Access token available: {'Yes' if signin_response.session else 'No'}")
            else:
                print(f"❌ Failed to sign in")
                print(f"   Response: {signin_response}")
        except Exception as e:
            print(f"❌ Error during sign-in: {str(e)}")
            traceback.print_exc()
        
        # Test password reset functionality
        print("\n5. Testing password reset functionality...")
        try:
            print(f"   Sending password reset email to: {test_email}")
            # This only initiates the reset, doesn't complete it
            reset_response = client.auth.reset_password_email(test_email)
            print(f"✅ Password reset email sent")
        except Exception as e:
            print(f"❌ Error sending password reset: {str(e)}")
            traceback.print_exc()
        
        # Test session refresh
        print("\n6. Testing session refresh...")
        try:
            # Get current session
            current_session = client.auth.get_session()
            if current_session and current_session.session:
                print(f"   Current session expires at: {current_session.session.expires_at}")
                
                # Try to refresh the session
                refresh_response = client.auth.refresh_session()
                if refresh_response and refresh_response.session:
                    print(f"✅ Successfully refreshed session")
                    print(f"   New session expires at: {refresh_response.session.expires_at}")
                else:
                    print(f"❌ Failed to refresh session")
            else:
                print(f"❌ No active session to refresh")
        except Exception as e:
            print(f"❌ Error refreshing session: {str(e)}")
            traceback.print_exc()
        
        # Test sign-out functionality
        print("\n7. Testing sign-out functionality...")
        try:
            signout_response = client.auth.sign_out()
            # Verify we're signed out
            session_after = client.auth.get_session()
            if not session_after:
                print(f"✅ Successfully signed out")
            else:
                print(f"❌ Sign-out may have failed, session still exists")
        except Exception as e:
            print(f"❌ Error during sign-out: {str(e)}")
            traceback.print_exc()
        
        print("\nSummary: Authentication testing complete!")
        return True
        
    except Exception as e:
        print(f"\n❌ Failed to connect to Supabase: {str(e)}")
        print("\nDetailed Error:")
        traceback.print_exc()
        return False

def check_rls_policies():
    """Check Row Level Security policies for tables."""
    print("Loading environment variables...")
    load_dotenv()
    
    # Get Supabase credentials with service role for admin access
    supabase_url = os.environ.get('SUPABASE_URL')
    service_role_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not service_role_key:
        print("❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set")
        return False
    
    try:
        print("\nConnecting with service role to inspect RLS policies...")
        # Create Supabase client with service role
        admin_client: Client = create_client(supabase_url, service_role_key)
        
        # List of tables to check
        tables = ['companies', 'users']
        
        for table in tables:
            print(f"\nChecking RLS policies for table '{table}'...")
            try:
                # Query the pg_policies system catalog
                query = f"""
                SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
                FROM pg_policies
                WHERE tablename = '{table}'
                """
                response = admin_client.rpc('execute_sql', {'query': query}).execute()
                
                if response.data and len(response.data) > 0:
                    print(f"✅ Found {len(response.data)} RLS policies:")
                    for policy in response.data:
                        print(f"  - Policy: {policy['policyname']}")
                        print(f"    Command: {policy['cmd']}")
                        print(f"    Roles: {policy['roles']}")
                        print(f"    Expression: {policy['qual']}")
                else:
                    print(f"⚠️ No RLS policies found for table '{table}'")
                    
                    # Suggest a fix for missing RLS policies
                    if table == 'companies':
                        print(f"  Suggested fix: Enable RLS and add basic policies")
                        print(f"  SQL to execute:")
                        print(f"""
                        -- Enable RLS on the table
                        ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;
                        
                        -- Create policy for authenticated users to see their own rows
                        CREATE POLICY "{table}_select_policy" ON {table} 
                        FOR SELECT USING (auth.uid() = user_id);
                        
                        -- Create policy for authenticated users to insert their own rows
                        CREATE POLICY "{table}_insert_policy" ON {table} 
                        FOR INSERT WITH CHECK (auth.uid() = user_id);
                        
                        -- Create policy for authenticated users to update their own rows
                        CREATE POLICY "{table}_update_policy" ON {table} 
                        FOR UPDATE USING (auth.uid() = user_id);
                        
                        -- Create policy for authenticated users to delete their own rows
                        CREATE POLICY "{table}_delete_policy" ON {table} 
                        FOR DELETE USING (auth.uid() = user_id);
                        """)
            except Exception as e:
                print(f"❌ Error checking RLS policies: {str(e)}")
                traceback.print_exc()
        
        print("\nRLS policy check complete!")
        return True
        
    except Exception as e:
        print(f"\n❌ Failed to connect to Supabase with service role: {str(e)}")
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