import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

dotenv.config({ path: '.env.local' });

const region = process.env.AWS_REGION || 'us-east-1';
const bucketName = 'amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
  console.error("Erro: AWS Credentials ausentes no .env.local");
  process.exit(1);
}

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const filePath = path.join('public', 'Nexus Empresas', 'Nexus_B2B.mp4');

if (!fs.existsSync(filePath)) {
  console.error(`Erro: Arquivo local não encontrado em ${filePath}`);
  process.exit(1);
}

const stats = fs.statSync(filePath);
console.log(`Lendo arquivo: ${filePath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);

const fileBuffer = fs.readFileSync(filePath);

const s3Key = 'public/Nexus_Empresas/Nexus_B2B.mp4';

console.log(`Iniciando upload de ${s3Key} para o bucket ${bucketName}...`);

try {
  await s3.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
    Body: fileBuffer,
    ContentType: 'video/mp4',
  }));

  const publicUrl = `https://${bucketName}.s3.amazonaws.com/${s3Key}`;
  console.log(`\n🎉 UPLOAD CONCLUÍDO COM SUCESSO!`);
  console.log(`URL pública do vídeo B2B:\n${publicUrl}\n`);
} catch (err) {
  console.error("Erro crítico ao fazer upload para o S3:", err);
  process.exit(1);
}
