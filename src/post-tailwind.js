#!/usr/bin/env node

const { readFileSync, writeFileSync, readdirSync, mkdirSync, copyFileSync } = require('node:fs');

const yargs = require('yargs');
const posthtml = require('posthtml');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const postHtmlExtend = require('posthtml-extend');





yargs
  .scriptName("post-tailwind")
  .usage('$0 <cmd> [args]')
  .command('init [dir]', 'Initialize new PostTailwind project in selected directory', (yargs) => {
    yargs.positional('dir', {
      type: 'string',
      default: '.',
      describe: 'directory'
    })
  }, (argv) => {
    const directory = process.cwd() + '/' + argv.dir;
    mkdirSync(directory + '/src', { recursive: true });
    copyFileSync('template/src/_base.html', directory + '/src/_base.html');
    copyFileSync('template/src/index.html', directory + '/src/index.html');
    copyFileSync('template/src/main.css', directory + '/src/main.css');
    copyFileSync('template/postcss.config.js', directory + '/postcss.config.js');
    copyFileSync('template/tailwind.config.js', directory + '/tailwind.config.js');
  })
  .command('build', 'Build static files from `src` to `dist`', (argv) => {
    const srcDirectory = 'src';
    mkdirSync('dist', { recursive: true });
    const htmlFiles = readdirSync(srcDirectory);
    htmlFiles.forEach((htmlFile) => {
      if (false === /\.html/.test(htmlFile) || true === /^_/.test(htmlFile)) {
        return null;
      }
      const html = readFileSync(srcDirectory + '/' + htmlFile);
      const result = posthtml()
        .use(postHtmlExtend({ root: srcDirectory }))
        .process(html, { sync: true })
        .html

      writeFileSync('dist/' + htmlFile, result);
    });
    const css = readFileSync(srcDirectory + '/main.css')
    postcss([tailwindcss])
      .process(css, { from: srcDirectory + '/main.css', to: 'dist/main.css' })
      .then(result => {
        writeFileSync('dist/main.css', result.css)
        if ( result.map ) {
          writeFileSync('dist/main.css.map', result.map.toString())
        }
      });
  })
  .help()
  .argv
