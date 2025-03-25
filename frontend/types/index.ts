/**
 * Application type definitions
 */

// Company types
export interface Company {
  id: string;
  name: string;
  logo?: string;
  industry?: string;
  website?: string;
  description?: string;
  size_range?: string;
  city?: string;
  state?: string;
  country?: string;
  dataCollected?: string[];
  privacyUrl?: string;
  contactEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

// User preferences types
export interface UserPreference {
  id: string;
  userId: string;
  companyId: string;
  allowDataSharing: boolean;
  allowMarketing: boolean;
  allowProfiling: boolean;
  updatedAt: string;
  company?: Company;
}

// Settings types
export interface UserSettings {
  id: string;
  userId: string;
  darkMode: boolean;
  notificationsEnabled: boolean;
  emailFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
}

// API response types
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  isAdmin: boolean;
} 