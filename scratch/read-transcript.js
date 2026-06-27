const fs = require("fs");
const readline = require("readline");
const path = require("path");

const transcriptPath = "C:/Users/geand/.gemini/antigravity/brain/1eb4755e-0f74-46e1-9080-7b2963e4dfec/.system_generated/logs/transcript.jsonl";

async function run() {
  if (!fs.existsSync(transcriptPath)) {
    console.log("Transcript not found.");
    return;
  }
  
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let stepIndex = 0;
  for await (const line of rl) {
    try {
      const step = JSON.parse(line);
      stepIndex = step.step_index;
      
      // Look for USER_INPUT steps containing plant mentions or dante-safra calls
      if (step.type === "USER_INPUT") {
        const content = step.content || "";
        if (content.toLowerCase().includes("zamioculca") || 
            content.toLowerCase().includes("arruda") || 
            content.toLowerCase().includes("azaleia") || 
            content.toLowerCase().includes("l\u00EDrio") || 
            content.toLowerCase().includes("lirio")) {
          console.log(`\n=================== STEP ${stepIndex} (USER INPUT) ===================`);
          console.log(content);
        }
      }
      
      // Look for model outputs or run command outputs
      if (step.type === "PLANNER_RESPONSE" || step.type === "MODEL") {
        const content = step.content || "";
        if (content.toLowerCase().includes("arruda") || 
            content.toLowerCase().includes("azaleia") || 
            content.toLowerCase().includes("l\u00EDrio") || 
            content.toLowerCase().includes("lirio") || 
            content.toLowerCase().includes("zamioculca")) {
          // Only log if it looks like actual assistant responses in the chat
          if (content.includes("Jean,") || content.includes("Comandante") || content.includes("Patr\u00E3o")) {
            console.log(`\n=================== STEP ${stepIndex} (ASSISTANT RESPONSE) ===================`);
            console.log(content.slice(0, 800));
          }
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }
}

run();
