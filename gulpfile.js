//Const
const { src, dest, watch, parallel, siries } = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify-es").default;
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const del = require("del");

//BrowserSync
function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
}

//Uglify JS scripts
function scripts() {
  return src(["node_modules/jquery/dist/jquery.js", "app/js/main.js"])
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

//ImageMin
function images() {
  return scr("app/images/**/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest("dist/images"));
}

//Css styles
function styles() {
  return src("app/scss/style.scss")
    .pipe(scss({ outputStyle: "compressed" })) //if we need frendly look code use "expanded"
    .pipe(concat("style.min.css"))
    .pipe(
      autoprefixer({
        overrideBrowserList: ["last 10 version"],
        grid: true,
      })
    )
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

//Build settings
function build() {
  return src(
    [
      "app/css/style.min.css",
      "app/fonts/**/*",
      "app/js/main.min.js",
      "app/*.html",
    ],
    { base: "app" }
  ).pipe(dest("dist"));
}

//Watching
function watching() {
  watch(["app/scss/**/*.scss"], styles);
  watch(["app/**/*.js", "!/app/main.min.js"], scripts); // we watch for all .js file except !/app/main.min.js

  watch(["app/*.html"]).on("change", browserSync.reload);
}

//Clean Dist function
function cleanDist() {
  return del("dist");
}

//Exports
exports.styles = styles;
exports.watching = watching;
exports.browserSync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;

//paralles
exports.default = parallel(styles, scripts, browsersync, watching);

//Build
exports.build = siries(cleanDist, images, build);
