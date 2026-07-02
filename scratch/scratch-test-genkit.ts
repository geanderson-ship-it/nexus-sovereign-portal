import { genkit } from 'genkit';
import { awsBedrock } from 'genkitx-aws-bedrock';

const ai = genkit({
  plugins: [
    awsBedrock({
      region: process.env.AWS_REGION || 'us-east-1',
    }),
  ],
});

async function run() {
  try {
    const models = await ai.registry.listModels();
    console.log("Registered models:");
    models.forEach(m => console.log(m));
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
