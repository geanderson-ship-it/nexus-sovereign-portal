import dotenv from 'dotenv';
import { 
  S3Client, 
  PutPublicAccessBlockCommand, 
  PutBucketPolicyCommand 
} from '@aws-sdk/client-s3';

dotenv.config({ path: '.env.local' });

const region = 'us-east-1';
const bucketName = 'amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep';

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

async function makeBucketPublicForAssets() {
  try {
    console.log(`1. Desativando "Block Public Access" para o bucket ${bucketName}...`);
    await s3.send(new PutPublicAccessBlockCommand({
      Bucket: bucketName,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        IgnorePublicAcls: false,
        BlockPublicPolicy: false,
        RestrictPublicBuckets: false
      }
    }));
    console.log(`✅ "Block Public Access" desativado com sucesso.`);

    console.log(`2. Aplicando política de leitura pública para a pasta "public/*"...`);
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicReadGetObject",
          Effect: "Allow",
          Principal: "*",
          Action: "s3:GetObject",
          Resource: `arn:aws:s3:::${bucketName}/public/*`
        }
      ]
    };

    await s3.send(new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify(policy)
    }));
    console.log(`✅ Política de leitura pública aplicada com sucesso!`);

  } catch (error) {
    console.error("❌ Falha ao tentar liberar acesso público ao S3:", error);
  }
}

makeBucketPublicForAssets();
