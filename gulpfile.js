var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var less = require('gulp-less');
var refresh = require('gulp-livereload');
var lr = require('tiny-lr');
var server = lr();
var minifyCSS = require('gulp-minify-css');
var embedlr = require('gulp-embedlr');

gulp.task('scripts', function() {
  return gulp.src(['src/**/*.js'])
    .pipe(browserify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('build'))
    .pipe(refresh(server));
})

gulp.task('styles', function() {
  return gulp.src(['src/**/*.less'])
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(concat('app.css'))
    .pipe(gulp.dest('build'))
    .pipe(refresh(server));
});

gulp.task('lr-server', function() {
  server.listen(35729, function(err) {
    if (err) return console.log(err);
  });
})

gulp.task('html', function() {
  return gulp.src('src/**/*.html')
    .pipe(embedlr())
    .pipe(gulp.dest('build'))
    .pipe(refresh(server));
})

gulp.task('default', function() {
  gulp.run('lr-server', 'scripts', 'styles', 'html');

  gulp.watch('src/**', function(event) {
    gulp.run(['scripts', 'styles', 'html']);
  });
});