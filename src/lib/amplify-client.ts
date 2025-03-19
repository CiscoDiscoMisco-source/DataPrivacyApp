'use client';

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

// Create a singleton instance of the Amplify data client
let client: ReturnType<typeof generateClient<Schema>> | null = null;

// Function to get or create the client
export function getAmplifyClient() {
  if (!client) {
    client = generateClient<Schema>();
  }
  return client;
}

// Helper functions for common operations
export async function fetchCompanies() {
  const client = getAmplifyClient();
  return await client.models.Company.list();
}

export async function fetchDataSharingPolicies(companyId: string) {
  const client = getAmplifyClient();
  return await client.models.DataSharingPolicy.list({
    filter: {
      companyId: { eq: companyId }
    }
  });
}

export async function fetchUserPreferences(userId: string) {
  const client = getAmplifyClient();
  return await client.models.Preference.list({
    filter: {
      userId: { eq: userId }
    }
  });
}

export async function fetchGlobalPreferences(userId: string) {
  const client = getAmplifyClient();
  return await client.models.Preference.list({
    filter: {
      userId: { eq: userId },
      isGlobal: { eq: true }
    }
  });
}

export async function fetchTokenPackages() {
  const client = getAmplifyClient();
  return await client.models.TokenPackage.list();
} 