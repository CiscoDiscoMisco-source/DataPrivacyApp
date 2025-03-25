/**
 * Application type definitions
 */

// Company types
export interface Company {
  id: string;
  name: string;
  description?: string;
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
  createdAt?: string;
  updatedAt?: string;
  company?: Company;
}

// Settings types
export interface UserSettings {
  id: string;
  userId: string;
  notificationsEnabled: boolean;
  emailFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  darkMode: boolean;
  createdAt?: string;
  updatedAt?: string;
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