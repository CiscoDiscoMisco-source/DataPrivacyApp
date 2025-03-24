import apiClient from './api';

export class TransferProgressEvent {
  transferredBytes;
  totalBytes;
  
  constructor(transferredBytes, totalBytes) {
    this.transferredBytes = transferredBytes;
    this.totalBytes = totalBytes;
  }
}

export const storageService = {
  async uploadFile(key, file, options = {}) {
    try {
      // First, get a pre-signed URL from the backend
      const response = await apiClient.post('/api/storage/get-upload-url', {
        key,
        contentType: file.type
      });
      
      const { uploadUrl, fileUrl } = response.data;
      
      // Use the pre-signed URL to upload directly to S3
      const xhr = new XMLHttpRequest();
      
      // Handle progress if callback provided
      if (options.progressCallback) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progressEvent = new TransferProgressEvent(event.loaded, event.total);
            options.progressCallback(progressEvent);
          }
        };
      }
      
      // Create a promise to track upload completion
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({ key, fileUrl });
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        
        xhr.onerror = () => {
          reject(new Error('Upload failed'));
        };
      });
      
      // Start the upload
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
      
      return uploadPromise;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },
  
  async getFileUrl(key) {
    try {
      const response = await apiClient.get(`/api/storage/get-download-url?key=${encodeURIComponent(key)}`);
      return response.data.fileUrl;
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  },
  
  async downloadFile(key, options = {}) {
    try {
      // Get a pre-signed URL for downloading
      const fileUrl = await this.getFileUrl(key);
      
      // Use fetch to download the file
      const response = await fetch(fileUrl);
      
      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }
      
      // Get the file data
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  },
  
  async removeFile(key) {
    try {
      const response = await apiClient.delete(`/api/storage/files/${encodeURIComponent(key)}`);
      return response.data;
    } catch (error) {
      console.error('Error removing file:', error);
      throw error;
    }
  },
  
  async listFiles(prefix = '') {
    try {
      const response = await apiClient.get(`/api/storage/list${prefix ? `?prefix=${encodeURIComponent(prefix)}` : ''}`);
      return response.data.files;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }
};

export default storageService; 