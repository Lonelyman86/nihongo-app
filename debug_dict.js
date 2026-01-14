const fs = require('fs');
const path = 'data/dictionary.ts';

try {
  const content = fs.readFileSync(path, 'utf8');
  const lines = content.split('\n');
  let found = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('neko') || lines[i].includes('猫')) {
      console.log(`Found at line ${i + 1}: ${lines[i].trim()}`);
      // Print surrounding lines
      for (let j = Math.max(0, i - 5); j < Math.min(lines.length, i + 10); j++) {
          console.log(`${j+1}: ${lines[j]}`);
      }
      found = true;
      break;
    }
  }
  if (!found) console.log('Not found');
} catch (e) {
  console.error(e);
}
