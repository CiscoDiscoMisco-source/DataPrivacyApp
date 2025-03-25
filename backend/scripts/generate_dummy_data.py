#!/usr/bin/env python
"""
Script to generate dummy data for all Supabase tables.
"""
import os
import sys
import random
from datetime import datetime, timedelta
from typing import Dict, List, Any
from dotenv import load_dotenv
from supabase import create_client, Client
import json
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

def list_tables(client: Client) -> List[str]:
    """List all tables in the Supabase database."""
    try:
        # Using raw SQL query to get table names since the previous approach failed
        query = "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public'"
        response = client.rpc('pg_tables', {}).execute()
        
        if response.data:
            tables = [table["tablename"] for table in response.data if table.get("schemaname") == "public"]
            return tables
        
        # If the above doesn't work, try the direct table approach
        tables = ["users", "companies", "data_types", "data_sharing_policies", 
                 "user_preferences", "user_profile_preferences", "token_packages"]
        
        print("Using predefined table list as fallback")
        return tables
    except Exception as e:
        print(f"Error listing tables: {str(e)}")
        # Return a predefined list of tables as fallback
        tables = ["users", "companies", "data_types", "data_sharing_policies", 
                 "user_preferences", "user_profile_preferences", "token_packages"]
        
        print("Using predefined table list due to error")
        return tables

def generate_user_data() -> Dict[str, Any]:
    """Generate dummy user data."""
    return {
        "email": fake.email(),
        "first_name": fake.first_name(),
        "last_name": fake.last_name(),
        "password_hash": "hashed_password_for_testing",  # In real app this would be properly hashed
        "is_admin": random.choice([True, False]),
        "tokens": random.randint(0, 1000),
    }

def generate_company_data() -> Dict[str, Any]:
    """Generate dummy company data."""
    return {
        "name": fake.company(),
        "logo": f"https://ui-avatars.com/api/?name={fake.company_suffix()}&background=random",
        "industry": random.choice(["Technology", "Healthcare", "Finance", "Retail", "Manufacturing"]),
        "website": fake.url(),
        "description": fake.catch_phrase(),
        "size_range": random.choice(["1-10", "11-50", "51-200", "201-500", "501+"]),
        "city": fake.city(),
        "country": fake.country()
    }

def generate_data_type_data() -> Dict[str, Any]:
    """Generate dummy data type data."""
    categories = ["Personal", "Financial", "Health", "Location", "Communication", "Biometric", "Behavioral"]
    sensitivity_levels = ["Low", "Medium", "High", "Very High"]
    category = random.choice(categories)
    
    data_types = {
        "Personal": ["Full Name", "Email Address", "Phone Number", "Home Address", "Date of Birth"],
        "Financial": ["Credit Card Number", "Bank Account", "Income", "Purchase History", "Credit Score"],
        "Health": ["Medical Records", "Fitness Data", "Allergies", "Medication History", "Genetic Information"],
        "Location": ["GPS Data", "IP Address", "Check-ins", "Travel History", "Home Location"],
        "Communication": ["Chat Logs", "Email Content", "Call History", "Contacts", "Social Media Activity"],
        "Biometric": ["Fingerprint", "Facial Recognition", "Voice Pattern", "DNA", "Iris Scan"],
        "Behavioral": ["Browsing History", "App Usage", "Click Patterns", "Typing Speed", "Search History"]
    }
    
    return {
        "name": random.choice(data_types[category]),
        "description": fake.text(max_nb_chars=100),
        "category": category,
        "sensitivity_level": random.choice(sensitivity_levels)
    }

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

def generate_user_preference_data(user_id: int, data_type_id: int, company_id: int) -> Dict[str, Any]:
    """Generate dummy user preference data."""
    return {
        "user_id": user_id,
        "data_type_id": data_type_id,
        "company_id": company_id,
        "allowed": random.choice([True, False])
    }

def generate_user_profile_preference_data(user_id: int) -> Dict[str, Any]:
    """Generate dummy user profile preference data."""
    notification_types = ["policy_update", "data_breach", "access_request", "marketing"]
    selected_notification_types = random.sample(notification_types, random.randint(1, len(notification_types)))
    
    return {
        "user_id": user_id,
        "email_notifications": random.choice([True, False]),
        "notification_frequency": random.choice(["daily", "weekly", "monthly", "immediate"]),
        "notification_types": json.dumps(selected_notification_types),
        "privacy_level": random.choice(["low", "medium", "high"]),
        "auto_delete_data": random.choice([True, False]),
        "data_retention_period": random.choice([30, 60, 90, 180, 365, None]),
        "theme": random.choice(["light", "dark", "system"]),
        "language": random.choice(["en", "es", "fr", "de", "zh"]),
        "timezone": random.choice(["UTC", "America/New_York", "Europe/London", "Asia/Tokyo"])
    }

def generate_token_package_data() -> Dict[str, Any]:
    """Generate dummy token package data."""
    token_amounts = [100, 500, 1000, 5000, 10000]
    token_amount = random.choice(token_amounts)
    
    packages = {
        100: {"name": "Starter", "price": 9.99, "description": "Basic token package for small businesses"},
        500: {"name": "Professional", "price": 29.99, "description": "Professional token package for growing businesses"},
        1000: {"name": "Business", "price": 49.99, "description": "Business token package for medium enterprises"},
        5000: {"name": "Enterprise", "price": 199.99, "description": "Enterprise token package for large organizations"},
        10000: {"name": "Ultimate", "price": 349.99, "description": "Ultimate token package for comprehensive data privacy"}
    }
    
    return {
        "name": packages[token_amount]["name"],
        "amount": token_amount,
        "price": packages[token_amount]["price"],
        "description": packages[token_amount]["description"]
    }

def insert_dummy_data(client: Client, table_name: str, data: List[Dict[str, Any]]):
    """Insert dummy data into a table."""
    try:
        response = client.table(table_name).insert(data).execute()
        print(f"✅ Inserted {len(data)} records into {table_name}")
        return response.data
    except Exception as e:
        print(f"❌ Error inserting data into {table_name}: {str(e)}")
        return []

def main():
    """Generate dummy data for all tables."""
    print("=============================================")
    print("       SUPABASE DUMMY DATA GENERATOR        ")
    print("=============================================")
    
    client = get_supabase_client()
    
    # List all tables
    tables = list_tables(client)
    print("\nTables in Supabase:")
    for i, table in enumerate(tables, 1):
        print(f"{i}. {table}")
        
    # Debug: Try to get schema information for user_profile_preferences
    try:
        print("\nGetting schema for users table...")
        response = client.table("users").select("*").limit(1).execute()
        if response.data:
            print(f"Users columns: {list(response.data[0].keys())}")
    except Exception as e:
        print(f"Error getting users schema: {str(e)}")
    
    # Debug: Try to get schema information for companies
    try:
        print("\nGetting schema for companies table...")
        response = client.table("companies").select("*").limit(1).execute()
        if response.data:
            print(f"Companies columns: {list(response.data[0].keys())}")
    except Exception as e:
        print(f"Error getting companies schema: {str(e)}")
    
    # Debug: Try to get schema for user_profile_preferences
    try:
        print("\nGetting schema for user_profile_preferences table...")
        response = client.table("user_profile_preferences").select("*").limit(1).execute()
        if response.data:
            print(f"User profile preferences columns: {list(response.data[0].keys())}")
    except Exception as e:
        print(f"Error getting user_profile_preferences schema: {str(e)}")
    
    # Debug: Try to get schema for token_packages
    try:
        print("\nGetting schema for token_packages table...")
        response = client.table("token_packages").select("*").limit(1).execute()
        if response.data:
            print(f"Token packages columns: {list(response.data[0].keys())}")
    except Exception as e:
        print(f"Error getting token_packages schema: {str(e)}")
    
    # Generate and insert dummy data for each table
    dummy_users = []
    dummy_companies = []
    dummy_data_types = []
    dummy_token_packages = []
    
    # Generate users first
    for i in range(10):
        dummy_users.append(generate_user_data())
    
    user_ids = []
    if "users" in tables:
        user_data = insert_dummy_data(client, "users", dummy_users)
        user_ids = [user["id"] for user in user_data]
    
    # Generate companies (now without user IDs)
    for i in range(10):
        company = generate_company_data()
        dummy_companies.append(company)
    
    company_ids = []
    if "companies" in tables:
        company_data = insert_dummy_data(client, "companies", dummy_companies)
        company_ids = [company["id"] for company in company_data]
    
    # Generate data types
    for i in range(10):
        dummy_data_types.append(generate_data_type_data())
    
    data_type_ids = []
    if "data_types" in tables:
        data_type_data = insert_dummy_data(client, "data_types", dummy_data_types)
        data_type_ids = [data_type["id"] for data_type in data_type_data]
    
    # Only try to generate data for tables that exist
    existing_tables = set(tables)
    
    # Generate data sharing policies if the table exists
    dummy_policies = []
    if company_ids and data_type_ids and "data_sharing_policies" in existing_tables:
        for i in range(10):
            dummy_policies.append(
                generate_data_sharing_policy_data(
                    random.choice(company_ids),
                    random.choice(data_type_ids)
                )
            )
        insert_dummy_data(client, "data_sharing_policies", dummy_policies)
    
    # Generate user preferences if the table exists
    dummy_preferences = []
    if user_ids and data_type_ids and company_ids and "user_preferences" in existing_tables:
        for i in range(10):
            dummy_preferences.append(
                generate_user_preference_data(
                    random.choice(user_ids),
                    random.choice(data_type_ids),
                    random.choice(company_ids)
                )
            )
        insert_dummy_data(client, "user_preferences", dummy_preferences)
    
    # Generate user profile preferences if the table exists
    dummy_profile_prefs = []
    if user_ids and "user_profile_preferences" in existing_tables:
        for i in range(10):
            dummy_profile_prefs.append(
                generate_user_profile_preference_data(random.choice(user_ids))
            )
        insert_dummy_data(client, "user_profile_preferences", dummy_profile_prefs)
    
    # Generate token packages if the table exists
    for i in range(5):  # Only need 5 token packages
        dummy_token_packages.append(generate_token_package_data())
    
    if "token_packages" in existing_tables:
        insert_dummy_data(client, "token_packages", dummy_token_packages)
    
    print("\n=============================================")
    print("          DUMMY DATA GENERATION COMPLETE      ")
    print("=============================================")

if __name__ == "__main__":
    main() 