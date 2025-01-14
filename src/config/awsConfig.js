import AWS from 'aws-sdk';

const awsConfig = {
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
  bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
  cloudFront: process.env.REACT_APP_CLOUDFRONT_URL // опционально для CDN
};

AWS.config.update({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  region: awsConfig.region
});

export const s3 = new AWS.S3();
export default awsConfig;