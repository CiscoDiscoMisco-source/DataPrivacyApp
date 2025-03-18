'use client';

import { Company, DataSharingPolicy } from '@/models/company';
import { Preference } from '@/models/preference';

// Sample company data
const COMPANIES: Company[] = [
  {
    id: '1',
    name: 'TechCorp',
    logo: '/logos/techcorp.png',
    industry: 'Technology',
    description: 'A leading technology company specializing in cloud services.',
    dataSharingPolicies: [
      {
        id: '101',
        dataType: 'Personal Info',
        purpose: 'Account Management',
        thirdParties: ['CustomerService Co.', 'CloudSecurity Inc.'],
        description: 'Basic personal information used for account management and security.'
      },
      {
        id: '102',
        dataType: 'Usage Data',
        purpose: 'Analytics',
        thirdParties: ['Analytics Pro', 'DataInsight Ltd.'],
        description: 'Information about how you use our services.'
      },
      {
        id: '103',
        dataType: 'Location',
        purpose: 'Service Localization',
        thirdParties: ['LocalSearch Inc.'],
        description: 'Your location data to provide local services.'
      }
    ]
  },
  {
    id: '2',
    name: 'FinanceHub',
    logo: '/logos/financehub.png',
    industry: 'Finance',
    description: 'Financial services and banking solutions.',
    dataSharingPolicies: [
      {
        id: '201',
        dataType: 'Personal Info',
        purpose: 'Identity Verification',
        thirdParties: ['VerifyID Inc.', 'SecureCheck Corp.'],
        description: 'Verifying your identity for security and regulatory compliance.'
      },
      {
        id: '202',
        dataType: 'Financial Data',
        purpose: 'Transaction Processing',
        thirdParties: ['PaymentProcess Ltd.', 'CreditCheck Co.'],
        description: 'Processing your financial transactions and credit history.'
      },
      {
        id: '203',
        dataType: 'Location',
        purpose: 'Fraud Detection',
        thirdParties: ['FraudShield Inc.'],
        description: 'Detecting unusual activity patterns for your security.'
      }
    ]
  },
  {
    id: '3',
    name: 'HealthPlus',
    logo: '/logos/healthplus.png',
    industry: 'Healthcare',
    description: 'Healthcare services and wellness solutions.',
    dataSharingPolicies: [
      {
        id: '301',
        dataType: 'Personal Info',
        purpose: 'Patient Registration',
        thirdParties: ['MedicalRecords Inc.'],
        description: 'Managing your patient information for better service.'
      },
      {
        id: '302',
        dataType: 'Health Data',
        purpose: 'Treatment',
        thirdParties: ['SpecialistNet', 'LabResults Ltd.'],
        description: 'Health information used for diagnosis and treatment.'
      },
      {
        id: '303',
        dataType: 'Insurance Info',
        purpose: 'Billing',
        thirdParties: ['InsuranceBilling Co.'],
        description: 'Insurance details for processing claims and payments.'
      }
    ]
  }
];

// Default preferences (all disallowed initially)
const defaultPreferences: Preference[] = [
  // Global preferences
  { id: 'g1', dataType: 'Personal Info', allowed: false },
  { id: 'g2', dataType: 'Usage Data', allowed: false },
  { id: 'g3', dataType: 'Location', allowed: false },
  { id: 'g4', dataType: 'Financial Data', allowed: false },
  { id: 'g5', dataType: 'Health Data', allowed: false },
  { id: 'g6', dataType: 'Insurance Info', allowed: false }
];

// Local storage keys
const COMPANIES_KEY = 'data-privacy-companies';
const PREFERENCES_KEY = 'data-privacy-preferences';

// Event emitter for preference changes
type PreferenceChangeListener = () => void;
const preferenceChangeListeners: PreferenceChangeListener[] = [];

export const dataService = {
  // Get all companies
  getCompanies: (): Company[] => {
    if (typeof window === 'undefined') return COMPANIES;
    
    const storedCompanies = localStorage.getItem(COMPANIES_KEY);
    if (!storedCompanies) {
      localStorage.setItem(COMPANIES_KEY, JSON.stringify(COMPANIES));
      return COMPANIES;
    }
    
    return JSON.parse(storedCompanies);
  },
  
  // Get a specific company
  getCompany: (id: string): Company | undefined => {
    const companies = dataService.getCompanies();
    return companies.find(company => company.id === id);
  },
  
  // Get all preferences
  getPreferences: (): Preference[] => {
    if (typeof window === 'undefined') return defaultPreferences;
    
    const storedPreferences = localStorage.getItem(PREFERENCES_KEY);
    if (!storedPreferences) {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(defaultPreferences));
      return defaultPreferences;
    }
    
    return JSON.parse(storedPreferences);
  },
  
  // Get global preferences
  getGlobalPreferences: (): Preference[] => {
    const preferences = dataService.getPreferences();
    return preferences.filter(pref => !pref.companyId);
  },
  
  // Get company-specific preferences
  getCompanyPreferences: (companyId: string): Preference[] => {
    const preferences = dataService.getPreferences();
    return preferences.filter(pref => pref.companyId === companyId);
  },
  
  // Save a preference
  savePreference: (preference: Preference): void => {
    if (typeof window === 'undefined') return;
    
    const preferences = dataService.getPreferences();
    
    // Find if preference already exists
    const index = preferences.findIndex(
      p => p.dataType === preference.dataType && 
      p.companyId === preference.companyId
    );
    
    if (index >= 0) {
      // Update existing preference
      preferences[index] = preference;
    } else {
      // Add new preference
      preferences.push(preference);
    }
    
    // Save to localStorage
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    
    // Notify listeners
    dataService.notifyPreferenceChange();
  },
  
  // Clone preferences from one company to another
  clonePreferences: (sourceCompanyId: string, targetCompanyId: string): void => {
    if (typeof window === 'undefined') return;
    
    const preferences = dataService.getPreferences();
    const sourcePreferences = preferences.filter(pref => pref.companyId === sourceCompanyId);
    
    if (sourcePreferences.length === 0) {
      // If no source preferences found, check if we should use global preferences
      const globalPrefs = preferences.filter(pref => !pref.companyId);
      
      if (globalPrefs.length > 0) {
        // Create new preferences for target company based on global preferences
        const targetPreferences = globalPrefs.map(pref => ({
          id: `${targetCompanyId}-${pref.dataType.replace(/\s+/g, '-').toLowerCase()}`,
          dataType: pref.dataType,
          allowed: pref.allowed,
          companyId: targetCompanyId
        }));
        
        // Remove any existing preferences for the target company
        const filteredPreferences = preferences.filter(pref => pref.companyId !== targetCompanyId);
        
        // Add new preferences
        const updatedPreferences = [...filteredPreferences, ...targetPreferences];
        
        // Save to localStorage
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updatedPreferences));
        
        // Notify listeners
        dataService.notifyPreferenceChange();
      }
      return;
    }
    
    // Get target company to ensure we clone all relevant data types
    const targetCompany = dataService.getCompany(targetCompanyId);
    if (!targetCompany) return;
    
    // Create a map of source preferences for quick lookup
    const sourcePrefsMap = new Map<string, Preference>();
    sourcePreferences.forEach(pref => {
      sourcePrefsMap.set(pref.dataType, pref);
    });
    
    // Create new preferences for target company
    const targetPreferences: Preference[] = [];
    
    // Ensure we create a preference for each data type in the target company
    targetCompany.dataSharingPolicies.forEach(policy => {
      const sourcePref = sourcePrefsMap.get(policy.dataType);
      
      // Use the source preference if available, otherwise use global preference
      const globalPref = preferences.find(
        p => p.dataType === policy.dataType && !p.companyId
      );
      
      const allowed = sourcePref 
        ? sourcePref.allowed 
        : (globalPref ? globalPref.allowed : false);
      
      targetPreferences.push({
        id: `${targetCompanyId}-${policy.dataType.replace(/\s+/g, '-').toLowerCase()}`,
        dataType: policy.dataType,
        allowed: allowed,
        companyId: targetCompanyId
      });
    });
    
    // Remove any existing preferences for the target company
    const filteredPreferences = preferences.filter(pref => pref.companyId !== targetCompanyId);
    
    // Add new preferences
    const updatedPreferences = [...filteredPreferences, ...targetPreferences];
    
    // Save to localStorage
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updatedPreferences));
    
    // Notify listeners
    dataService.notifyPreferenceChange();
  },
  
  // Get effective preference (taking into account global and company-specific)
  getEffectivePreference: (dataType: string, companyId: string): boolean => {
    const preferences = dataService.getPreferences();
    
    // Check for company-specific preference
    const companyPref = preferences.find(
      p => p.dataType === dataType && p.companyId === companyId
    );
    
    if (companyPref) {
      return companyPref.allowed;
    }
    
    // Fall back to global preference
    const globalPref = preferences.find(
      p => p.dataType === dataType && !p.companyId
    );
    
    return globalPref ? globalPref.allowed : false;
  },
  
  // Subscribe to preference changes
  subscribeToPreferenceChanges: (listener: PreferenceChangeListener): () => void => {
    preferenceChangeListeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = preferenceChangeListeners.indexOf(listener);
      if (index > -1) {
        preferenceChangeListeners.splice(index, 1);
      }
    };
  },
  
  // Notify all listeners of preference changes
  notifyPreferenceChange: (): void => {
    preferenceChangeListeners.forEach(listener => listener());
  }
};

export default dataService; 