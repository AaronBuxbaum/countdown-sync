var gulp = require('gulp');
var gls = require('gulp-live-server');

gulp.task('default', function() {
  var server = gls.static('src', 8000);
  server.start();
});