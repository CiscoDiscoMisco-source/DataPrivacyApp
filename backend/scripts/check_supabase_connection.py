#!/usr/bin/env python
"""
Script to check Supabase PostgreSQL connection.
Run this script to validate your database connection before deploying.
"""
import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

# Add the parent directory to sys.path to import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def check_connection():
    """Check the database connection to Supabase."""
    load_dotenv()
    
    # Get database URL from environment
    database_url = os.environ.get('DATABASE_URL')
    
    if not database_url:
        print("Error: DATABASE_URL environment variable is not set.")
        return False
    
    try:
        # Create engine
        engine = create_engine(database_url)
        
        # Try to connect and execute a simple query
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            row = result.fetchone()
            if row and row[0] == 1:
                print("✅ Successfully connected to Supabase PostgreSQL database!")
                
                # Get database version
                result = connection.execute(text("SELECT version()"))
                version = result.fetchone()[0]
                print(f"Database version: {version}")
                
                # Get connection info
                result = connection.execute(text(
                    "SELECT current_database(), current_user, inet_server_addr(), inet_server_port()"
                ))
                db_info = result.fetchone()
                print(f"Database: {db_info[0]}")
                print(f"User: {db_info[1]}")
                print(f"Server: {db_info[2]}:{db_info[3]}")
                
                return True
    except SQLAlchemyError as e:
        print(f"❌ Failed to connect to the database: {str(e)}")
        return False

if __name__ == "__main__":
    success = check_connection()
    sys.exit(0 if success else 1) 