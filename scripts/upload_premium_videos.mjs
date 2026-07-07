import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AMPLIFY_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AMPLIFY_SECRET_ACCESS_KEY || '',
  }
});

const bucketName = 'amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep';

const filesToUpload = [
  {
    localPath: 'public/Nexus Intelligence Édge/Tenente Coronel Ávila.mp4',
    s3Key: 'public/Premium/Avila_Egide.mp4'
  },
  {
    localPath: 'public/Nexus Pactum/Artur - Pactum.mp4',
    s3Key: 'public/Premium/Artur_Pactum.mp4'
  },
  {
    localPath: 'public/Video Orion Premium/orion Premium.mp4',
    s3Key: 'public/Premium/Orion.mp4'
  },
  {
    localPath: 'public/Video Magadot Premium/Magadot_Nexus.mp4',
    s3Key: 'public/Premium/Magadot_Nexus.mp4'
  }
];

async function uploadFiles() {
  for (const file of filesToUpload) {
    try {
      const fullPath = path.resolve(file.localPath);
      if (!existsSync(fullPath)) {
        console.log(`Arquivo não encontrado: ${fullPath}`);
        continue;
      }
      
      const fileBuffer = readFileSync(fullPath);
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: file.s3Key,
        Body: fileBuffer,
        ContentType: 'video/mp4'
      });
      
      await s3.send(command);
      console.log(`✅ Upload sucesso: ${file.s3Key}`);
    } catch (err) {
      console.error(`❌ Erro no upload de ${file.s3Key}:`, err);
    }
  }
}

uploadFiles();
