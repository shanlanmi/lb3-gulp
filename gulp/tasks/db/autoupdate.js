// Solve the problem: 'column "scopes" does not exist':
// > gulp db:autoupdate --ds=ds --m=AccessToken

module.exports = function(gulp, common) {

  var $ = common.plugins;
  var lib = common.lib;

  gulp.task('db:autoupdate', 'Update datasource with model file', function () {

    gulp.start('app');
    lib.afterAppLaunch(function() {
      if (!$.argv.ds || !$.argv.m) {
        return console.error('Please specify task arguments! Available arguments: --ds=ds, --m=modelName');
      }

      if (common.dataSource.indexOf($.argv.ds) === -1) {
        return console.error('Data source does not exist!');
      }

      var ds = common[$.argv.ds];

      return ds.autoupdate($.argv.m, function (err) {
        if (err) return console.error(err);
        console.log('auto update completed!');
        return gulp.start('exit');
      });
    });

  });

};
