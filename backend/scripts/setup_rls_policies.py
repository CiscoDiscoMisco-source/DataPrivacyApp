#!/usr/bin/env python
"""
Script to set up Row Level Security (RLS) policies for Supabase tables.
This script creates and configures RLS policies for proper data isolation.
"""
import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client
import traceback

def setup_rls_policies():
    """Set up RLS policies for Supabase tables."""
    print("Loading environment variables...")
    load_dotenv()
    
    # Get Supabase credentials with service role for admin access
    supabase_url = os.environ.get('SUPABASE_URL')
    service_role_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not service_role_key:
        print("❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set")
        return False
    
    try:
        print("\nConnecting with service role to create RLS policies...")
        # Create Supabase client with service role
        admin_client: Client = create_client(supabase_url, service_role_key)
        
        # List of tables that need RLS policies
        tables = ['companies', 'users', 'user_preferences', 'data_sharing_policies']
        
        for table in tables:
            print(f"\nSetting up RLS for table '{table}'...")
            
            # 1. Enable RLS on the table
            print(f"  1. Enabling RLS on '{table}'...")
            try:
                enable_rls_sql = f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;"
                admin_client.rpc('exec_sql', {'command': enable_rls_sql}).execute()
                print(f"  ✅ RLS enabled on table '{table}'")
            except Exception as e:
                print(f"  ⚠️ Error enabling RLS: {str(e)}")
                print("     This may be OK if RLS is already enabled")
            
            # 2. Create RLS policies based on table type
            print(f"  2. Creating RLS policies for '{table}'...")
            
            try:
                # Define policies based on table type
                if table == 'companies':
                    # Companies table - restrict to owner
                    create_policies(admin_client, table, 'user_id')
                
                elif table == 'users':
                    # Users table - users can only see/edit their own data
                    create_policies(admin_client, table, 'id', auth_column='auth.uid()')
                
                elif table == 'user_preferences':
                    # User preferences - users can only see/edit their own preferences
                    create_policies(admin_client, table, 'user_id')
                
                elif table == 'data_sharing_policies':
                    # Data sharing policies - allow all to read, but restrict write to company owners
                    create_read_policy(admin_client, table)
                    create_write_policies(admin_client, table, 'company_id', complex_check=True)
                
                print(f"  ✅ RLS policies created for '{table}'")
            except Exception as e:
                print(f"  ❌ Error creating policies: {str(e)}")
                traceback.print_exc()
            
            # 3. Verify the user_id column exists (for tables that need it)
            if table in ['companies', 'user_preferences']:
                print(f"  3. Verifying user_id column in '{table}'...")
                try:
                    # Check if user_id column exists
                    check_sql = f"""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = '{table}' AND column_name = 'user_id'
                    """
                    response = admin_client.rpc('exec_sql', {'command': check_sql}).execute()
                    
                    if not response.data or len(response.data) == 0:
                        # Add user_id column
                        add_column_sql = f"""
                        ALTER TABLE "{table}" 
                        ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
                        """
                        admin_client.rpc('exec_sql', {'command': add_column_sql}).execute()
                        print(f"  ✅ Added user_id column to '{table}'")
                    else:
                        print(f"  ✅ user_id column already exists in '{table}'")
                except Exception as e:
                    print(f"  ❌ Error checking/adding user_id column: {str(e)}")
        
        print("\n✅ RLS policy setup complete!")
        return True
        
    except Exception as e:
        print(f"\n❌ Failed to connect to Supabase with service role: {str(e)}")
        print("\nDetailed Error:")
        traceback.print_exc()
        return False

def create_policies(client: Client, table: str, id_column: str, auth_column: str = 'auth.uid()'):
    """Create all standard policies (select, insert, update, delete) for a table."""
    create_read_policy(client, table, id_column, auth_column)
    create_write_policies(client, table, id_column, auth_column)

def create_read_policy(client: Client, table: str, id_column: str = None, auth_column: str = 'auth.uid()'):
    """Create a read (SELECT) policy for the table."""
    # For tables with user ownership
    if id_column:
        select_policy = f"""
        CREATE POLICY "{table}_select_policy" ON "{table}" 
        FOR SELECT USING ({id_column} = {auth_column});
        """
    else:
        # For public read tables (like data_sharing_policies)
        select_policy = f"""
        CREATE POLICY "{table}_select_policy" ON "{table}" 
        FOR SELECT USING (true);
        """
    
    try:
        # Drop existing policy if it exists
        drop_policy = f"""
        DROP POLICY IF EXISTS "{table}_select_policy" ON "{table}";
        """
        client.rpc('exec_sql', {'command': drop_policy}).execute()
        
        # Create new policy
        client.rpc('exec_sql', {'command': select_policy}).execute()
        print(f"    ✅ SELECT policy created for '{table}'")
    except Exception as e:
        print(f"    ❌ Error creating SELECT policy: {str(e)}")

def create_write_policies(client: Client, table: str, id_column: str, auth_column: str = 'auth.uid()', complex_check: bool = False):
    """Create write (INSERT, UPDATE, DELETE) policies for the table."""
    
    # For tables with complex relationships (like data_sharing_policies)
    condition = f"{id_column} = {auth_column}"
    if complex_check and table == 'data_sharing_policies':
        condition = f"""
        EXISTS (
            SELECT 1 FROM companies c 
            WHERE c.id = {table}.company_id AND c.user_id = {auth_column}
        )
        """
    
    # INSERT policy
    insert_policy = f"""
    CREATE POLICY "{table}_insert_policy" ON "{table}" 
    FOR INSERT WITH CHECK ({condition});
    """
    
    # UPDATE policy
    update_policy = f"""
    CREATE POLICY "{table}_update_policy" ON "{table}" 
    FOR UPDATE USING ({condition});
    """
    
    # DELETE policy
    delete_policy = f"""
    CREATE POLICY "{table}_delete_policy" ON "{table}" 
    FOR DELETE USING ({condition});
    """
    
    try:
        # Drop existing policies if they exist
        for action in ['insert', 'update', 'delete']:
            drop_policy = f"""
            DROP POLICY IF EXISTS "{table}_{action}_policy" ON "{table}";
            """
            client.rpc('exec_sql', {'command': drop_policy}).execute()
        
        # Create new policies
        client.rpc('exec_sql', {'command': insert_policy}).execute()
        print(f"    ✅ INSERT policy created for '{table}'")
        
        client.rpc('exec_sql', {'command': update_policy}).execute()
        print(f"    ✅ UPDATE policy created for '{table}'")
        
        client.rpc('exec_sql', {'command': delete_policy}).execute()
        print(f"    ✅ DELETE policy created for '{table}'")
    except Exception as e:
        print(f"    ❌ Error creating write policies: {str(e)}")
        traceback.print_exc()

if __name__ == "__main__":
    print("=============================================")
    print("     SUPABASE RLS POLICY SETUP TOOL         ")
    print("=============================================")
    
    success = setup_rls_policies()
    
    print("\nSetup result:", "SUCCESS" if success else "FAILED")
    print("=============================================")
    
    sys.exit(0 if success else 1) 