const fs = require('fs');
let content = fs.readFileSync('src/lib/lecture-scripts.ts', 'utf8');

const regex = /Array\.from\(\{ length: \d+ \}\)\.map\(\(_, i\) => \(\{\n\s*speaker: .*?,\n\s*text: `lectures\.scripts\.([a-z-]+)\.item\$\{i\}\.text`,\n\s*question: .*?\n\s*\}\)\)/g;

content = content.replace(regex, (match, slug) => {
  return `Array.from({ length: 45 }).map((_, i) => ({
    speaker: (i % 4 === 0 || i % 7 === 0) ? 'djeny' : 'dante',
    text: \`lectures.scripts.${slug}.item\${i}.text\`,
    question: (i === 10 || i === 20 || i === 30 || i === 40) ? \`lectures.scripts.${slug}.item\${i}.question\` : undefined,
  }))`;
});

fs.writeFileSync('src/lib/lecture-scripts.ts', content);
console.log('Updated lecture-scripts.ts');
