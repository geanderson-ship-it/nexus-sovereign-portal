const Jimp = require('jimp');

async function processImage(inFile, outFile, plateText) {
    console.log("Processing", inFile);
    const carImage = await Jimp.read(inFile);
    
    // Create license plate background (white) with border
    const plateWidth = 240;
    const plateHeight = 80;
    const plate = new Jimp(plateWidth, plateHeight, 0xFFFFFFFF);
    
    // Border (black)
    for(let x=0; x<plateWidth; x++) {
        for(let y=0; y<plateHeight; y++) {
            if (x < 4 || x > plateWidth-5 || y < 4 || y > plateHeight-5) {
                plate.setPixelColor(0x111111FF, x, y);
            }
        }
    }
    
    // Create blue top strip
    for(let x=4; x<plateWidth-4; x++) {
        for(let y=4; y<22; y++) {
            plate.setPixelColor(0x003399FF, x, y);
        }
    }
    
    // Add text
    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
    // Print text in center of white area
    plate.print(font, 0, 16, {
        text: plateText,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }, plateWidth, plateHeight - 20);
    
    // Composite plate onto car image
    // Center it horizontally, near bottom (where the blurred plate is)
    const x = (carImage.bitmap.width - plateWidth) / 2;
    const y = carImage.bitmap.height * 0.70; // 70% down from top
    
    carImage.composite(plate, x, y);
    await carImage.writeAsync(outFile);
    console.log("Saved", outFile);
}

const images = [
    { in: 'C:\\Users\\geand\\.gemini\\antigravity\\brain\\c0f59923-b606-406c-b35a-3bc96504d5b3\\lpr_carro1_semplaca_1784044609797.jpg', out: 'public/lpr_val5j29.jpg', text: 'VAL5J29' },
    { in: 'C:\\Users\\geand\\.gemini\\antigravity\\brain\\c0f59923-b606-406c-b35a-3bc96504d5b3\\lpr_carro2_semplaca_1784044618856.jpg', out: 'public/lpr_mto2k31.jpg', text: 'MTO2K31' },
    { in: 'C:\\Users\\geand\\.gemini\\antigravity\\brain\\c0f59923-b606-406c-b35a-3bc96504d5b3\\lpr_carro3_semplaca_1784044628557.jpg', out: 'public/lpr_scs8b90.jpg', text: 'SCS8B90' },
    { in: 'C:\\Users\\geand\\.gemini\\antigravity\\brain\\c0f59923-b606-406c-b35a-3bc96504d5b3\\lpr_carro4_semplaca_1784044636090.jpg', out: 'public/lpr_psb1c42.jpg', text: 'PSB1C42' }
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
