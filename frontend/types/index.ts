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
  country?: string;
  dataCollected?: string[];
  privacyUrl?: string;
  contactEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Input type for creating a company
export type CompanyInput = Omit<Company, 'id'>;

// User preferences types
export interface UserPreference {
  id: string;
  user_id: string;
  data_type_id: string;
  company_id: string | null;
  allowed: boolean;
  created_at?: string;
  updated_at?: string;
  company?: Company;
}

export interface UserProfilePreference {
  id: string;
  user_id: string;
  email_notifications: boolean;
  notification_frequency: string;
  notification_types: any[];
  privacy_level: string;
  auto_delete_data: boolean;
  data_retention_period?: number;
  theme: string;
  language: string;
  timezone?: string;
  created_at?: string;
  updated_at?: string;
}

// For compatibility with existing code until migration is complete
export interface LegacyUserPreference {
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
  notificationsEnabled: boolean;
  emailFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  darkMode: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  twoFactorAuth: boolean;
  loginNotifications: boolean;
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
  created_at?: string;
  updated_at?: string;
  last_sign_in_at?: string;
  avatar_url?: string;
  phone?: string;
} 