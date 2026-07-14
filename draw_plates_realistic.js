const Jimp = require('jimp');

async function processImage(inFile, outFile, plateText) {
    console.log("Processing", inFile);
    const carImage = await Jimp.read(inFile);
    
    // Create license plate background
    const plateWidth = 240;
    const plateHeight = 80;
    const plate = new Jimp(plateWidth, plateHeight, 0xFFFFFFFF);
    
    // Add noise and gradient to make it look like a photo
    for(let x=0; x<plateWidth; x++) {
        for(let y=0; y<plateHeight; y++) {
            // Base gradient
            const intensity = 200 + (y / plateHeight) * 55; 
            // Noise
            const noise = (Math.random() - 0.5) * 20;
            const finalVal = Math.min(255, Math.max(0, intensity + noise));
            
            // Border (grayish/black)
            if (x < 3 || x > plateWidth-4 || y < 3 || y > plateHeight-4) {
                plate.setPixelColor(Jimp.rgbaToInt(30, 30, 30, 255), x, y);
            } else {
                plate.setPixelColor(Jimp.rgbaToInt(finalVal, finalVal, finalVal, 255), x, y);
            }
        }
    }
    
    // Create blue top strip with gradient
    for(let x=3; x<plateWidth-3; x++) {
        for(let y=3; y<24; y++) {
            const blueInt = 150 + (y / 21) * 50;
            plate.setPixelColor(Jimp.rgbaToInt(0, 50, blueInt, 255), x, y);
        }
    }
    
    // Add text
    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
    // Print text in center of white area, slightly faded
    const textLayer = new Jimp(plateWidth, plateHeight, 0x00000000);
    textLayer.print(font, 0, 16, {
        text: plateText,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }, plateWidth, plateHeight - 20);
    
    textLayer.opacity(0.85); // Make text blend in slightly
    plate.composite(textLayer, 0, 0);
    
    // Resize slightly for each car to match perspective
    plate.resize(110, 38);
    
    // Composite plate onto car image
    const x = (carImage.bitmap.width - 110) / 2;
    const y = carImage.bitmap.height * 0.86; // Position over the blurred bumper
    
    carImage.composite(plate, x, y);
    await carImage.writeAsync(outFile);
    console.log("Saved", outFile);
}

const images = [
    { in: 'C:\\Users\\geand\\.gemini\\antigravity\\brain\\c0f59923-b606-406c-b35a-3bc96504d5b3\\lpr_carro1_semplaca_1784044609797.jpg', out: 'public/lpr_carro1.jpg', text: 'VAL5J29' },
    { in: 'C:\\Users\\geand\\.gemini\\antigravity\\brain\\c0f59923-b606-406c-b35a-3bc96504d5b3\\lpr_carro2_semplaca_1784044618856.jpg', out: 'public/lpr_carro2.jpg', text: 'MTO2K31' },
    { in: 'C:\\Users\\geand\\.gemini\\antigravity\\brain\\c0f59923-b606-406c-b35a-3bc96504d5b3\\lpr_carro3_semplaca_1784044628557.jpg', out: 'public/lpr_carro3.jpg', text: 'SCS8B90' },
    { in: 'C:\\Users\\geand\\.gemini\\antigravity\\brain\\c0f59923-b606-406c-b35a-3bc96504d5b3\\lpr_carro4_semplaca_1784044636090.jpg', out: 'public/lpr_carro4.jpg', text: 'PSB1C42' }
];

async function run() {
    for (const img of images) {
        try {
            await processImage(img.in, img.out, img.text);
        } catch(e) {
            console.error(e);
        }
    }
}
run();
