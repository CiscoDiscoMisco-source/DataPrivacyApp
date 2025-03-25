# Data Privacy App

A full-stack application for managing data privacy preferences and company data sharing terms.

## Project Structure

This project follows a clean separation of frontend and backend, with proper organization for both parts:

```
project/
├── frontend/           # Next.js frontend
│   ├── public/         # Static assets
│   ├── src/            # Source code
│   │   ├── components/ # Reusable components
│   │   ├── contexts/   # React contexts
│   │   ├── hooks/      # Custom hooks
│   │   ├── pages/      # Next.js pages
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

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Python, Flask, Pydantic
- **Database**: PostgreSQL (via Supabase)
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
- Node.js 18+
- Python 3.8+
- PostgreSQL (via Supabase)
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
   cp .env.template .env  # Edit with your local config
   flask run
   ```

3. Set up the frontend:
   ```
   cd frontend
   npm install
   npm run dev
   ```

4. Visit http://localhost:3000 in your browser

## Features

- User authentication and authorization
- Company data management
- Data privacy preferences management
- Data sharing terms and agreements
- Search functionality
- Multi-environment support
- Secure API endpoints
- Responsive UI with modern design

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

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

## Vercel Deployment

This application has been configured to work with Vercel deployment. The backend has been migrated from a Flask application to serverless functions compatible with Vercel's architecture.

### Key Changes
- API routes are now implemented as serverless functions in the `/api` directory
- Authentication is handled via JWT tokens in serverless functions
- The React frontend remains unchanged but now communicates with the serverless API

### Deployment Steps
1. Connect your repository to Vercel
2. Set up required environment variables in the Vercel dashboard:
   - JWT_SECRET_KEY: Secret for JWT token generation/validation
   - Any other environment-specific variables
3. Deploy the application

### Development Workflow
- Local development still supports the Flask backend via the proxy configuration
- Production deployment uses the serverless functions

### API Endpoints
The following API endpoints are available:
- GET /api/health - Health check
- POST /api/v1/auth/login - User authentication
- GET /api/v1/data-types - Retrieve data types (requires authentication)

## Development Setup

### Running the Application

To run both frontend and backend simultaneously:

```bash
npm run dev
```

To run just the frontend:

```bash
npm start
# or
cd frontend && npm run dev
```

To run just the backend:

```bash
cd backend && python app.py
```

### Building for Production

To build the frontend for production:

```bash
npm run build
```

To prepare the backend for deployment:

```bash
npm run build:backend
``` 