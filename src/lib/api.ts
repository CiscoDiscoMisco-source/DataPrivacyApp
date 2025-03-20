import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

// User API
export const createUserAPI = async (input) => {
  return client.models.User.create(input);
};

export const getUserAPI = async (id: string) => {
  return client.models.User.get({ id });
};

export const listUsersAPI = async () => {
  return client.models.User.list();
};

export const updateUserAPI = async (input) => {
  return client.models.User.update(input);
};

export const deleteUserAPI = async (id: string) => {
  return client.models.User.delete({ id });
};

// Company API
export const createCompanyAPI = async (input) => {
  return client.models.Company.create(input);
};

export const getCompanyAPI = async (id: string) => {
  return client.models.Company.get({ id });
};

export const listCompaniesAPI = async () => {
  return client.models.Company.list();
};

export const updateCompanyAPI = async (input) => {
  return client.models.Company.update(input);
};

export const deleteCompanyAPI = async (id: string) => {
  return client.models.Company.delete({ id });
};

// UserPreferences API (previously Preference)
export const createPreferenceAPI = async (input) => {
  return client.models.UserPreferences.create(input);
};

export const getPreferenceAPI = async (id: string) => {
  return client.models.UserPreferences.get({ id });
};

export const listPreferencesAPI = async () => {
  return client.models.UserPreferences.list();
};

export const updatePreferenceAPI = async (input) => {
  return client.models.UserPreferences.update(input);
};

export const deletePreferenceAPI = async (id: string) => {
  return client.models.UserPreferences.delete({ id });
};

// DataSharingTerm API (previously DataSharingPolicy)
export const createDataSharingPolicyAPI = async (input) => {
  return client.models.DataSharingTerm.create(input);
};

export const getDataSharingPolicyAPI = async (id: string) => {
  return client.models.DataSharingTerm.get({ id });
};

export const listDataSharingPoliciesAPI = async () => {
  return client.models.DataSharingTerm.list();
};

export const updateDataSharingPolicyAPI = async (input) => {
  return client.models.DataSharingTerm.update(input);
};

export const deleteDataSharingPolicyAPI = async (id: string) => {
  return client.models.DataSharingTerm.delete({ id });
};

// TokenPackage API
export const createTokenPackageAPI = async (input) => {
  return client.models.TokenPackage.create(input);
};

export const getTokenPackageAPI = async (id: string) => {
  return client.models.TokenPackage.get({ id });
};

export const listTokenPackagesAPI = async () => {
  return client.models.TokenPackage.list();
};

export const updateTokenPackageAPI = async (input) => {
  return client.models.TokenPackage.update(input);
};

export const deleteTokenPackageAPI = async (id: string) => {
  return client.models.TokenPackage.delete({ id });
}; 