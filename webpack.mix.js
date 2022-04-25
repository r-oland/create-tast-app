const mix = require('laravel-mix');
const path = require('path');
require('laravel-mix-react-css-modules');
require('laravel-mix-react-typescript-extension');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.webpackConfig({
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'resources/assets'),
    ],
  },
  // Framer motion fix: https://github.com/framer/motion/issues/1307
  module: {
    rules: [
      {
        type: 'javascript/auto',

        test: /\.mjs$/,

        include: /node_modules/,
      },
    ],
  },
});

mix.options({
  terser: {
    terserOptions: {
      keep_classnames: true,
      mangle: false,
    },
  },
});

mix.sass('resources/empty.scss', 'public/empty.css');

if (mix.inProduction()) {
  mix
    .reactTypeScript('resources/assets/app.js', 'public/js')
    .reactCSSModules()
    .version()
    .sourceMaps(true);
} else {
  mix
    .reactTypeScript('resources/assets/app.js', 'public/js')
    .reactCSSModules()
    .browserSync({
      proxy: 'create-tast-app.test',
    })
    .sourceMaps(true);
}
