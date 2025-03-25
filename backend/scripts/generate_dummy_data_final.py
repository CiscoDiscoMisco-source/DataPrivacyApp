#!/usr/bin/env python
"""
Script to generate dummy data for existing Supabase tables.
"""
import os
import sys
import random
from typing import Dict, List, Any
from dotenv import load_dotenv
from supabase import create_client, Client
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

def check_table_exists(client: Client, table_name: str) -> bool:
    """Check if a table exists."""
    try:
        response = client.table(table_name).select("*").limit(1).execute()
        return True
    except Exception as e:
        return False

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

def generate_user_preference_data(user_id: int, data_type_id: int, company_id: int) -> Dict[str, Any]:
    """Generate dummy user preference data."""
    return {
        "user_id": user_id,
        "data_type_id": data_type_id,
        "company_id": company_id,
        "allowed": random.choice([True, False])
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
    """Generate dummy data for existing tables."""
    print("=============================================")
    print("     SUPABASE DUMMY DATA GENERATOR (FINAL)  ")
    print("=============================================")
    
    client = get_supabase_client()
    
    # Check which tables exist
    tables = {
        "users": check_table_exists(client, "users"),
        "companies": check_table_exists(client, "companies"),
        "data_types": check_table_exists(client, "data_types"),
        "user_preferences": check_table_exists(client, "user_preferences")
    }
    
    print("\nExisting tables:")
    for table, exists in tables.items():
        print(f"{table}: {'✅ Exists' if exists else '❌ Not Found'}")
    
    # Generate dummy data for each existing table
    num_records = 10  # Number of records to generate per table
    
    # Generate users
    if tables["users"]:
        user_data = []
        for i in range(num_records):
            user_data.append(generate_user_data())
        
        user_ids = []
        inserted_users = insert_dummy_data(client, "users", user_data)
        if inserted_users:
            user_ids = [user["id"] for user in inserted_users]
    
    # Generate companies
    if tables["companies"]:
        company_data = []
        for i in range(num_records):
            company_data.append(generate_company_data())
        
        company_ids = []
        inserted_companies = insert_dummy_data(client, "companies", company_data)
        if inserted_companies:
            company_ids = [company["id"] for company in inserted_companies]
    
    # Generate data types
    if tables["data_types"]:
        data_type_data = []
        for i in range(num_records):
            data_type_data.append(generate_data_type_data())
        
        data_type_ids = []
        inserted_data_types = insert_dummy_data(client, "data_types", data_type_data)
        if inserted_data_types:
            data_type_ids = [data_type["id"] for data_type in inserted_data_types]
    
    # Generate user preferences (requires users, companies, and data types)
    if tables["user_preferences"] and user_ids and company_ids and data_type_ids:
        preference_data = []
        for i in range(num_records):
            preference_data.append(
                generate_user_preference_data(
                    random.choice(user_ids),
                    random.choice(data_type_ids),
                    random.choice(company_ids)
                )
            )
        insert_dummy_data(client, "user_preferences", preference_data)
    
    print("\n=============================================")
    print("          DUMMY DATA GENERATION COMPLETE      ")
    print("=============================================")

if __name__ == "__main__":
    main() 