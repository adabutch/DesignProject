var gulp       =    require('gulp');
var less       =    require('gulp-less');
var watch      =    require('gulp-watch');
var notify     =    require("gulp-notify");
var plumber    =    require('gulp-plumber');
var cleanCSS   =    require('gulp-clean-css');
var rename     =    require('gulp-rename');
var header     =    require('gulp-header');
var pkg        =    require('./package.json');

/* Prepare banner text */
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * Author: <%= pkg.author.name %>',
  ' * Email: <%= pkg.author.email %>',
  ' * URL: <%= pkg.author.url %>',
  ' * v<%= pkg.version %>',
  ' */',
  ''].join('\n');

var onError = function (err) {
  notify({
    title: 'Gulp Task Error',
    message: 'Check the console.'
  }).write(err);

  console.log(err.toString());

  this.emit('end');
}

gulp.task('less', function () {
  return gulp.src('app/styles/**/*.less')
    .pipe(plumber({ errorHandle: onError }))
    .pipe(less())
    .on('error', onError)
    .pipe(gulp.dest('app/css'))
    .pipe(notify({
      title   : "Gulp'd Less",
      message : 'Styles have been compiled'
    })
    .pipe(header(banner, {pkg: pkg}))
  );
});

gulp.task('minify-css', function(){
  return gulp.src('app/css/main.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('app/css/'));
});

gulp.task('watch', function() {
  gulp.watch('**/*.less', ['less']);
});

gulp.task('default', ['watch']);

gulp.task('build', ['minify-css'])