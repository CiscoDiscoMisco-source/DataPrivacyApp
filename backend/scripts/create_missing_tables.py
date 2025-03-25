#!/usr/bin/env python
"""
Script to create missing tables in Supabase.
"""
import os
import sys
from typing import Dict, List
from dotenv import load_dotenv
from supabase import create_client, Client

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

def execute_sql(client: Client, sql: str):
    """Execute a SQL statement."""
    try:
        # Execute the SQL using the rpc function to run custom SQL
        response = client.rpc('execute_sql', { 'query': sql }).execute()
        print(f"✅ SQL executed successfully")
        return True
    except Exception as e:
        print(f"❌ Error executing SQL: {str(e)}")
        return False

def create_data_sharing_policies_table(client: Client):
    """Create data_sharing_policies table."""
    print("\nCreating data_sharing_policies table...")
    
    sql = """
    CREATE TABLE IF NOT EXISTS public.data_sharing_policies (
        id SERIAL PRIMARY KEY,
        company_id INTEGER NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
        data_type_id INTEGER NOT NULL REFERENCES public.data_types(id) ON DELETE CASCADE,
        purpose VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    
    return execute_sql(client, sql)

def create_user_profile_preferences_table(client: Client):
    """Create user_profile_preferences table."""
    print("\nCreating user_profile_preferences table...")
    
    sql = """
    CREATE TABLE IF NOT EXISTS public.user_profile_preferences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
        email_notifications BOOLEAN DEFAULT TRUE,
        notification_frequency VARCHAR(50) DEFAULT 'daily',
        notification_types JSONB DEFAULT '["policy_update", "data_breach"]',
        privacy_level VARCHAR(50) DEFAULT 'medium',
        auto_delete_data BOOLEAN DEFAULT FALSE,
        data_retention_period INTEGER,
        theme VARCHAR(50) DEFAULT 'light',
        language VARCHAR(10) DEFAULT 'en',
        timezone VARCHAR(50) DEFAULT 'UTC',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    
    return execute_sql(client, sql)

def create_token_packages_table(client: Client):
    """Create token_packages table."""
    print("\nCreating token_packages table...")
    
    sql = """
    CREATE TABLE IF NOT EXISTS public.token_packages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        amount INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    
    return execute_sql(client, sql)

def main():
    """Create missing tables in Supabase."""
    print("=============================================")
    print("       SUPABASE MISSING TABLES CREATOR      ")
    print("=============================================")
    
    client = get_supabase_client()
    
    # Create missing tables
    created_data_sharing = create_data_sharing_policies_table(client)
    created_user_profile = create_user_profile_preferences_table(client)
    created_token_packages = create_token_packages_table(client)
    
    print("\n=============================================")
    print("          TABLE CREATION RESULTS            ")
    print("=============================================")
    print(f"data_sharing_policies: {'Created ✅' if created_data_sharing else 'Failed ❌'}")
    print(f"user_profile_preferences: {'Created ✅' if created_user_profile else 'Failed ❌'}")
    print(f"token_packages: {'Created ✅' if created_token_packages else 'Failed ❌'}")
    print("=============================================")

if __name__ == "__main__":
    main() 