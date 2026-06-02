'use server';

import { S3Client, PutObjectCommand, DeleteObjectCommand, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand, TranscriptionJobStatus } from '@aws-sdk/client-transcribe';

const REGION = process.env.AWS_REGION || 'us-east-1';
const BUCKET = process.env.NEXUS_TRANSCRIBE_BUCKET || 'nexus-ai-transcribe';

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const transcribe = new TranscribeClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Ensure the S3 bucket exists (auto-creates if not)
async function ensureBucket(): Promise<void> {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET }));
  } catch {
    try {
      await s3.send(new CreateBucketCommand({ Bucket: BUCKET }));
      console.log(`[Transcribe] Bucket "${BUCKET}" criado com sucesso.`);
    } catch (createErr: any) {
      if (createErr.name !== 'BucketAlreadyOwnedByYou') throw createErr;
    }
  }
}

// Get media format from MIME type
function getMediaFormat(mimeType: string): string {
  if (mimeType.includes('mp4') || mimeType.includes('mpeg4')) return 'mp4';
  if (mimeType.includes('webm')) return 'webm';
  if (mimeType.includes('ogg')) return 'ogg';
  if (mimeType.includes('wav')) return 'wav';
  if (mimeType.includes('flac')) return 'flac';
  if (mimeType.includes('mp3') || mimeType.includes('mpeg')) return 'mp3';
  if (mimeType.includes('m4a')) return 'mp4';
  return 'mp4'; // default fallback
}

// Main transcription function
export async function transcribeMedia(
  base64Data: string,
  mimeType: string,
  fileName: string
): Promise<string> {
  await ensureBucket();

  // Strip base64 header if present (data:audio/mp4;base64,...)
  const base64Clean = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
  const buffer = Buffer.from(base64Clean, 'base64');

  // Unique job/file name to avoid conflicts
  const timestamp = Date.now();
  const jobName = `nexus-transcribe-${timestamp}`;
  const s3Key = `temp/${jobName}.${getMediaFormat(mimeType)}`;
  const mediaFormat = getMediaFormat(mimeType);

  // 1. Upload to S3
  console.log(`[Transcribe] Enviando "${fileName}" para S3...`);
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: s3Key,
    Body: buffer,
    ContentType: mimeType,
  }));

  // 2. Start transcription job
  console.log(`[Transcribe] Iniciando job "${jobName}"...`);
  await transcribe.send(new StartTranscriptionJobCommand({
    TranscriptionJobName: jobName,
    LanguageCode: 'pt-BR',
    MediaFormat: mediaFormat as any,
    Media: {
      MediaFileUri: `s3://${BUCKET}/${s3Key}`,
    },
  }));

  // 3. Poll for completion (up to 90 seconds)
  let transcript = '';
  const maxAttempts = 30; // 30 × 3s = 90s
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 3000));

    const { TranscriptionJob } = await transcribe.send(
      new GetTranscriptionJobCommand({ TranscriptionJobName: jobName })
    );

    const status = TranscriptionJob?.TranscriptionJobStatus;
    console.log(`[Transcribe] Status: ${status} (tentativa ${i + 1}/${maxAttempts})`);

    if (status === TranscriptionJobStatus.COMPLETED) {
      const transcriptUri = TranscriptionJob?.Transcript?.TranscriptFileUri;
      if (transcriptUri) {
        const response = await fetch(transcriptUri);
        const data = await response.json();
        transcript = data?.results?.transcripts?.[0]?.transcript || '';
      }
      break;
    }

    if (status === TranscriptionJobStatus.FAILED) {
      throw new Error(`Job de transcrição falhou: ${TranscriptionJob?.FailureReason}`);
    }
  }

  // 4. Clean up S3 temp file
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: s3Key }));
    console.log(`[Transcribe] Arquivo temporário removido do S3.`);
  } catch {
    console.warn(`[Transcribe] Não foi possível remover o arquivo temporário.`);
  }

  if (!transcript) {
    throw new Error('Transcrição concluída mas sem texto retornado.');
  }

  return transcript;
}
