import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import type { GraphQLResult } from '@aws-amplify/api-graphql';

// Import models directly from the models directory
import { User, Company, Preference } from '../models';

// Initialize API client
const client = generateClient();

// Hook for getting a user by ID
export function useUser(userId: string | null) {
  const [user, setUser] = useState<User | null>(null);
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
        const response = await client.graphql({
          query: `
            query GetUser($id: ID!) {
              getUser(id: $id) {
                id
                email
                name
                tokens
                preferences {
                  items {
                    id
                    dataType
                    allowed
                    companyId
                  }
                }
              }
            }
          `,
          variables: { id: userId }
        }) as GraphQLResult<{ getUser: User }>;
        
        if (response.data?.getUser) {
          setUser(response.data.getUser);
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
  const [company, setCompany] = useState<Company | null>(null);
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
        const response = await client.graphql({
          query: `
            query GetCompany($id: ID!) {
              getCompany(id: $id) {
                id
                name
                logo
                industry
                description
                dataSharingPolicies {
                  items {
                    id
                    dataType
                    purpose
                    thirdParties
                    description
                  }
                }
              }
            }
          `,
          variables: { id: companyId }
        }) as GraphQLResult<{ getCompany: Company }>;
        
        if (response.data?.getCompany) {
          setCompany(response.data.getCompany);
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
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await client.graphql({
          query: `
            query ListCompanies {
              listCompanies {
                items {
                  id
                  name
                  logo
                  industry
                  description
                }
              }
            }
          `,
        }) as GraphQLResult<{ listCompanies: { items: Company[] } }>;
        
        if (response.data?.listCompanies?.items) {
          setCompanies(response.data.listCompanies.items);
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
  const [preferences, setPreferences] = useState<Preference[]>([]);
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
        const response = await client.graphql({
          query: `
            query ListPreferencesByUser($userId: ID!) {
              listPreferences(filter: { userId: { eq: $userId } }) {
                items {
                  id
                  dataType
                  allowed
                  companyId
                  company {
                    id
                    name
                  }
                }
              }
            }
          `,
          variables: { userId }
        }) as GraphQLResult<{ listPreferences: { items: Preference[] } }>;
        
        if (response.data?.listPreferences?.items) {
          setPreferences(response.data.listPreferences.items);
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
      const response = await client.graphql({
        query: `
          mutation UpdatePreference($input: UpdatePreferenceInput!) {
            updatePreference(input: $input) {
              id
              dataType
              allowed
              companyId
            }
          }
        `,
        variables: { 
          input: { 
            id, 
            allowed 
          } 
        }
      }) as GraphQLResult<{ updatePreference: Preference }>;
      
      if (response.data?.updatePreference) {
        // Update the local state
        setPreferences(prev => 
          prev.map(pref => 
            pref.id === id ? { ...pref, allowed } : pref
          )
        );
      }
      return response.data?.updatePreference;
    } catch (err) {
      console.error('Error updating preference:', err);
      throw err;
    }
  };

  return { preferences, loading, error, updatePreference };
} 