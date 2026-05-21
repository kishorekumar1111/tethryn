import fs from 'fs';

function replaceInFile(filePath: string, replacements: {from: RegExp, to: string}[]) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const r of replacements) {
    content = content.replace(r.from, r.to);
  }
  fs.writeFileSync(filePath, content);
}

replaceInFile('src/templates/euphoria/components/SectionDreamEntry.tsx', [
  { from: /sm:/g, to: '@sm:' },
  { from: /md:/g, to: '@md:' },
  { from: /lg:/g, to: '@lg:' },
  { from: /text-\[clamp\(2rem,4vw,4rem\)\]/g, to: 'text-[clamp(2rem,4cqw,4rem)]' },
  { from: /text-\[clamp\(2\.5rem,5vw,5rem\)\]/g, to: 'text-[clamp(2.5rem,5cqw,5rem)]' }
]);

replaceInFile('src/templates/euphoria/components/SectionFinalMessage.tsx', [
  { from: /sm:/g, to: '@sm:' },
  { from: /md:/g, to: '@md:' },
  { from: /lg:/g, to: '@lg:' }
]);

replaceInFile('src/templates/euphoria/components/SectionOurEnergy.tsx', [
  { from: /sm:/g, to: '@sm:' },
  { from: /md:/g, to: '@md:' },
  { from: /lg:/g, to: '@lg:' }
]);

replaceInFile('src/templates/euphoria/components/SectionSecretVoice.tsx', [
  { from: /sm:/g, to: '@sm:' },
  { from: /md:/g, to: '@md:' },
  { from: /lg:/g, to: '@lg:' }
]);

console.log("Done text");
