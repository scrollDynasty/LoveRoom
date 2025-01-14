import { s3 } from '../config/awsConfig';
import awsConfig from '../config/awsConfig';

class DataService {
  constructor() {
    this.bucket = awsConfig.bucket;
  }

  async uploadFile(file, path = '') {
    const fileName = `${path}${Date.now()}_${file.name}`;
    const params = {
      Bucket: this.bucket,
      Key: fileName,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read'
    };

    try {
      const { Location } = await s3.upload(params).promise();
      return {
        url: Location,
        key: fileName,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async deleteFile(key) {
    const params = {
      Bucket: this.bucket,
      Key: key
    };

    try {
      await s3.deleteObject(params).promise();
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async getFileUrl(key) {
    const params = {
      Bucket: this.bucket,
      Key: key,
      Expires: 3600 // URL will be valid for 1 hour
    };

    try {
      return await s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  }

  async getFilesInFolder(folderPath) {
    const params = {
      Bucket: this.bucket,
      Prefix: folderPath
    };

    try {
      const data = await s3.listObjectsV2(params).promise();
      return data.Contents.map(item => ({
        key: item.Key,
        size: item.Size,
        lastModified: item.LastModified
      }));
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  async copyFile(sourceKey, destinationKey) {
    const params = {
      Bucket: this.bucket,
      CopySource: `${this.bucket}/${sourceKey}`,
      Key: destinationKey
    };

    try {
      await s3.copyObject(params).promise();
      return true;
    } catch (error) {
      console.error('Error copying file:', error);
      throw error;
    }
  }

  generatePublicUrl(key) {
    if (awsConfig.cloudFront) {
      return `${awsConfig.cloudFront}/${key}`;
    }
    return `https://${this.bucket}.s3.${awsConfig.region}.amazonaws.com/${key}`;
  }
}

export default new DataService();