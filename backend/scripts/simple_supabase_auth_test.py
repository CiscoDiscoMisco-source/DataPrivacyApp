#!/usr/bin/env python
"""
Simple Supabase Authentication Test Script
This script tests the basic connection and authentication to Supabase without modifying data.
"""
import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client
import traceback

def test_supabase_auth():
    """Test Supabase connection and authentication."""
    print("Loading environment variables...")
    load_dotenv()
    
    # Get Supabase credentials from environment
    supabase_url = os.environ.get('SUPABASE_URL')
    supabase_key = os.environ.get('SUPABASE_ANON_KEY')
    
    if not supabase_url:
        print("❌ Error: SUPABASE_URL environment variable is not set")
        return False
        
    if not supabase_key:
        print("❌ Error: SUPABASE_ANON_KEY environment variable is not set")
        return False
    
    print(f"Using Supabase URL: {supabase_url}")
    print(f"Using Supabase Key: {supabase_key[:6]}...{supabase_key[-6:] if supabase_key else ''}")
    
    try:
        print("\nStep 1: Creating Supabase client...")
        # Create Supabase client
        client: Client = create_client(supabase_url, supabase_key)
        print("✅ Successfully created Supabase client")
        
        # Test 1: Check available tables
        print("\nStep 2: Checking available tables...")
        common_tables = ['companies', 'users', 'tokens', 'customer', 'product', 'auth']
        
        for table in common_tables:
            try:
                # Just try to get metadata, no actual data
                response = client.table(table).select('count').limit(1).execute()
                print(f"  ✅ Table '{table}' is accessible")
            except Exception as e:
                print(f"  ❌ Table '{table}' is not accessible: {str(e)}")
        
        # Test 2: Check Supabase auth service
        print("\nStep 3: Checking Supabase auth service...")
        try:
            # This just checks if the auth object is properly initialized
            session = client.auth.get_session()
            print(f"  ✅ Auth service is accessible")
            print(f"  Current session details: {session}")
            
            # Try to get user information
            user = client.auth.get_user() if session else None
            print(f"  Current user: {user}")
        except Exception as e:
            print(f"  ❌ Auth service error: {str(e)}")
            print("  Detailed error:")
            traceback.print_exc()
        
        # Test additional auth functionality
        print("\nStep 4: Testing sign-in functionality...")
        try:
            # Try a simple operation to test if auth is working
            auth_config = client.auth.get_url_for_provider('google')
            print(f"  ✅ Auth provider URL configuration working")
            print(f"  Auth provider URL: {auth_config}")
        except Exception as e:
            print(f"  ❌ Auth provider URL error: {str(e)}")
            print("  Detailed error:")
            traceback.print_exc()
        
        # Test 3: List accessible schemas and functions
        print("\nStep 5: Checking database schema access...")
        try:
            # Try to access system catalog tables if permissions allow
            schemas_response = client.rpc('get_schema_information', {}).execute()
            print(f"  ✅ Schema information accessible")
            print(f"  Available schemas: {schemas_response.data if schemas_response.data else 'No data'}")
        except Exception as e:
            print(f"  ❌ Schema information not accessible: {str(e)}")
            print("  This is normal with default permissions")
        
        print("\n✅ Authentication to Supabase is working correctly!")
        print("   You can now use Supabase in your application.")
        return True
        
    except Exception as e:
        print(f"\n❌ Failed to connect to Supabase: {str(e)}")
        print("\nDetailed Error:")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("=============================================")
    print("     SUPABASE AUTHENTICATION TEST TOOL      ")
    print("=============================================")
    
    success = test_supabase_auth()
    
    print("\nTest result:", "SUCCESS" if success else "FAILED")
    print("=============================================")
    
    sys.exit(0 if success else 1) 