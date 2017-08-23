var gulp     =    require('gulp');
var less     =    require('gulp-less');
var watch    =    require('gulp-watch');
var notify   =    require("gulp-notify");
var plumber  =    require('gulp-plumber');

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
  );
});

gulp.task('watch', function() {
  gulp.watch('**/*.less', ['less']);
});

gulp.task('default', ['watch']);