/**
 * Utilitário para gerenciar carregamento de vídeos na Nexus.
 * Retorna o arquivo local em desenvolvimento (localhost) e a URL do S3/Amplify em produção.
 */
export function getVideoUrl(s3Url: string, localFilename: string): string {
  if (
    process.env.NODE_ENV === 'development' || 
    (typeof window !== 'undefined' && window.location.hostname === 'localhost')
  ) {
    return `/${localFilename}`;
  }
  return s3Url;
}
