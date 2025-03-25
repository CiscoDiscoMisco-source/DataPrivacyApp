import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.utils.supabase_client import test_connection

def init_db():
    """Initialize the database."""
    app = create_app()
    
    # Test Supabase connection first
    with app.app_context():
        connection_status = test_connection()
        if not connection_status['postgres']['connected']:
            print("ERROR: Cannot connect to Supabase PostgreSQL database!")
            print(f"Details: {connection_status['postgres']['message']}")
            print("Please check your Supabase credentials and try again.")
            sys.exit(1)
        
        print("Supabase connection verified successfully!")
        db.drop_all()
        db.create_all()
        print("Database tables created successfully!")

if __name__ == '__main__':
    init_db() 