import fs from 'fs';
import path from 'path';

function replaceInFile(filePath: string, replacements: {from: RegExp, to: string}[]) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const r of replacements) {
    content = content.replace(r.from, r.to);
  }
  fs.writeFileSync(filePath, content);
}

replaceInFile('src/templates/euphoria/components/SectionMemoryWaves.tsx', [
  { from: /w-\[75vw\]/g, to: 'w-[75cqw]' },
  { from: /w-\[60vw\]/g, to: 'w-[60cqw]' },
  { from: /w-\[45vw\]/g, to: 'w-[45cqw]' },
  { from: /w-\[35vw\]/g, to: 'w-[35cqw]' },
  { from: /px-\[10vw\]/g, to: 'px-[10cqw]' },
  { from: /md:/g, to: '@md:' },
  { from: /sm:/g, to: '@sm:' },
  { from: /lg:/g, to: '@lg:' }
]);

replaceInFile('src/templates/euphoria/components/SectionFloatingMemories.tsx', [
  { from: /w-\[80vw\]/g, to: 'w-[80cqw]' },
  { from: /h-\[80vw\]/g, to: 'h-[80cqw]' },
  { from: /w-\[60vw\]/g, to: 'w-[60cqw]' },
  { from: /h-\[60vw\]/g, to: 'h-[60cqw]' },
  { from: /sm:/g, to: '@sm:' },
  { from: /lg:/g, to: '@lg:' },
  { from: /xl:/g, to: '@xl:' }
]);

replaceInFile('src/templates/euphoria/components/EuphoriaBackground.tsx', [
  { from: /w-\[90vw\]/g, to: 'w-[90cqw]' },
  { from: /h-\[90vw\]/g, to: 'h-[90cqw]' },
  { from: /w-\[80vw\]/g, to: 'w-[80cqw]' },
  { from: /h-\[80vw\]/g, to: 'h-[80cqw]' },
  { from: /w-\[70vw\]/g, to: 'w-[70cqw]' },
  { from: /h-\[70vw\]/g, to: 'h-[70cqw]' },
  { from: /w-\[60vw\]/g, to: 'w-[60cqw]' },
  { from: /h-\[60vw\]/g, to: 'h-[60cqw]' }
]);

replaceInFile('src/templates/euphoria/styles.css', [
  { from: /width: 100vw;/g, to: 'width: 100%;' },
  { from: /height: 100vh;/g, to: 'height: 100%;' },
  { from: /position: fixed;/g, to: 'position: absolute;' }
]);

// Update component.tsx to have @container
const compPath = 'src/templates/euphoria/component.tsx';
let compContent = fs.readFileSync(compPath, 'utf8');
compContent = compContent.replace(
  /className={`euphoria-app relative w-full/g,
  'className={`euphoria-app @container relative w-full'
);
fs.writeFileSync(compPath, compContent);

console.log("Done");
