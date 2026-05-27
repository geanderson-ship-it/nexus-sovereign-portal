const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Regex to identify words with Portuguese accents or common Portuguese structures,
// or strings containing Portuguese-specific text.
const ptRegex = /[a-zA-ZáàâãéèêíïóôõöúçÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇ]*[áàâãéèêíïóôõöúçÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇ][a-zA-ZáàâãéèêíïóôõöúçÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇ]*/;

// Exclude directories
const excludeDirs = ['lib', 'locales', 'node_modules', '.next', 'api', 'styles'];

const findings = [];

function scan(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        scan(fullPath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      // Skip test files
      if (file.includes('test') || file.includes('spec') || file.includes('mock')) continue;
      
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        
        // Skip imports, comments, console logs, and known technical lines
        if (
          trimmed.startsWith('import ') ||
          trimmed.startsWith('//') ||
          trimmed.startsWith('*') ||
          trimmed.includes('console.log') ||
          trimmed.includes('console.error') ||
          trimmed.includes('t(') || // Already localized
          trimmed.includes('tArray(') ||
          trimmed.includes('tObject(')
        ) {
          return;
        }

        // Check if there is plain text inside JSX tags (e.g. >Algum Texto<)
        // or a string with accents that looks like hardcoded Portuguese
        const hasPTAccent = ptRegex.test(trimmed);
        
        // Match raw text in JSX: >text< or {"text"}
        const jsxTextMatch = />([^<{]+[áàâãéèêíïóôõöúçÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇ]+[^<{]*)<|["']([^"']*[áàâãéèêíïóôõöúçÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇ]+[^"']*)["']/.exec(trimmed);
        
        if (hasPTAccent && jsxTextMatch) {
          const matchedText = jsxTextMatch[1] || jsxTextMatch[2];
          if (matchedText && matchedText.trim().length > 2) {
            findings.push({
              file: path.relative(path.join(__dirname, '..'), fullPath),
              line: index + 1,
              content: trimmed,
              text: matchedText.trim()
            });
          }
        }
      });
    }
  }
}

console.log('Scanning src/ for hardcoded Portuguese strings...');
scan(srcDir);

console.log(`\nScan complete! Found ${findings.length} potential hardcoded Portuguese strings:\n`);

findings.forEach((f, index) => {
  console.log(`[${index + 1}] File: ${f.file}:${f.line}`);
  console.log(`    Line Content: ${f.content}`);
  console.log(`    Found Text  : "${f.text}"`);
  console.log('---');
});
