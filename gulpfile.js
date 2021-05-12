const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const server = require('browser-sync').create();
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const del = require('del');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const pug = require('gulp-pug');
const cached = require('gulp-cached');
const gcmq = require('gulp-group-css-media-queries');

const pugToHtml = () => {
  return gulp.src('source/pug/pages/*.pug')
      .pipe(plumber())
      .pipe(pug({ pretty: true }))
      .pipe(cached('pug'))
      .pipe(gulp.dest('build'));
};

const css = () => {
  return gulp.src('source/sass/style.scss')
      .pipe(plumber())
      .pipe(sourcemap.init())
      .pipe(sass())
      .pipe(postcss([autoprefixer({
        grid: true,
      })]))
      .pipe(gcmq()) // выключите, если в проект импортятся шрифты через ссылку на внешний источник
      .pipe(gulp.dest('build/css'))
      .pipe(csso())
      .pipe(rename('style.min.css'))
      .pipe(sourcemap.write('.'))
      .pipe(gulp.dest('build/css'))
      .pipe(server.stream());
};

const js = () => {
  return gulp.src(['source/js/main.js'])
      .pipe(webpackStream(webpackConfig))
      .pipe(gulp.dest('build/js'))
};

const svgo = () => {
  return gulp.src('source/img/**/*.{svg}')
      .pipe(imagemin([
        imagemin.svgo({
            plugins: [
              {removeViewBox: false},
              {removeRasterImages: true},
              {removeUselessStrokeAndFill: false},
            ]
          }),
      ]))
      .pipe(gulp.dest('source/img'));
};

const sprite = () => {
  return gulp.src('source/img/sprite/*.svg')
      .pipe(svgstore({inlineSvg: true}))
      .pipe(rename('sprite_auto.svg'))
      .pipe(gulp.dest('build/img'));
};

const syncserver = () => {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch('source/pug/**/*.pug', gulp.series(pugToHtml, refresh));
  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series(css));
  gulp.watch('source/js/**/*.{js,json}', gulp.series(js, refresh));
  gulp.watch('source/data/**/*.{js,json}', gulp.series(copy, refresh));
  gulp.watch('source/img/**/*.svg', gulp.series(copysvg, sprite, pugToHtml, refresh));
  gulp.watch('source/img/**/*.{png,jpg}', gulp.series(copypngjpg, pugToHtml, refresh));

  gulp.watch('source/favicon/**', gulp.series(copy, refresh));
  gulp.watch('source/video/**', gulp.series(copy, refresh));
  gulp.watch('source/downloads/**', gulp.series(copy, refresh));
  gulp.watch('source/*.php', gulp.series(copy, refresh));
};

const refresh = (done) => {
  server.reload();
  done();
};

const copysvg = () => {
  return gulp.src('source/img/**/*.svg', {base: 'source'})
      .pipe(gulp.dest('build'));
};

const copypngjpg = () => {
  return gulp.src('source/img/**/*.{png,jpg}', {base: 'source'})
      .pipe(gulp.dest('build'));
};

const copy = () => {
  return gulp.src([
    'source/fonts/**',
    'source/img/**',
    'source/data/**',
    'source/favicon/**',
    'source/video/**', // git искажает видеофайлы, некоторые шрифты, pdf и gif - проверяйте и если обнаруживаете баги - скидывайте тестировщику такие файлы напрямую
    'source/downloads/**',
    'source/*.php',
  ], {
    base: 'source',
  })
      .pipe(gulp.dest('build'));
};

const clean = () => {
  return del('build');
};

const build = gulp.series(clean, svgo, copy, css, sprite, js, pugToHtml);

const start = gulp.series(build, syncserver);

// Optional tasks
//---------------------------------

const createWebp = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
      .pipe(webp({quality: 90}))
      .pipe(gulp.dest('source/img'));
};

const optimizeImages = () => {
  return gulp.src('build/img/**/*.{png,jpg}')
      .pipe(imagemin([
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
      ]))
      .pipe(gulp.dest('build/img'));
};

exports.build = build;
exports.start = start;
exports.webp = createWebp;
exports.imagemin = optimizeImages;
