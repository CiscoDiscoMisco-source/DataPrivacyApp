# Data Privacy App - Frontend

This is the frontend for the Data Privacy App, built with React.

## Structure

```
frontend/
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable UI components
│   │   ├── common/    # Shared components (Header, Footer)
│   │   ├── auth/      # Authentication components
│   │   ├── company/   # Company-related components
│   │   └── preference/# Preference-related components
│   ├── contexts/      # React contexts
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── utils/         # Utility functions
│   ├── App.js         # Main App component
│   ├── index.js       # Entry point
│   └── setupProxy.js  # Proxy configuration
└── package.json       # Frontend dependencies
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Environment Variables

The frontend uses the following environment variables:

- `REACT_APP_API_URL`: The URL of the backend API (defaults to http://localhost:5000)
- `REACT_APP_ENV`: The environment (development, test, production)

## Connection to Backend

The frontend connects to the backend through the proxy configuration in `src/setupProxy.js`. All API requests are prefixed with `/api`. 