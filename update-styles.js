import fs from 'fs';

let css = fs.readFileSync('WishFrame-Luxury-Experience-main/artifacts/wishframe/src/wishframe.css', 'utf-8');

// Replace *, *::before, *::after {
css = css.replace(/\*, \*\:\:before, \*\:\:after \{/g, '.wf-app *, .wf-app *::before, .wf-app *::after {');

// Replace :root {
css = css.replace(/:root \{/g, '.wf-app {');

// Replace html {
css = css.replace(/html \{/g, '.wf-app-wrapper {');

// Safely replace body {
css = css.replace(/^body \{/gm, '.wf-app {');
css = css.replace(/\{\s*body\s*\{/g, '{ .wf-app {');

fs.writeFileSync('src/templates/wishframe/styles.css', css);
console.log('Styles nicely updated.');
