"""
Supabase client utility for accessing Supabase services.
Provides a global client instance for database access, storage, and other Supabase services.
"""
from supabase import create_client, Client
import os
from flask import current_app
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

# Initialize Supabase client
def get_supabase_client():
    """
    Get the Supabase client instance, using Flask app config if available,
    otherwise using environment variables directly.
    """
    try:
        # Try to get config from Flask app context
        url = current_app.config.get('SUPABASE_URL')
        key = current_app.config.get('SUPABASE_KEY')
    except RuntimeError:
        # If not in app context, use environment variables directly
        url = os.environ.get('SUPABASE_URL')
        key = os.environ.get('SUPABASE_KEY')
    
    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY environment variables must be set")
    
    return create_client(url, key)

# Create a global client instance for direct imports
try:
    supabase: Client = get_supabase_client()
except (ValueError, RuntimeError):
    # Defer client creation until it's actually used within application context
    supabase = None

def test_connection():
    """
    Test the connection to Supabase services.
    Tests both the PostgreSQL database connection and the Supabase API.
    
    Returns:
        dict: Status of PostgreSQL and API connections
    """
    results = {
        "postgres": {"connected": False, "message": ""},
        "api": {"connected": False, "message": ""}
    }
    
    # Test PostgreSQL connection
    postgres_url = os.environ.get('POSTGRES_URL')
    if not postgres_url:
        results["postgres"]["message"] = "POSTGRES_URL environment variable is not set"
        return results
    
    try:
        # Create engine and test connection
        engine = create_engine(postgres_url)
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            row = result.fetchone()
            if row and row[0] == 1:
                results["postgres"]["connected"] = True
                results["postgres"]["message"] = "Successfully connected to PostgreSQL database"
                
                # Get database info
                result = connection.execute(text("SELECT current_database(), version()"))
                db_info = result.fetchone()
                results["postgres"]["database"] = db_info[0]
                results["postgres"]["version"] = db_info[1]
    except SQLAlchemyError as e:
        results["postgres"]["message"] = f"PostgreSQL connection error: {str(e)}"
    
    # Test Supabase API connection
    try:
        # Get or create client
        client = supabase or get_supabase_client()
        
        # Simple health check by retrieving Supabase settings
        response = client.table("_dummy_query_for_check").select("*").limit(1).execute()
        # The query might fail if table doesn't exist, but we'll still get a response object
        results["api"]["connected"] = True
        results["api"]["message"] = "Successfully connected to Supabase API"
    except Exception as e:
        results["api"]["message"] = f"Supabase API connection error: {str(e)}"
    
    return results

if __name__ == "__main__":
    # When run directly, print connection test results
    connection_status = test_connection()
    print("\nSupabase Connection Test Results:")
    print("--------------------------------")
    
    # PostgreSQL status
    pg_status = connection_status["postgres"]
    print(f"PostgreSQL: {'✅ Connected' if pg_status['connected'] else '❌ Failed'}")
    print(f"Message: {pg_status['message']}")
    if pg_status['connected'] and 'database' in pg_status:
        print(f"Database: {pg_status['database']}")
        print(f"Version: {pg_status['version']}")
    
    # Supabase API status
    api_status = connection_status["api"]
    print(f"\nSupabase API: {'✅ Connected' if api_status['connected'] else '❌ Failed'}")
    print(f"Message: {api_status['message']}") 