import dotenv from 'dotenv';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

dotenv.config({ path: '.env.local' });

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

try {
  const data = await s3.send(new ListBucketsCommand({}));
  console.log("Buckets encontrados no S3:");
  data.Buckets?.forEach(b => {
    console.log(`- Nome: ${b.Name} | Criado em: ${b.CreationDate}`);
  });
} catch (e) {
  console.error("Erro ao listar buckets:", e);
}
