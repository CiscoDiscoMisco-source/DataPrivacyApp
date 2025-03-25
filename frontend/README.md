# Data Privacy App - Frontend

This is the frontend for the Data Privacy App, built with Next.js, TypeScript, and Tailwind CSS.

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
│   ├── pages/         # Next.js pages
│   ├── services/      # API services
│   ├── utils/         # Utility functions
│   ├── app/           # Next.js app directory
│   └── styles/        # Global styles and Tailwind config
└── package.json       # Frontend dependencies
```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`

Builds the app for production.

### `npm start`

Runs the production build.

### `npm run lint`

Runs the linter to check code quality.

## Environment Variables

The frontend uses the following environment variables:

- `NEXT_PUBLIC_API_URL`: The URL of the backend API (defaults to http://localhost:5000)
- `NEXT_PUBLIC_ENV`: The environment (development, test, production)
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **API Client**: Built-in fetch API
- **Authentication**: Supabase Auth
- **Form Handling**: React Hook Form
- **Validation**: Zod

## Features

- Modern, responsive UI with Tailwind CSS
- Server-side rendering with Next.js
- Type-safe development with TypeScript
- Authentication with Supabase
- API integration with backend services
- Form validation and handling
- Error handling and loading states
- Environment-specific configuration

## Development Guidelines

1. Follow TypeScript best practices
2. Use Tailwind CSS for styling
3. Implement responsive design
4. Write clean, maintainable code
5. Add proper error handling
6. Include loading states
7. Follow accessibility guidelines

## Connection to Backend

The frontend connects to the backend through the proxy configuration in `src/setupProxy.js`. All API requests are prefixed with `/api`. 