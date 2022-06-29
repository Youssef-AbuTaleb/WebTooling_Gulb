const { src, dest, series, parallel, watch } = require("gulp");
const htmlMin = require("gulp-htmlmin");
const conact = require("gulp-concat");
const cleanCss = require("gulp-clean-css");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const htmlreplace = require("gulp-html-replace");
const browserSync = require("browser-sync");

let globs = {
  html: "project/*.html",
  css: "project/css/**/*.css",
  js: "project/js/**/*.js",
  img: "project/pics/*",
};

function serveTask(cb) {
  browserSync({
    server: {
      baseDir: "dist",
    },
  });
  cb();
}

function optimizeHtmlFiles() {
  return src(globs.html)
    .pipe(htmlMin({ collapseWhitespace: true }))
    .pipe(
      htmlreplace({
        css: "css/style.min.css",
        js: "js/script.min.js",
      })
    )
    .pipe(dest("dist"));
}

function optimizeCssFiles() {
  return src(globs.css, { sourcemaps: true })
    .pipe(conact("style.min.css"))
    .pipe(cleanCss())
    .pipe(dest("dist/css"), { sourcemaps: "." });
}

function optimizeJsFiles() {
  return src(globs.js)
    .pipe(conact("script.min.js"))
    .pipe(terser())
    .pipe(dest("dist/js"));
}

function optimizeImgs() {
  return src(globs.img).pipe(imagemin()).pipe(dest("dist/pics"));
}

function watchTask() {
  watch(globs.html, optimizeHtmlFiles);
  watch(globs.css, optimizeCssFiles);
  watch(globs.js, optimizeJsFiles);
  watch(globs.img, optimizeImgs);
}

exports.html = optimizeHtmlFiles;
exports.css = optimizeCssFiles;
exports.js = optimizeJsFiles;
exports.img = optimizeImgs;

exports.default = series(
  parallel(optimizeHtmlFiles, optimizeCssFiles, optimizeJsFiles, optimizeImgs),
  serveTask,
  watchTask
);
