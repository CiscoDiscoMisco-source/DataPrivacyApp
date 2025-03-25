import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db

def init_db():
    """Initialize the database."""
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()
        print("Database tables created successfully!")

if __name__ == '__main__':
    init_db() 