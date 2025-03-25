#!/usr/bin/env python
"""
Script to generate dummy data for data_sharing_policies table.
"""
import os
import sys
import random
from typing import Dict, List, Any
from dotenv import load_dotenv
from supabase import create_client
import faker

# Add the parent directory to sys.path to import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

fake = faker.Faker()

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

def generate_data_sharing_policy_data(company_id: int, data_type_id: int) -> Dict[str, Any]:
    """Generate dummy data sharing policy data."""
    purposes = [
        "Marketing", "Analytics", "Service Improvement", 
        "Research", "Legal Compliance", "Customer Support",
        "Fraud Prevention", "Personalization", "Account Management"
    ]
    
    return {
        "company_id": company_id,
        "data_type_id": data_type_id,
        "purpose": random.choice(purposes),
        "description": fake.paragraph()
    }

def insert_dummy_data(client, table_name: str, data: List[Dict[str, Any]]):
    """Insert dummy data into a table."""
    try:
        response = client.table(table_name).insert(data).execute()
        print(f"✅ Inserted {len(data)} records into {table_name}")
        return response.data
    except Exception as e:
        print(f"❌ Error inserting data into {table_name}: {str(e)}")
        return []

def main():
    """Generate dummy data for data sharing policies."""
    print("=============================================")
    print("    DATA SHARING POLICIES GENERATOR         ")
    print("=============================================")
    
    client = get_supabase_client()
    
    # Debug: Get schema information for data_sharing_policies
    try:
        print("\nGetting schema for data_sharing_policies table...")
        response = client.table("data_sharing_policies").select("*").limit(1).execute()
        if response.data:
            print(f"Data sharing policies columns: {list(response.data[0].keys())}")
        else:
            print("No data found in data_sharing_policies table.")
    except Exception as e:
        print(f"Error getting data_sharing_policies schema: {str(e)}")

    # Get company IDs
    try:
        print("\nFetching company IDs...")
        response = client.table("companies").select("id").execute()
        company_ids = [company["id"] for company in response.data]
        print(f"Found {len(company_ids)} companies")
    except Exception as e:
        print(f"Error fetching company IDs: {str(e)}")
        company_ids = []
    
    # Get data type IDs
    try:
        print("\nFetching data type IDs...")
        response = client.table("data_types").select("id").execute()
        data_type_ids = [data_type["id"] for data_type in response.data]
        print(f"Found {len(data_type_ids)} data types")
    except Exception as e:
        print(f"Error fetching data type IDs: {str(e)}")
        data_type_ids = []
    
    # Generate data sharing policies
    if not company_ids or not data_type_ids:
        print("Cannot generate data sharing policies: missing company IDs or data type IDs")
        return
    
    dummy_policies = []
    for i in range(10):  # Generate 10 policies
        company_id = random.choice(company_ids)
        data_type_id = random.choice(data_type_ids)
        policy = generate_data_sharing_policy_data(company_id, data_type_id)
        dummy_policies.append(policy)
    
    # Insert data
    insert_dummy_data(client, "data_sharing_policies", dummy_policies)
    
    print("\n=============================================")
    print("          DATA GENERATION COMPLETE          ")
    print("=============================================")

if __name__ == "__main__":
    main() 