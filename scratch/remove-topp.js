const fs = require("fs");
const path = require("path");

const flowsDir = path.join(__dirname, "..", "src", "ai", "flows");
const files = fs.readdirSync(flowsDir);

console.log("Scanning flows directory for topP config...");

files.forEach(file => {
  if (file.endsWith(".ts")) {
    const filePath = path.join(flowsDir, file);
    let content = fs.readFileSync(filePath, "utf-8");
    
    // Check if file contains topP
    if (content.includes("topP:")) {
      console.log(`- Modifying ${file}...`);
      
      // Replace "topP: 1," or "topP: 1" (with varying spacing and newlines)
      content = content.replace(/\s*topP:\s*1,?\s*\n?/g, "\n");
      
      fs.writeFileSync(filePath, content, "utf-8");
      console.log(`  Successfully removed topP from ${file}`);
    }
  }
});

console.log("All done!");
