const fs = require('fs');
const path = require('path');

const jaPath = path.join(__dirname, 'src/lib/locales/ja-JP.json');
const enPath = path.join(__dirname, 'src/lib/locales/en-US.json');

let jaRaw = fs.readFileSync(jaPath, 'utf8');

// Try to parse it, if it fails, fix the truncation
let jaObj = {};
try {
  jaObj = JSON.parse(jaRaw);
  console.log("ja-JP.json parsed successfully.");
} catch (e) {
  console.log("Parse error:", e.message);
  // Find the last valid comma or closing quote
  let fixed = jaRaw;
  const lastQuoteIndex = fixed.lastIndexOf('"');
  if (lastQuoteIndex !== -1) {
    fixed = fixed.substring(0, lastQuoteIndex + 1);
    // Find the last colon
    const lastColon = fixed.lastIndexOf(':');
    if (lastColon > fixed.lastIndexOf(',')) {
      // It was in the middle of a value. Just close the value string
      fixed += '"';
    }
  }
  // Remove dangling commas at the end
  fixed = fixed.trim().replace(/,\s*$/, '');
  fixed += '\n}';
  try {
    jaObj = JSON.parse(fixed);
    console.log("Recovered JSON data.");
  } catch (e2) {
    console.log("Could not recover, falling back to empty.");
  }
}

// Read English fallback
const enObj = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Find missing keys
let missingCount = 0;
for (const key in enObj) {
  if (!(key in jaObj)) {
    jaObj[key] = enObj[key]; // fallback to english for now
    missingCount++;
  }
}

console.log("Missing keys added from fallback:", missingCount);

// Write back fixing the file
fs.writeFileSync(jaPath, JSON.stringify(jaObj, null, 2), 'utf8');
console.log("ja-JP.json fixed and saved.");
