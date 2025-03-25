#!/usr/bin/env python
"""
Script to check Supabase connection.
Run this script to validate your Supabase connection before deploying.
"""
import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client
import traceback

# Add the parent directory to sys.path to import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def check_connection():
    """Check the connection to Supabase."""
    print("Loading environment variables...")
    load_dotenv()
    
    # Get Supabase credentials from environment
    supabase_url = os.environ.get('SUPABASE_URL')
    supabase_key = os.environ.get('SUPABASE_ANON_KEY')
    
    if not supabase_url:
        print("❌ Error: SUPABASE_URL environment variable is not set")
        print(f"Current value: {supabase_url}")
        return False
        
    if not supabase_key:
        print("❌ Error: SUPABASE_ANON_KEY environment variable is not set")
        print(f"Current value: {supabase_key}")
        return False
    
    print(f"Using Supabase URL: {supabase_url}")
    print(f"Using Supabase Key: {supabase_key[:6]}...{supabase_key[-6:] if supabase_key else ''}")
    
    try:
        print("Creating Supabase client...")
        # Create Supabase client
        client: Client = create_client(supabase_url, supabase_key)
        
        # Try a simple query to test the connection
        print("Executing test query...")
        response = client.table('companies').select('count').limit(1).execute()
        
        print("\n✅ Successfully connected to Supabase")
        print(f"Response data: {response.data}")
        return True
        
    except Exception as e:
        print(f"\n❌ Failed to connect to Supabase: {str(e)}")
        print("\nDetailed Error:")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("=============================================")
    print("       SUPABASE CONNECTION TEST TOOL        ")
    print("=============================================")
    
    success = check_connection()
    
    print("\nConnection check complete!")
    print("Result:", "SUCCESS" if success else "FAILED")
    print("=============================================")
    
    sys.exit(0 if success else 1) 