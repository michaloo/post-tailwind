const { readFileSync, writeFileSync, readdirSync, mkdirSync } = require('node:fs');

const postcss = require('postcss');
const nunjucks = require('nunjucks')
const tailwindcss = require('tailwindcss');


mkdirSync('dist', { recursive: true });

const htmlFiles = readdirSync('src');

console.log(htmlFiles);

htmlFiles.forEach(async (htmlFile) => {
  if (false === /\.html/.test(htmlFile) || true === /^_/.test(htmlFile)) {
    return null;
  }
  const html = readFileSync('src/' + htmlFile);
  nunjucks.configure('src', { autoescape: true, trimBlocks: true, lstripBlocks: true });
  const result = nunjucks.renderString(html.toString());
  writeFileSync('dist/' + htmlFile, result);
});



const css = readFileSync('src/main.css')
postcss([tailwindcss])
  .process(css, { from: 'src/main.css', to: 'dist/main.css' })
  .then(result => {
    writeFileSync('dist/main.css', result.css)
    if ( result.map ) {
      writeFileSync('dist/main.css.map', result.map.toString())
    }
  });
