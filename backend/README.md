# Data Privacy App - Backend

This is the backend for the Data Privacy App, built with Python, Flask, and PostgreSQL.

## Structure

```
backend/
├── app/
│   ├── api/           # API routes
│   │   ├── v1/        # API version 1
│   │   └── __init__.py
│   ├── models/        # Database models
│   ├── schemas/       # Validation schemas
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   └── __init__.py    # App factory
├── migrations/        # Database migrations
├── tests/             # Test directory
│   ├── unit/          # Unit tests
│   └── integration/   # Integration tests
├── app.py             # Application entry point
├── config.py          # Configuration
├── requirements.txt   # Production dependencies
└── requirements-dev.txt # Development dependencies
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
pip install -r requirements-dev.txt  # for development
```

4. Set up environment variables:
```
cp .env.template .env
# Then edit .env with your configuration
```

5. Run database migrations:
```
flask db upgrade
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
- `POSTGRES_URL`: PostgreSQL database connection string
- `SECRET_KEY`: Secret key for JWT tokens
- `JWT_SECRET_KEY`: Secret key for JWT
- `ELASTICSEARCH_URL`: Elasticsearch connection string

## API Endpoints

The API is versioned, with all endpoints prefixed with `/api/v1/`.

Main endpoints:
- `/api/auth/`: Authentication endpoints
- `/api/companies/`: Company data
- `/api/data-types/`: Data type definitions
- `/api/user-preferences/`: User preferences
- `/api/data-sharing-terms/`: Data sharing terms
- `/api/users/`: User management
- `/api/search/`: Search functionality 