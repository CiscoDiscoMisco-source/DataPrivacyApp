import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource';

// Initialize API client
const client = generateClient<Schema>();

// Hook for getting a user by ID
export function useUser(userId: string | null) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await client.models.User.get({ id: userId });
        if (response) {
          setUser(response);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch user'));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
}

// Hook for getting a company by ID
export function useCompany(companyId: string | null) {
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!companyId) {
      setCompany(null);
      return;
    }

    const fetchCompany = async () => {
      setLoading(true);
      try {
        const response = await client.models.Company.get({ id: companyId });
        if (response) {
          setCompany(response);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching company:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch company'));
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  return { company, loading, error };
}

// Hook for listing all companies
export function useCompanies() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await client.models.Company.list();
        if (response.data) {
          setCompanies(response.data);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch companies'));
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return { companies, loading, error };
}

// Hook for user preferences
export function useUserPreferences(userId: string | null) {
  const [preferences, setPreferences] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setPreferences([]);
      return;
    }

    const fetchPreferences = async () => {
      setLoading(true);
      try {
        const response = await client.models.UserPreferences.list({
          filter: { userId: { eq: userId } }
        });
        if (response.data) {
          setPreferences(response.data);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching preferences:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch preferences'));
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [userId]);

  // Function to update a preference
  const updatePreference = async (id: string, allowed: boolean) => {
    try {
      const currentPref = await client.models.UserPreferences.get({ id });
      if (!currentPref) {
        throw new Error('Preference not found');
      }
      
      // Create an update object with only the id
      // We'll need to adjust this based on the actual schema structure
      const updateData = {
        id,
        // Add any fields that need to be updated based on the schema
        // This will need to be adjusted based on your specific schema
        privacyLevel: allowed ? 'opt-in' : 'opt-out'
      };
      
      const response = await client.models.UserPreferences.update(updateData);
      
      if (response) {
        // Update the local state with the response data
        setPreferences(prev => 
          prev.map(pref => 
            pref.id === id ? response : pref
          )
        );
      }
      return response;
    } catch (err) {
      console.error('Error updating preference:', err);
      throw err;
    }
  };

  return { preferences, loading, error, updatePreference };
} 