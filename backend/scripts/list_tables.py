#!/usr/bin/env python
"""
Script to list all tables in Supabase and display their schema.
"""
import os
import sys
from dotenv import load_dotenv
from supabase import create_client

# Add the parent directory to sys.path to import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def get_supabase_client():
    """Get Supabase client."""
    load_dotenv()
    
    # Get Supabase credentials from environment
    supabase_url = os.environ.get('SUPABASE_URL')
    supabase_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')  # Using service role key to have full access
    
    if not supabase_url or not supabase_key:
        print("Error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables are not set")
        sys.exit(1)
    
    # Create Supabase client
    return create_client(supabase_url, supabase_key)

def try_get_schema(client, table_name):
    """Try to get schema for a table."""
    try:
        response = client.table(table_name).select("*").limit(1).execute()
        if response.data:
            columns = list(response.data[0].keys())
            return columns
        else:
            # Try to get column names even if no data exists
            print(f"No data found in {table_name}, getting columns...")
            return []
    except Exception as e:
        print(f"❌ Error getting schema for {table_name}: {e}")
        return None

def main():
    """List all tables in Supabase."""
    print("=============================================")
    print("       SUPABASE TABLE EXPLORER             ")
    print("=============================================")
    
    client = get_supabase_client()
    
    # Try to access standard tables
    standard_tables = [
        "users", "companies", "data_types", "data_sharing_policies", 
        "user_preferences", "user_profile_preferences", "token_packages"
    ]
    
    print("\nChecking standard tables:")
    print("-------------------------")
    
    for table in standard_tables:
        columns = try_get_schema(client, table)
        if columns is not None:
            print(f"✅ {table}: Accessible")
            if columns:
                print(f"   Columns: {', '.join(columns)}")
        else:
            print(f"❌ {table}: Not accessible")
    
    # Try to fetch data from each table
    print("\nFetching data counts:")
    print("--------------------")
    
    for table in standard_tables:
        try:
            response = client.table(table).select("count").execute()
            if response.data:
                count = response.data[0]["count"] if "count" in response.data[0] else len(response.data)
                print(f"Table {table}: {count} rows")
            else:
                print(f"Table {table}: No data")
        except Exception as e:
            print(f"Table {table}: Error - {str(e)}")
    
    print("\n=============================================")
    print("             EXPLORATION COMPLETE           ")
    print("=============================================")

if __name__ == "__main__":
    main() 