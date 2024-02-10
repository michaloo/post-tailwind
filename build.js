const { readFileSync, writeFileSync, readdirSync, mkdirSync } = require('node:fs');

const posthtml = require('posthtml');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const postHtmlExtend = require('posthtml-extend');


mkdirSync('dist', { recursive: true });

const htmlFiles = readdirSync('src');

console.log(htmlFiles);

htmlFiles.forEach((htmlFile) => {
  if (false === /\.html/.test(htmlFile) || true === /^_/.test(htmlFile)) {
    return null;
  }
  const html = readFileSync('src/' + htmlFile);
  const result = posthtml()
    .use(postHtmlExtend({ root: 'src' }))
    .process(html, { sync: true })
    .html

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
