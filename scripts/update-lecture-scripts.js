const fs = require('fs');
let text = fs.readFileSync('src/lib/lecture-scripts.ts', 'utf8');

const oldSpeaker = /(?:speaker:\s*)\(i === 1 \|\| \(i > 1 && \(i % 4 === 0 \|\| i % 7 === 0\)\)\) \? 'djeny' : 'dante'/g;
const newSpeaker = `speaker: i === 0 ? 'dante' : 
             i === 1 ? 'djeny' : 
             i === 2 ? 'dante' : 
             ((i - 2) === 1 || ((i - 2) > 1 && ((i - 2) % 4 === 0 || (i - 2) % 7 === 0))) ? 'djeny' : 'dante'`;

text = text.replace(oldSpeaker, newSpeaker);

const oldQuestion = /(?:question:\s*)\(i === 10 \|\| i === 20 \|\| i === 30 \|\| i === 40\)/g;
const newQuestion = `question: (i === 12 || i === 22 || i === 32 || i === 42)`;

text = text.replace(oldQuestion, newQuestion);

fs.writeFileSync('src/lib/lecture-scripts.ts', text, 'utf8');
console.log('lecture-scripts.ts updated successfully');
