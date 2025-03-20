import { 
  uploadData, 
  downloadData, 
  remove, 
  getUrl, 
  list,
  type TransferProgressEvent 
} from 'aws-amplify/storage';

interface StorageProgressCallback {
  progressCallback?: (event: TransferProgressEvent) => void;
}

/**
 * Upload a file to S3 storage
 * @param key - The key (file path) to store the data at
 * @param data - The file data to upload (File, Blob, ArrayBuffer, etc.)
 * @param options - Upload options
 * @returns Promise with upload result
 */
export const uploadFile = async (
  key: string,
  data: File | Blob | ArrayBuffer | string,
  options?: {
    contentType?: string;
    metadata?: Record<string, string>;
  } & StorageProgressCallback
) => {
  try {
    const result = await uploadData({
      key,
      data,
      options: {
        contentType: options?.contentType,
        metadata: options?.metadata,
        onProgress: options?.progressCallback,
      },
    }).result;
    return result;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Download a file from S3 storage
 * @param key - The key (file path) to download
 * @param options - Download options
 * @returns Promise with download result
 */
export const downloadFile = async (
  key: string, 
  options?: StorageProgressCallback
) => {
  try {
    const result = await downloadData({
      key,
      options: {
        onProgress: options?.progressCallback,
      },
    }).result;
    return result;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

/**
 * Remove a file from S3 storage
 * @param key - The key (file path) to remove
 * @returns Promise with remove result
 */
export const removeFile = async (key: string) => {
  try {
    const result = await remove({ key });
    return result;
  } catch (error) {
    console.error('Error removing file:', error);
    throw error;
  }
};

/**
 * Get a signed URL for a file
 * @param key - The key (file path) to get the URL for
 * @param options - URL options
 * @returns Promise with URL result
 */
export const getFileUrl = async (
  key: string, 
  options?: { 
    validateObjectExistence?: boolean; 
    expiresIn?: number 
  }
) => {
  try {
    const result = await getUrl({
      key,
      options: {
        validateObjectExistence: options?.validateObjectExistence,
        expiresIn: options?.expiresIn,
      },
    });
    return result;
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};

/**
 * List files in S3 storage
 * @returns Promise with list result
 */
export const listFiles = async () => {
  try {
    const result = await list();
    return result;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}; 