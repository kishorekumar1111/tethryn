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
