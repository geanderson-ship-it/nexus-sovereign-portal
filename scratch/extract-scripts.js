const fs = require('fs');
const path = require('path');

// Mocking the data structure from lecture-scripts.ts
// In a real scenario, I might import the file, but since I'm a model I can just process it as text.

const filePath = path.join(process.cwd(), 'src/lib/lecture-scripts.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Simple regex to extract the keys and their objects
const lectureScriptsRegex = /'([^']+)':\s*\[([\s\S]*?)\]/g;
let match;
const ptBR = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/lib/locales/pt-BR.json'), 'utf8'));

while ((match = lectureScriptsRegex.exec(content)) !== null) {
    const lectureKey = match[1];
    const arrayContent = match[2];
    
    // Split the array into objects (rough approximation)
    const objects = arrayContent.match(/\{[\s\S]*?\}/g);
    
    if (objects) {
        objects.forEach((objStr, index) => {
            // Extract text and question
            const textMatch = objStr.match(/text:\s*['"](.*?)['"]/);
            const questionMatch = objStr.match(/question:\s*['"](.*?)['"]/);
            
            if (textMatch) {
                const key = `lectures.scripts.${lectureKey}.item${index}.text`;
                ptBR[key] = textMatch[1].replace(/\\'/g, "'");
            }
            if (questionMatch) {
                const key = `lectures.scripts.${lectureKey}.item${index}.question`;
                ptBR[key] = questionMatch[1].replace(/\\'/g, "'");
            }
        });
    }
}

fs.writeFileSync(path.join(process.cwd(), 'src/lib/locales/pt-BR.json'), JSON.stringify(ptBR, null, 2), 'utf8');
console.log('Lectures extracted to pt-BR.json');
