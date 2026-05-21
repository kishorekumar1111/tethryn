import fs from 'fs';
import path from 'path';

function replaceInDir(dir: string, replacements: {from: RegExp, to: string}[]) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath, replacements);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      for (const r of replacements) {
        content = content.replace(r.from, r.to);
      }
      fs.writeFileSync(fullPath, content);
    }
  }
}

replaceInDir('src/templates/euphoria', [
  { from: /100svh/g, to: '100cqh' },
  { from: /140svh/g, to: '140cqh' },
  { from: /200vh/g, to: '200cqh' },
  { from: /400vh/g, to: '400cqh' },
  { from: /h-screen/g, to: 'h-[100cqh]' },
  { from: /min-h-screen/g, to: 'min-h-[100cqh]' },
  { from: /w-screen/g, to: 'w-[100cqw]' },
  { from: /min-w-screen/g, to: 'min-w-[100cqw]' }
]);
console.log("Done heights");
