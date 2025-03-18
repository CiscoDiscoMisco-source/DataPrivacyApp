# Data Privacy Management App

A web application for users to manage their data privacy preferences across companies, visualize data-sharing relationships, and clone preferences efficiently.

## Features

- Display a map/list of companies with data-sharing details
- Manage data preferences locally (per company) and globally (across all companies)
- Clone preferences from one company to another
- Search functionality for companies and preferences

## Technical Stack

- Backend: Python (Flask)
- Frontend: React.js
- Database: PostgreSQL
- Search: Elasticsearch (elastic.co hosting)
- Testing: pytest

## Project Structure

```
data-privacy-app/
├── backend/           # Flask backend application
├── frontend/         # React frontend application
├── tests/           # Test files
├── docs/            # Documentation
└── README.md        # This file
```

## Setup Instructions

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL
- Elasticsearch (elastic.co hosting)

### Backend Setup

1. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Initialize database:
   ```bash
   flask db upgrade
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start development server:
   ```bash
   npm start
   ```

## Development

- Backend runs on http://localhost:5000
- Frontend runs on http://localhost:3000
- API documentation available at http://localhost:5000/api/docs

## Testing

Run tests with:
```bash
pytest
```

## License

MIT License 