'use client';

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

// Create a singleton instance of the Amplify data client
let client: ReturnType<typeof generateClient<Schema>> | null = null;

// Function to get or create the client
export function getAmplifyClient() {
  if (!client) {
    client = generateClient<Schema>();
  }
  return client;
}

// User-related helper functions
export async function fetchUser(userId: string) {
  const client = getAmplifyClient();
  return await client.models.User.get({ id: userId });
}

export async function createUser(userData: {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  isAdmin?: boolean;
}) {
  const client = getAmplifyClient();
  return await client.models.User.create({
    ...userData,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

// Company-related helper functions
export async function fetchCompanies() {
  const client = getAmplifyClient();
  return await client.models.Company.list({});
}

export async function fetchCompanyById(companyId: string) {
  const client = getAmplifyClient();
  return await client.models.Company.get({ id: companyId });
}

export async function fetchCompaniesByOwner(ownerId: string) {
  const client = getAmplifyClient();
  return await client.models.Company.list({
    filter: {
      ownerId: { eq: ownerId }
    }
  });
}

// DataType-related helper functions
export async function fetchDataTypes(companyId: string) {
  const client = getAmplifyClient();
  return await client.models.DataType.list({
    filter: {
      companyId: { eq: companyId }
    }
  });
}

export async function fetchDataTypeById(dataTypeId: string) {
  const client = getAmplifyClient();
  return await client.models.DataType.get({ id: dataTypeId });
}

// DataSharingTerm-related helper functions
export async function fetchDataSharingTerms(companyId: string) {
  const client = getAmplifyClient();
  return await client.models.DataSharingTerm.list({
    filter: {
      companyId: { eq: companyId }
    }
  });
}

export async function fetchDataSharingTermsForUser(userId: string) {
  const client = getAmplifyClient();
  return await client.models.DataSharingTerm.list({
    filter: {
      or: [
        { sharedById: { eq: userId } },
        { sharedWithId: { eq: userId } }
      ]
    }
  });
}

// UserPreferences-related helper functions
export async function fetchUserPreferences(userId: string) {
  const client = getAmplifyClient();
  return await client.models.UserPreferences.list({
    filter: {
      userId: { eq: userId }
    },
    limit: 1
  });
}

export async function updateUserPreferences(id: string, preferencesData: any) {
  const client = getAmplifyClient();
  return await client.models.UserPreferences.update({
    id,
    ...preferencesData,
    updatedAt: new Date().toISOString()
  });
} 