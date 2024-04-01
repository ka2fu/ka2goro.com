/**
 * リポジトリチェックアウト後
 *
 * $ npm install
 * Gulpの動作に必要なパッケージのインストール
 *
 * $ npx gulp
 * で実行
 */
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
// const minifyCSS = require("gulp-clean-css");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const imagemin = require("gulp-imagemin");

const paths = {
  sass: {
    src: "scss/**/{*.scss,_*.scss}",
    dest: "../css/",
    // dest: 'css/',
  },
  image: {
    src: "img/**/*.+(jpg|jpeg|png|gif|svg)",
    dest: "../img/",
    // dest: 'img/',
  },
};

const { watch, series, task, src, dest } = require("gulp");

// sassをcssに変換してautoprefixer
task("sass", function (done) {
  return src(paths.sass.src, {
    //since: gulp.lastRun(sass),
    sourcemaps: true,
  })
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: <%= error.message %>"),
      })
    )
    .pipe(
      sass({
        sass: "scss",
      })
    )
    .pipe(autoprefixer())
    .pipe(
      dest(paths.sass.dest, {
        sourcemaps: ".",
      })
    );
});

// image minified
gulp.task("imagemin", () => {
  return gulp
    .src(paths.image.src, {
      since: gulp.lastRun(imagemin),
    })
    .pipe(
      imagemin([
        imagemin.gifsicle({
          optimizationLevel: 7,
        }),
        imagemin.mozjpeg({
          optimizationLevel: 7,
        }),
        imagemin.optipng({
          optimizationLevel: 7,
        }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
            },
          ],
        }),
      ])
    )
    .pipe(gulp.dest(paths.image.dest));
});

watch([paths.sass.src], task("sass"));
watch([paths.image.src], task("imagemin"));

task("default", series("sass", "imagemin"));
