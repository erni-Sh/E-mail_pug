const gulp = require('gulp'),
      // sass = require('gulp-sass'),
      sass = require('gulp-dart-sass'),

      browserSync = require('browser-sync').create(),
      rename = require('gulp-rename'),
      pug = require('gulp-pug'),
      autoprefixer = require('gulp-autoprefixer'),
      sourcemaps = require('gulp-sourcemaps'),
      notify = require('gulp-notify'),
      uglify = require('gulp-uglify'),
      concat = require('gulp-concat'),

      clean = require('gulp-rimraf'),
      inky = require('inky'),
      panini = require('panini'),
      inlineCss = require('gulp-inline-css'),
      base64 = require('gulp-base64-inline'),
      // base64 = require('gulp-base64'),
      // cssBase64 = require('gulp-css-base64'),
      wait = require('gulp-wait'),
      gutil = require('gutil'),
      ftp = require('vinyl-ftp');

const DIST_FOLDER = 'dist/';

gulp.task('scss', function(){
  return gulp.src('app/scss/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(wait(1500))
    // .pipe(sass({outputStyle: 'compressed', includePaths: ['node_modules']}).on('error', notify.onError({
    //     message: "Error: <%= error.message %>",
    //     title: "SASS ERROR"
    // })))
    .pipe(sass({outputStyle: 'expanded'}).on('error', notify.onError({
        message: "Error: <%= error.message %>",
        title: "SASS ERROR"
    })))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 8 versions']
      }))
    .pipe(rename({suffix: '.min'}))
    .pipe(base64())

    // for deploy
    .pipe(gulp.dest('app/css'))

    //for dev
    // .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: 'static/css'}))
    // .pipe(gulp.dest('dist/css'))
    // .pipe(browserSync.reload({stream: true}))
});

gulp.task('clean', function() {
  return gulp.src('dist/*', { read: false }).pipe(clean());
});

// gulp.task('panini', function() {
//   gulp.src('app/pages/**/*.html')
//     .pipe(panini({
//       root: 'app/pages/',
//       layouts: 'app/layouts/',
//       // partials: 'app/partials/',
//       // helpers: 'app/helpers/',
//       // data: 'app/data/'
//     }))
//     .pipe(inky())
//     .pipe(gulp.dest('dist/'));
// });

gulp.task('pug-local', function(){
  return gulp.src('app/pug/*.pug')
    .pipe(pug({pretty: true}).on('error', notify.onError({
        message: "Error: <%= error.message %>",
        title: "PUG ERROR"
    })))
    .pipe(inky())
    .pipe(base64('',{
      prefix: "",
      suffix: ""
    }))
    // for deploy
    // .pipe(inlineCss({
    //   // url: env._host,
    //   applyStyleTags: true,
    //   removeStyleTags: true,
    //   preserveMediaQueries: true,
    //   removeLinkTags: true
    // }))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
  browserSync.init({
      port: 5050,
      ui: false,
      open: false,
      notify: true,
      server: {
          baseDir: 'dist/',
          routes : {
            '/node_modules' : './node_modules'
        }
      }
  });
});

gulp.task('watch-local', function(done){
  gulp.watch('app/scss/**/*.scss', gulp.series('scss', 'pug-local'));
  gulp.watch('app/pug/**/*.pug', gulp.series('pug-local'));

  // gulp.watch(['app/{layouts,partials,helpers,data}/**/*'], [panini.refresh]);
  // gulp.watch('app/js/**/*.js', gulp.series('js'));
  done();
});

// -------------------------------------------------
gulp.task('default', gulp.series(
  'clean',
  'scss',
  'pug-local',
  // 'panini',
  'watch-local',
  'browser-sync'))