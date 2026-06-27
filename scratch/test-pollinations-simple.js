const fs = require("fs");
const path = require("path");

async function testSimple() {
  const prompt = "A photorealistic yellow industrial centrifugal pump on field";
  console.log("Generating simple image...");
  
  try {
    // Test the standard public URL without premium query parameters
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
    console.log("Fetching from URL:", url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    
    console.log("SUCCESS! Base64 length:", base64.length);
    console.log("First 50 chars:", base64.substring(0, 50));
    
    const outputPath = path.join(__dirname, "test-pump-simple.jpg");
    fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
    console.log("Saved test image to:", outputPath);
  } catch (error) {
    console.error("FAILED:", error.message);
  }
}

testSimple();
