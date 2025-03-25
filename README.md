# Data Privacy Management App

A web application for users to manage their data privacy preferences across companies, visualize data-sharing relationships, and clone preferences efficiently.

## Features

- Display a map/list of companies with data-sharing details
- Manage data preferences locally (per company) and globally (across all companies)
- Clone preferences from one company to another
- Search functionality for companies and preferences

## Technical Stack

- Backend: Python (Flask)
- Frontend: Next.js
- Database: PostgreSQL
- Search: Elasticsearch (elastic.co hosting)
- Infrastructure: AWS (Terraform-managed)
- Testing: pytest

## Project Structure

```
data-privacy-app/
├── backend/          # Flask backend application
│   ├── app/          # Application code
│   ├── app.py        # Entry point
│   └── requirements.txt
├── src/              # Next.js frontend application
├── terraform/        # Infrastructure as Code
│   ├── modules/      # Terraform modules
│   └── environments/ # Environment configurations
├── tests/            # Test files
└── README.md         # This file
```

## Setup Instructions

### Prerequisites

- Python 3.9+
- Node.js 18+
- AWS CLI configured with appropriate permissions
- Terraform CLI (for infrastructure deployment)

### Local Development

#### Backend Setup

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
   cp .env.template .env
   # Edit .env with your configuration
   ```

4. Start the Flask development server:
   ```bash
   flask run
   ```

#### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.template .env
   # Edit .env with your configuration
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Infrastructure Deployment

The application is deployed on AWS using Terraform for infrastructure management. See the [Terraform README](terraform/README.md) for detailed deployment instructions.

### Quick Deployment Steps

1. Configure AWS credentials
2. Deploy infrastructure:
   ```bash
   cd terraform
   ./deploy.sh -e dev  # or prod for production
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

## Environment Separation

The application supports separate environments:

- **Development (dev)**: For ongoing development work
- **Test**: For testing and QA
- **Production (prod)**: For live application

Each environment has its own database, Elasticsearch index, and infrastructure resources.

## License

MIT License 