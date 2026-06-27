const fs = require("fs");
const path = require("path");

async function testPollinations() {
  const prompt = "A photorealistic yellow industrial centrifugal pump, high detail, 10-inch flanged inlet and outlet, on a steel support skid in an open field, technical rendering, high detail";
  console.log("Generating image for prompt:", prompt);
  
  try {
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&private=true&enhance=true`;
    console.log("Fetching from URL:", url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    
    console.log("SUCCESS! Base64 length:", base64.length);
    console.log("First 50 chars:", base64.substring(0, 50));
    
    // Save locally to verify visually if needed
    const outputPath = path.join(__dirname, "test-pump.jpg");
    fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
    console.log("Saved test image to:", outputPath);
  } catch (error) {
    console.error("FAILED:", error.message);
  }
}

testPollinations();
