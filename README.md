# Data Privacy App

A full-stack application for managing data privacy preferences and company data sharing terms.

## Project Structure

This project follows a clean separation of frontend and backend, with proper organization for both parts:

```
project/
├── frontend/           # React frontend
│   ├── public/         # Static assets
│   ├── src/            # Source code
│   │   ├── components/ # Reusable components
│   │   ├── contexts/   # React contexts
│   │   ├── hooks/      # Custom hooks
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   └── utils/      # Utilities
│   └── package.json    # Frontend dependencies
├── backend/            # Python/Flask backend
│   ├── app/            # Application code
│   │   ├── api/        # API routes (versioned)
│   │   ├── models/     # Database models
│   │   ├── schemas/    # Validation schemas
│   │   ├── services/   # Business logic
│   │   └── utils/      # Utilities
│   ├── tests/          # Tests
│   └── requirements.txt # Backend dependencies
└── terraform/          # Infrastructure as Code
    ├── modules/        # Terraform modules
    └── environments/   # Environment configurations
```

## Tech Stack

- **Frontend**: React, Bootstrap
- **Backend**: Python, Flask, SQLAlchemy
- **Database**: PostgreSQL
- **Search**: Elasticsearch
- **Infrastructure**: AWS (Elastic Beanstalk, S3, CloudFront, RDS, API Gateway, VPC)
- **CI/CD**: GitHub Actions

## Environment Setup

The application supports three environments:
- Development
- Testing 
- Production

Each environment has its own configuration, database, and infrastructure.

## Getting Started

### Prerequisites
- Node.js 14+
- Python 3.8+
- PostgreSQL
- Elasticsearch
- AWS CLI (for deployment)
- Terraform (for infrastructure)

### Local Development

1. Clone the repository
2. Set up the backend:
   ```
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   pip install -r requirements-dev.txt
   cp .env.template .env  # Edit with your local config
   flask db upgrade
   flask run
   ```

3. Set up the frontend:
   ```
   cd frontend
   npm install
   npm start
   ```

4. Visit http://localhost:3000 in your browser

## Testing

- Backend: `cd backend && pytest`
- Frontend: `cd frontend && npm test`

## Deployment

The application is deployed to AWS using Terraform and GitHub Actions:

- Backend: AWS Elastic Beanstalk
- Frontend: S3 + CloudFront
- Database: RDS PostgreSQL
- API: API Gateway
- Search: Elasticsearch

See deployment documentation in `./terraform` for more details. 