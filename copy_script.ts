import fs from 'fs';
import path from 'path';

const srcDir = 'euporia-temp/src/components';
const destDir = 'src/templates/euphoria/components';

fs.readdirSync(srcDir).forEach(file => {
  if (file.endsWith('.tsx') && file !== 'ThemeControls.tsx' && file !== 'EditorPanel.tsx') {
    let content = fs.readFileSync(path.join(srcDir, file), 'utf8');
    content = content.replace(/\.\.\/schema/g, '../types');
    fs.writeFileSync(path.join(destDir, file), content);
    console.log(`Copied ${file}`);
  }
});
let styles = fs.readFileSync('euporia-temp/src/index.css', 'utf8');
fs.writeFileSync('src/templates/euphoria/styles.css', styles);

let types = fs.readFileSync('euporia-temp/src/schema.ts', 'utf8');
fs.writeFileSync('src/templates/euphoria/types.ts', types);

let defaults = fs.readFileSync('euporia-temp/src/data.ts', 'utf8');
defaults = defaults.replace(/export const defaultData: EuphoriaData = /, 'export const defaults = ');
defaults = defaults.replace(/import \{ EuphoriaData \} from '\.\/schema';/, 'import { EuphoriaData } from \'./types\';');
fs.writeFileSync('src/templates/euphoria/defaults.ts', defaults);

console.log('Done!');
