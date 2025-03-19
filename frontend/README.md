# Data Privacy App Frontend

This is the React frontend for the Data Privacy Application. It provides a user interface for managing privacy preferences, viewing company data sharing terms, and visualizing data sharing relationships.

## Project Structure

```
frontend/
├── public/              # Static assets and HTML template
├── src/                 # Source code
│   ├── components/      # Reusable UI components
│   │   ├── company/     # Company-related components
│   │   └── preferences/ # Preference-related components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   ├── contexts/        # React contexts
│   ├── App.js           # Main App component
│   └── index.js         # Entry point
└── package.json         # Dependencies and scripts
```

## Architecture

The frontend follows a component-based architecture with separation of concerns:
- **Components**: Reusable UI elements
- **Pages**: Top-level route components
- **Hooks**: Shared stateful logic
- **Services**: API communication
- **Contexts**: Global state management
- **Utils**: Helper functions and utilities

## Key Features

- User authentication
- Company data management
- Privacy preference settings
- Data sharing terms visualization
- Network visualization of data sharing relationships

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start development server:
   ```
   npm start
   ```

3. Build for production:
   ```
   npm run build
   ```

## Dependencies

- React
- React Router DOM
- Axios for API calls
- Bootstrap for styling
- D3.js for data visualization
- Formik and Yup for form validation 