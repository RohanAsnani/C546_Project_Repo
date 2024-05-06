import AWS from 'aws-sdk';


AWS.config.update({
    region: 'us-east-2', 
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4'
});

const s3 = new AWS.S3();

export default s3;
