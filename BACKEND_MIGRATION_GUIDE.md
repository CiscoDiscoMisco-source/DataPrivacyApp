# Migration Guide: AWS Amplify to Python Flask Backend

This guide will help you migrate from the AWS Amplify backend to the new Python Flask backend deployed on AWS Elastic Beanstalk with S3 and API Gateway integration.

## Architecture Changes

### Old Architecture (Amplify)
- Authentication: AWS Cognito (managed by Amplify)
- Database: AWS DynamoDB
- API: AWS AppSync (GraphQL)
- Storage: AWS S3
- Deployment: AWS Amplify Console

### New Architecture
- Authentication: JWT-based with Flask (still using Cognito as identity provider)
- Database: PostgreSQL on Amazon RDS
- API: Flask REST API exposed via API Gateway
- Storage: AWS S3 (same, but direct integration)
- Deployment: AWS Elastic Beanstalk with CloudFront CDN

## Frontend Changes Required

### 1. API Client Configuration

Replace the Amplify `client` with a standard REST API client. You can use Axios or the native `fetch` API.

Example using Axios:

```bash
npm install axios
```

Then create an API client:

```javascript
// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
```

### 2. Authentication

Replace Amplify Auth with JWT-based authentication:

```javascript
// src/services/auth.js
import apiClient from './api';

export const authService = {
  async login(email, password) {
    const response = await apiClient.post('/api/auth/login', { email, password });
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('refreshToken', response.data.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  async register(firstName, lastName, email, password) {
    const response = await apiClient.post('/api/auth/register', {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    });
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('refreshToken', response.data.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  async getCurrentUser() {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    
    try {
      const response = await apiClient.get('/api/auth/me');
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      return null;
    }
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return false;
    }
    
    try {
      const response = await apiClient.post('/api/auth/refresh', {}, {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      });
      localStorage.setItem('token', response.data.access_token);
      return true;
    } catch (error) {
      return false;
    }
  }
};
```

### 3. Update Context Providers

Modify your auth context to use the new auth service:

```javascript
// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';

// Create the context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setUser(user);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (firstName, lastName, email, password) => {
    setLoading(true);
    try {
      const response = await authService.register(firstName, lastName, email, password);
      setUser(response.user);
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### 4. Create Service Files for Each API Resource

```javascript
// src/services/companies.js
import apiClient from './api';

export const companiesService = {
  async getAll() {
    const response = await apiClient.get('/api/companies');
    return response.data.companies;
  },

  async getById(id) {
    const response = await apiClient.get(`/api/companies/${id}`);
    return response.data.company;
  },

  async getSharingPolicies(id) {
    const response = await apiClient.get(`/api/companies/${id}/sharing-policies`);
    return response.data.policies;
  },

  async getRelatedCompanies(id) {
    const response = await apiClient.get(`/api/companies/${id}/related-companies`);
    return response.data.related_companies;
  }
};
```

Similarly, create services for:
- Data Types
- User Preferences
- Data Sharing Terms
- Users (admin only)
- Search

### 5. Update Components to Use the New Services

Example with Companies component:

```jsx
import React, { useEffect, useState } from 'react';
import { companiesService } from '../services/companies';
import './Companies.css';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await companiesService.getAll();
        setCompanies(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching companies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="companies">
      <h2>Companies</h2>
      <div className="companies-grid">
        {companies.map((company) => (
          <div key={company.id} className="company-card">
            <h3>{company.name}</h3>
            <p className="description">{company.description || 'No description'}</p>
            <div className="company-details">
              {company.website && (
                <p>Website: <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></p>
              )}
              <p>Industry: {company.industry || 'Not specified'}</p>
              <p>Size: {company.size_range || 'Not specified'}</p>
              {company.city && company.country && (
                <p>Location: {company.city}, {company.state && `${company.state}, `}{company.country}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Companies;
```

### 6. File Upload with S3

For direct S3 uploads, you'll need to use pre-signed URLs:

```javascript
// src/services/storage.js
import apiClient from './api';

export const storageService = {
  async uploadFile(file) {
    // First, get a pre-signed URL from the backend
    const response = await apiClient.post('/api/storage/get-upload-url', {
      fileName: file.name,
      contentType: file.type
    });
    
    const { uploadUrl, fileUrl } = response.data;
    
    // Use the pre-signed URL to upload directly to S3
    await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });
    
    return fileUrl;
  },
  
  async deleteFile(fileName) {
    await apiClient.delete(`/api/storage/files/${fileName}`);
  }
};
```

## Environment Configuration

Update your environment variables in `.env`:

```
REACT_APP_API_URL=https://api.example.com
```

## Deployment Process

1. Frontend: Build and deploy to S3 + CloudFront:
   ```bash
   npm run build
   aws s3 sync build/ s3://your-bucket-name/
   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
   ```

2. Backend: Deploy to Elastic Beanstalk:
   ```bash
   eb deploy
   ``` 