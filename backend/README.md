# Data Privacy App Backend

This is the Python backend for the Data Privacy Application. It provides a REST API for managing user privacy preferences, companies, and data sharing terms.

## Project Structure

```
backend/
├── app/                    # Main application package
│   ├── api/                # API routes and handlers
│   ├── models/             # Database models
│   ├── services/           # Service classes
│   └── utils/              # Utility functions
├── migrations/             # Database migrations (Flask-Migrate)
├── .env.example            # Example environment variables
├── requirements.txt        # Python dependencies
└── run.py                  # Application entry point
```

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Copy `.env.example` to `.env` and set the environment variables:
   ```
   cp .env.example .env
   ```

4. Initialize the database:
   ```
   flask db init
   flask db migrate
   flask db upgrade
   ```

## Running the Application

Development mode:
```
python run.py
```

Or:
```
export FLASK_APP=run.py
export FLASK_ENV=development
flask run
```

## API Endpoints

- **Auth API**
  - `POST /api/register` - Register a new user
  - `POST /api/login` - Login a user

- **Companies API**
  - `GET /api/user/companies` - Get all companies for the current user
  - `POST /api/companies` - Create a new company
  - `GET /api/companies/{id}` - Get company details
  - `POST /api/companies/{id}/terms` - Add terms for a company

- **Preferences API**
  - `GET /api/preferences` - Get user preferences
  - `POST /api/preferences` - Create a preference
  - `PUT /api/preferences/{id}` - Update a preference
  - `POST /api/preferences/clone` - Clone preferences between companies

- **Search API**
  - `GET /api/search` - Search for companies 