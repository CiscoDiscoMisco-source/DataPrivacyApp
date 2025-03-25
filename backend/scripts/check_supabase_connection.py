#!/usr/bin/env python
"""
Script to check Supabase connection.
Run this script to validate your Supabase connection before deploying.
"""
import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

# Add the parent directory to sys.path to import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def check_connection():
    """Check the connection to Supabase."""
    load_dotenv()
    
    # Get Supabase credentials from environment
    supabase_url = os.environ.get('SUPABASE_URL')
    supabase_key = os.environ.get('SUPABASE_ANON_KEY')
    
    if not supabase_url or not supabase_key:
        print("❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY environment variables must be set")
        return False
    
    try:
        # Create Supabase client
        client: Client = create_client(supabase_url, supabase_key)
        
        # Try a simple query to test the connection
        response = client.table('companies').select('count').limit(1).execute()
        
        print("✅ Successfully connected to Supabase")
        print(f"Response: {response.data}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to connect to Supabase: {str(e)}")
        return False

if __name__ == "__main__":
    print("Checking Supabase connection...")
    print("--------------------------------")
    
    success = check_connection()
    print("\nConnection check complete!")
    sys.exit(0 if success else 1) 