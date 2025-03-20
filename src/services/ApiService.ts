import { client } from '../contexts/DataContext';

/**
 * Generic service for interacting with the Amplify API.
 * This provides a convenient wrapper around the generated client.
 */
export class ApiService {
  /**
   * Create a new record
   * @param modelName The model name to create a record in
   * @param input The data to create
   * @returns Promise with the created record
   */
  static async create(modelName: string, input: any) {
    try {
      // @ts-ignore - we're using dynamic access to models
      return await client.models[modelName].create(input);
    } catch (error) {
      console.error(`Error creating ${modelName}:`, error);
      throw error;
    }
  }

  /**
   * Get a record by ID
   * @param modelName The model name to get from
   * @param id The ID of the record to get
   * @returns Promise with the record
   */
  static async get(modelName: string, id: string) {
    try {
      // @ts-ignore - we're using dynamic access to models
      return await client.models[modelName].get({ id });
    } catch (error) {
      console.error(`Error getting ${modelName}:`, error);
      throw error;
    }
  }

  /**
   * Update a record
   * @param modelName The model name to update
   * @param input The data to update (must include id)
   * @returns Promise with the updated record
   */
  static async update(modelName: string, input: any) {
    if (!input.id) {
      throw new Error('ID is required for update operations');
    }

    try {
      // @ts-ignore - we're using dynamic access to models
      return await client.models[modelName].update(input);
    } catch (error) {
      console.error(`Error updating ${modelName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a record
   * @param modelName The model name to delete from
   * @param id The ID of the record to delete
   * @returns Promise with the deletion result
   */
  static async delete(modelName: string, id: string) {
    try {
      // @ts-ignore - we're using dynamic access to models
      return await client.models[modelName].delete({ id });
    } catch (error) {
      console.error(`Error deleting ${modelName}:`, error);
      throw error;
    }
  }

  /**
   * List records with optional filtering
   * @param modelName The model name to list
   * @param filter Optional filter criteria
   * @param limit Optional limit on number of records
   * @returns Promise with the list of records
   */
  static async list(modelName: string, filter?: any, limit?: number) {
    try {
      // @ts-ignore - we're using dynamic access to models
      return await client.models[modelName].list({ filter, limit });
    } catch (error) {
      console.error(`Error listing ${modelName}:`, error);
      throw error;
    }
  }
}

// Strongly typed helpers for each model
// These are wrapper functions around the generic API service

export const UserApi = {
  create: (input: any) => ApiService.create('User', input),
  get: (id: string) => ApiService.get('User', id),
  update: (input: any) => ApiService.update('User', input),
  delete: (id: string) => ApiService.delete('User', id),
  list: (filter?: any, limit?: number) => ApiService.list('User', filter, limit),
};

export const CompanyApi = {
  create: (input: any) => ApiService.create('Company', input),
  get: (id: string) => ApiService.get('Company', id),
  update: (input: any) => ApiService.update('Company', input),
  delete: (id: string) => ApiService.delete('Company', id),
  list: (filter?: any, limit?: number) => ApiService.list('Company', filter, limit),
};

export const DataTypeApi = {
  create: (input: any) => ApiService.create('DataType', input),
  get: (id: string) => ApiService.get('DataType', id),
  update: (input: any) => ApiService.update('DataType', input),
  delete: (id: string) => ApiService.delete('DataType', id),
  list: (filter?: any, limit?: number) => ApiService.list('DataType', filter, limit),
};

export const DataSharingTermApi = {
  create: (input: any) => ApiService.create('DataSharingTerm', input),
  get: (id: string) => ApiService.get('DataSharingTerm', id),
  update: (input: any) => ApiService.update('DataSharingTerm', input),
  delete: (id: string) => ApiService.delete('DataSharingTerm', id),
  list: (filter?: any, limit?: number) => ApiService.list('DataSharingTerm', filter, limit),
};

export const UserPreferencesApi = {
  create: (input: any) => ApiService.create('UserPreferences', input),
  get: (id: string) => ApiService.get('UserPreferences', id),
  update: (input: any) => ApiService.update('UserPreferences', input),
  delete: (id: string) => ApiService.delete('UserPreferences', id),
  list: (filter?: any, limit?: number) => ApiService.list('UserPreferences', filter, limit),
}; 