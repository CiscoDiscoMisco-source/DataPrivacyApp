# Data Privacy App - Backend

This is the backend for the Data Privacy App, built with Python, Flask, and Supabase.

## Structure

```
backend/
├── app/
│   ├── api/           # API routes
│   │   ├── v1/        # API version 1
│   │   └── __init__.py
│   ├── models/        # Database models
│   ├── schemas/       # Pydantic validation schemas
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   └── __init__.py    # App factory
├── tests/             # Test directory
│   ├── unit/          # Unit tests
│   └── integration/   # Integration tests
├── app.py             # Application entry point
├── config.py          # Configuration
└── requirements.txt   # Dependencies
```

## Setup

1. Create a virtual environment:
```
python -m venv venv
```

2. Activate the virtual environment:
```
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Set up environment variables:
```
cp .env.template .env
# Then edit .env with your configuration
```

## Running the App

### Development
```
flask run
```

### Production
```
gunicorn app:app
```

## Testing
```
pytest tests/
```

## Environment Variables

The backend uses the following environment variables:

- `FLASK_ENV`: The environment (development, testing, production)
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase project anonymous key
- `SECRET_KEY`: Secret key for JWT tokens
- `JWT_SECRET_KEY`: Secret key for JWT
- `ELASTICSEARCH_URL`: Elasticsearch connection string

## API Endpoints

The API is versioned, with all endpoints prefixed with `/api/v1/`.

Main endpoints:
- `/api/v1/auth/`: Authentication endpoints
- `/api/v1/companies/`: Company data
- `/api/v1/data-types/`: Data type definitions
- `/api/v1/user-preferences/`: User preferences
- `/api/v1/data-sharing-terms/`: Data sharing terms
- `/api/v1/users/`: User management
- `/api/v1/search/`: Search functionality

## Dependencies

Key dependencies include:
- Flask: Web framework
- Flask-Cors: CORS support
- Flask-Bcrypt: Password hashing
- Flask-JWT-Extended: JWT authentication
- Supabase: Database and authentication
- Elasticsearch: Search functionality
- Pydantic: Data validation
- email-validator: Email validation 