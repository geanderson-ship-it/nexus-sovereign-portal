const { execSync } = require('child_process');
const path = require('path');

const files = [
  'Hoteis.mp4',
  'Reorts.mp4',
  'Valeria_Explicativo.mp4',
  'Valeria_Cancun.mp4',
  'Kelie_Australia.mp4',
  'Hana_Japao.mp4',
  'Isabel_Mendoza.mp4'
];

const bucket = 's3://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep/public/Embaixadora/';

files.forEach(file => {
  const localPath = path.join('public', file);
  const s3Path = bucket + file;
  console.log(`Uploading ${localPath} to ${s3Path}...`);
  try {
    execSync(`aws s3 cp "${localPath}" "${s3Path}"`, { stdio: 'inherit' });
    console.log(`Successfully uploaded ${file}`);
  } catch (err) {
    console.error(`Failed to upload ${file}:`, err.message);
  }
});
