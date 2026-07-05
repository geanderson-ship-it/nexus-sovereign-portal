import fetch from 'node-fetch';

const url = 'https://amplify-nextn-geand-sandb-nexusmediabucketfc7a44b7-nwolydnxg4ep.s3.amazonaws.com/public/Agro/Dante_safra.mp4';

console.log(`Verificando URL: ${url}`);

try {
  const res = await fetch(url, { method: 'HEAD' });
  console.log(`Status HTTP: ${res.status}`);
  console.log(`Headers:`, JSON.stringify(res.headers.raw(), null, 2));
} catch (e) {
  console.error("Erro ao acessar URL:", e);
}
