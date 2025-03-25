#!/usr/bin/env python
"""
Script to verify authentication and RLS functionality.
Tests if authentication is working and if RLS policies are correctly applied.
"""
import os
import sys
import uuid
from dotenv import load_dotenv
from supabase import create_client, Client
import traceback
import time
import json

def verify_auth_and_rls():
    """Verify authentication and RLS functionality."""
    print("Loading environment variables...")
    load_dotenv()
    
    # Get Supabase credentials
    supabase_url = os.environ.get('SUPABASE_URL')
    anon_key = os.environ.get('SUPABASE_ANON_KEY')
    service_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not anon_key or not service_key:
        print("❌ Error: SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY environment variables must be set")
        return False
    
    try:
        print("\n===== Test 1: Admin Access =====")
        # Connect with service role key (admin access)
        admin_client = create_client(supabase_url, service_key)
        print("✅ Connected with service role key")
        
        # Test admin access to tables
        tables = ['companies', 'users', 'user_preferences']
        for table in tables:
            try:
                response = admin_client.table(table).select('*').limit(5).execute()
                print(f"✅ Admin can access '{table}' table: {len(response.data)} records found")
            except Exception as e:
                print(f"❌ Admin access to '{table}' failed: {str(e)}")
        
        print("\n===== Test 2: Anonymous Access =====")
        # Connect with anon key (unauthenticated)
        anon_client = create_client(supabase_url, anon_key)
        print("✅ Connected with anonymous key")
        
        # Test anonymous access to tables
        for table in tables:
            try:
                response = anon_client.table(table).select('*').limit(5).execute()
                if len(response.data) > 0:
                    print(f"⚠️ Anonymous user can access data in '{table}' table: {len(response.data)} records")
                else:
                    print(f"✅ Anonymous user cannot access data in '{table}' table")
            except Exception as e:
                print(f"✅ Anonymous access properly blocked: {str(e)}")
        
        print("\n===== Test 3: User Authentication =====")
        # Test user authentication
        # Ask for credentials
        print("\nPlease enter user credentials to test authentication:")
        email = input("Email: ").strip()
        password = input("Password: ").strip()
        
        if email and password:
            try:
                print(f"\nAttempting to sign in as {email}...")
                auth_response = anon_client.auth.sign_in_with_password({
                    "email": email,
                    "password": password
                })
                
                if auth_response.user:
                    print(f"✅ Successfully signed in as: {auth_response.user.email}")
                    print(f"  User ID: {auth_response.user.id}")
                    user_id = auth_response.user.id
                    
                    # Test RLS with authenticated user
                    print("\n===== Test 4: Authenticated User Access (RLS Test) =====")
                    
                    # Create test company with authenticated user
                    print("\nCreating a test company...")
                    company_name = f"Test Company {uuid.uuid4().hex[:8]}"
                    company_data = {
                        "name": company_name,
                        "description": "Created by verify script",
                        "user_id": user_id
                    }
                    
                    try:
                        insert_response = anon_client.table('companies').insert(company_data).execute()
                        if insert_response.data:
                            company_id = insert_response.data[0]['id']
                            print(f"✅ Successfully created company: {company_name} (ID: {company_id})")
                            
                            # Read back the company
                            read_response = anon_client.table('companies').select('*').eq('id', company_id).execute()
                            if read_response.data:
                                print(f"✅ Successfully read created company with authenticated user")
                            else:
                                print(f"❌ Could not read created company with authenticated user")
                            
                            # Clean up the test company
                            admin_client.table('companies').delete().eq('id', company_id).execute()
                            print(f"✅ Test company deleted")
                        else:
                            print(f"❌ Failed to create test company")
                    except Exception as e:
                        print(f"❌ Error testing company creation: {str(e)}")
                        traceback.print_exc()
                        
                    # Sign out
                    anon_client.auth.sign_out()
                    print("\n✅ Signed out successfully")
                else:
                    print(f"❌ Failed to sign in")
            except Exception as e:
                print(f"❌ Error during authentication: {str(e)}")
                traceback.print_exc()
        else:
            print("  Skipping authentication test (no credentials provided)")
        
        print("\nVerification complete!")
        return True
        
    except Exception as e:
        print(f"\n❌ Failed to verify: {str(e)}")
        print("\nDetailed Error:")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("=============================================")
    print("     SUPABASE AUTH & RLS VERIFICATION       ")
    print("=============================================")
    
    success = verify_auth_and_rls()
    
    print("\nVerification result:", "SUCCESS" if success else "FAILED")
    print("=============================================")
    
    sys.exit(0 if success else 1) 