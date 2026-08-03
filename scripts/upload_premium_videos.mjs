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
    localPath: 'public/Tenente_Coronel_Avila.mp4',
    s3Key: 'public/Premium/Avila_Egide.mp4'
  },
  {
    localPath: 'public/Artur_Pactum.mp4',
    s3Key: 'public/Premium/Artur_Pactum.mp4'
  },
  {
    localPath: 'public/orion_Premium.mp4',
    s3Key: 'public/Premium/Orion.mp4'
  },
  {
    localPath: 'public/Magadot_Nexus.mp4',
    s3Key: 'public/Premium/Magadot_Nexus.mp4'
  },
  {
    localPath: 'public/Magadot_Nexus.mp4',
    s3Key: 'public/Magadot_Nexus.mp4'
  },
  {
    localPath: 'public/visao_camera.mp4',
    s3Key: 'public/visao_camera.mp4'
  }
];

async function uploadFiles() {
  for (const file of filesToUpload) {
    try {
      const fullPath = path.resolve(file.localPath);
      if (!existsSync(fullPath)) {
        console.log(`Arquivo nao encontrado: ${fullPath}`);
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
      console.log(`Upload sucesso: ${file.s3Key}`);
    } catch (err) {
      console.error(`Erro no upload de ${file.s3Key}:`, err);
    }
  }
}

uploadFiles();
