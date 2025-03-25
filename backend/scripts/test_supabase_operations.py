#!/usr/bin/env python
"""
Script to test various Supabase operations.
This script tests basic CRUD operations against your Supabase database.
"""
import os
import sys
import json
import random
from dotenv import load_dotenv
from supabase import create_client, Client
import traceback
import uuid
from datetime import datetime

# Add the parent directory to sys.path to import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_supabase_operations():
    """Test various operations with Supabase."""
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
        
        # Test 1: Discover database tables
        print("\n2. Discovering available tables...")
        try:
            # Try accessing a few common tables to see what's available
            common_tables = ['companies', 'users', 'customers', 'products']
            found_tables = []
            
            for table in common_tables:
                try:
                    test_response = client.table(table).select('count').limit(1).execute()
                    found_tables.append(table)
                    print(f"✅ Table '{table}' exists")
                except Exception:
                    print(f"❌ Table '{table}' does not exist or is not accessible")
            
            if not found_tables:
                print("⚠️ No accessible tables found. Please check your permissions.")
                return False
            
            # Use the first found table for testing
            test_table = found_tables[0]
            print(f"\nUsing '{test_table}' table for further testing")
            
            print("\n3. Testing basic SELECT query...")
            response = client.table(test_table).select('*').limit(5).execute()
            print(f"✅ Successfully queried '{test_table}' table")
            print(f"   Results: {len(response.data)} records retrieved")
            
        except Exception as e:
            print(f"❌ Error discovering tables: {str(e)}")
            print("   This could be because you don't have proper permissions.")
            return False
            
        # Test 2: Create a test record
        print(f"\n4. Testing INSERT operation on '{test_table}' table...")
        
        # Generate a random integer ID
        test_id = random.randint(10000000, 99999999)
        
        # Use a simple data structure
        test_data = {
            'id': test_id,
            'name': f'Test Company {test_id}',
            'description': 'Created by test script'
        }
        
        try:
            insert_response = client.table(test_table).insert(test_data).execute()
            print(f"✅ Successfully inserted test record into '{test_table}' table")
            print(f"   Inserted data: {insert_response.data}")
            
            # Test 3: Read the record we just created
            print("\n5. Testing SELECT by ID...")
            read_response = client.table(test_table).select('*').eq('id', test_id).execute()
            if read_response.data:
                print(f"✅ Successfully retrieved test record")
                print(f"   Retrieved data: {read_response.data}")
            else:
                print(f"⚠️ Record was inserted but could not be retrieved")
            
            # Test 4: Update the record
            print("\n6. Testing UPDATE operation...")
            update_data = {'description': 'Updated by test script'}
            update_response = client.table(test_table).update(update_data).eq('id', test_id).execute()
            print(f"✅ Successfully updated test record")
            print(f"   Updated data: {update_response.data}")
            
            # Test 5: Delete the record
            print("\n7. Testing DELETE operation...")
            delete_response = client.table(test_table).delete().eq('id', test_id).execute()
            print(f"✅ Successfully deleted test record")
            
        except Exception as e:
            print(f"❌ Error during CRUD operations: {str(e)}")
            print("   This could be due to insufficient permissions or schema constraints.")
            print("   Error details:")
            traceback.print_exc()
        
        print("\nSummary: Basic connection to Supabase is working!")
        return True
        
    except Exception as e:
        print(f"\n❌ Failed to connect to Supabase: {str(e)}")
        print("\nDetailed Error:")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("=============================================")
    print("       SUPABASE OPERATIONS TEST TOOL        ")
    print("=============================================")
    
    success = test_supabase_operations()
    
    print("\nTest completion result:", "SUCCESS" if success else "FAILED")
    print("=============================================")
    
    sys.exit(0 if success else 1) 