// --------------------------------------------------------------------
// Plugins
// --------------------------------------------------------------------

var gulp       = require('gulp'),
    sass       = require('gulp-sass'),
    concat     = require('gulp-concat'),
    watch      = require('gulp-watch'),
    plumber    = require('gulp-plumber'),
    minify_css = require('gulp-minify-css'),
    uglify     = require('gulp-uglify'),
    //sourcemaps = require('gulp-sourcemaps'),
    prefix     = require('gulp-autoprefixer'),
    imagemin   = require('gulp-imagemin'),
    jshint     = require('gulp-jshint'),
    pngquant   = require('imagemin-pngquant'),
    browseSync = require('browser-sync');

// --------------------------------------------------------------------
// Settings
// --------------------------------------------------------------------

var src = {
  html: "src/*.html",
  sass: "src/sass/**/*.scss",
  js: "src/js/**/*.js",
  img: "src/img/**/*",
  fonts: "src/fonts/*"

};

var output = {
  html: "output/",
  js: "output/js",
  css: "output/css",
  img: "output/img/",
  fonts: "output/fonts/",
  min_css: 'app.min.css',
  min_js: 'app.min.js'
};

// --------------------------------------------------------------------
// Error Handling
// --------------------------------------------------------------------

var onError = function(err) {
  console.log(err);
  this.emit('end');
};

// --------------------------------------------------------------------
// Task: HTML
// --------------------------------------------------------------------

gulp.task('html', function(){
  return gulp.src(src.html)
  .pipe(plumber({
      errorHandler: onError
  }))
  .pipe(gulp.dest(output.html))
});

// --------------------------------------------------------------------
// Task: SASS
// --------------------------------------------------------------------

gulp.task('sass', function() {

  return gulp.src(src.sass)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(sass({
      includePaths: require('node-reset-scss').includePath
    }))
    .pipe(prefix('last 2 versions'))
    .pipe(concat(output.min_css))
    .pipe(gulp.dest(output.css))
    .pipe(minify_css())
    .pipe(gulp.dest(output.css))
    .pipe(browseSync.reload({
      stream: true
    }));

});


// --------------------------------------------------------------------
// Compile JS
// --------------------------------------------------------------------

gulp.task('js', function() {

  return gulp.src(src.js)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(uglify())
    .pipe(concat(output.min_js))
    .pipe(gulp.dest(output.js))

});

// --------------------------------------------------------------------
// Images
// --------------------------------------------------------------------

gulp.task('img', function() {

  return gulp.src(src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(output.img))

});

// --------------------------------------------------------------------
// Task: Fonts
// --------------------------------------------------------------------
gulp.task('fonts', function(){
  return gulp.src(src.fonts)
  .pipe(plumber({
      errorHandler: onError
  }))
  .pipe(gulp.dest(output.fonts))
});

// --------------------------------------------------------------------
// Watch
// --------------------------------------------------------------------

gulp.task('watch', function() {

  browseSync.init({
    server: './output'
  });
  gulp.watch(src.js, ['js']);
  gulp.watch(src.sass, ['sass']);
  gulp.watch(src.img, ['img']);
  gulp.watch(output.html).on('change', browseSync.reload)

});

// --------------------------------------------------------------------
// Default
// --------------------------------------------------------------------

gulp.task('default', ['watch', 'html', 'sass', 'js', 'img', 'fonts']);
