
import { ai } from '../src/ai/genkit';

async function listModels() {
  console.log("Registered Models:");
  try {
    const actions = await ai.registry.listActions();
    const modelActions = Object.values(actions).filter((a: any) => a.actionType === 'model');
    modelActions.forEach((a: any) => console.log(`- ${a.name}`));
  } catch (e) {
    console.error("Error listing models:", e);
  }
}

listModels();
