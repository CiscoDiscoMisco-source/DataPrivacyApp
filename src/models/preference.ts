export interface Preference {
  id: string;
  dataType: string;
  allowed: boolean;
  companyId?: string; // If undefined, it's a global preference
} 