import { generateClient } from 'aws-amplify/api';
import { 
  createCompany, 
  createUser, 
  createPreference, 
  createDataSharingPolicy, 
  createTokenPackage 
} from '../graphql/mutations';
import { 
  getCompany, 
  getUser, 
  getPreference, 
  getDataSharingPolicy, 
  getTokenPackage 
} from '../graphql/queries';
import { 
  listCompanies, 
  listUsers, 
  listPreferences, 
  listDataSharingPolicies, 
  listTokenPackages 
} from '../graphql/queries';
import { 
  updateCompany, 
  updateUser, 
  updatePreference, 
  updateDataSharingPolicy, 
  updateTokenPackage 
} from '../graphql/mutations';
import { 
  deleteCompany, 
  deleteUser, 
  deletePreference, 
  deleteDataSharingPolicy, 
  deleteTokenPackage 
} from '../graphql/mutations';
import type { 
  CreateCompanyInput, 
  CreateUserInput, 
  CreatePreferenceInput, 
  CreateDataSharingPolicyInput, 
  CreateTokenPackageInput,
  UpdateCompanyInput,
  UpdateUserInput,
  UpdatePreferenceInput,
  UpdateDataSharingPolicyInput,
  UpdateTokenPackageInput
} from '../API';

const client = generateClient();

// User API
export const createUserAPI = async (input: CreateUserInput) => {
  return client.graphql({
    query: createUser,
    variables: { input }
  });
};

export const getUserAPI = async (id: string) => {
  return client.graphql({
    query: getUser,
    variables: { id }
  });
};

export const listUsersAPI = async () => {
  return client.graphql({
    query: listUsers
  });
};

export const updateUserAPI = async (input: UpdateUserInput) => {
  return client.graphql({
    query: updateUser,
    variables: { input }
  });
};

export const deleteUserAPI = async (id: string) => {
  return client.graphql({
    query: deleteUser,
    variables: { input: { id } }
  });
};

// Company API
export const createCompanyAPI = async (input: CreateCompanyInput) => {
  return client.graphql({
    query: createCompany,
    variables: { input }
  });
};

export const getCompanyAPI = async (id: string) => {
  return client.graphql({
    query: getCompany,
    variables: { id }
  });
};

export const listCompaniesAPI = async () => {
  return client.graphql({
    query: listCompanies
  });
};

export const updateCompanyAPI = async (input: UpdateCompanyInput) => {
  return client.graphql({
    query: updateCompany,
    variables: { input }
  });
};

export const deleteCompanyAPI = async (id: string) => {
  return client.graphql({
    query: deleteCompany,
    variables: { input: { id } }
  });
};

// Preference API
export const createPreferenceAPI = async (input: CreatePreferenceInput) => {
  return client.graphql({
    query: createPreference,
    variables: { input }
  });
};

export const getPreferenceAPI = async (id: string) => {
  return client.graphql({
    query: getPreference,
    variables: { id }
  });
};

export const listPreferencesAPI = async () => {
  return client.graphql({
    query: listPreferences
  });
};

export const updatePreferenceAPI = async (input: UpdatePreferenceInput) => {
  return client.graphql({
    query: updatePreference,
    variables: { input }
  });
};

export const deletePreferenceAPI = async (id: string) => {
  return client.graphql({
    query: deletePreference,
    variables: { input: { id } }
  });
};

// DataSharingPolicy API
export const createDataSharingPolicyAPI = async (input: CreateDataSharingPolicyInput) => {
  return client.graphql({
    query: createDataSharingPolicy,
    variables: { input }
  });
};

export const getDataSharingPolicyAPI = async (id: string) => {
  return client.graphql({
    query: getDataSharingPolicy,
    variables: { id }
  });
};

export const listDataSharingPoliciesAPI = async () => {
  return client.graphql({
    query: listDataSharingPolicies
  });
};

export const updateDataSharingPolicyAPI = async (input: UpdateDataSharingPolicyInput) => {
  return client.graphql({
    query: updateDataSharingPolicy,
    variables: { input }
  });
};

export const deleteDataSharingPolicyAPI = async (id: string) => {
  return client.graphql({
    query: deleteDataSharingPolicy,
    variables: { input: { id } }
  });
};

// TokenPackage API
export const createTokenPackageAPI = async (input: CreateTokenPackageInput) => {
  return client.graphql({
    query: createTokenPackage,
    variables: { input }
  });
};

export const getTokenPackageAPI = async (id: string) => {
  return client.graphql({
    query: getTokenPackage,
    variables: { id }
  });
};

export const listTokenPackagesAPI = async () => {
  return client.graphql({
    query: listTokenPackages
  });
};

export const updateTokenPackageAPI = async (input: UpdateTokenPackageInput) => {
  return client.graphql({
    query: updateTokenPackage,
    variables: { input }
  });
};

export const deleteTokenPackageAPI = async (id: string) => {
  return client.graphql({
    query: deleteTokenPackage,
    variables: { input: { id } }
  });
}; 