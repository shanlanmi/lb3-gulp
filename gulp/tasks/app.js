module.exports = function(gulp, common) {

  var $ = common.plugins;

  gulp.task('app', 'Lauch app for running task', function() {
    common.app = require($.path.resolve(__dirname, '../../server/server'));
    // need be definded database below
    common.ds = common.app.dataSources.ds;
    setTimeout(function() {
      process.exit();
    }, 10000);
  });

};
