module.exports = function(gulp, common) {

  gulp.task('exit', 'Kill server', function() {
    setTimeout(function() {
      process.exit();
    }, 1000);
  });

};
