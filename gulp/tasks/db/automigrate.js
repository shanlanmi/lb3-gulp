module.exports = function(gulp, common) {

  var $ = common.plugins;
  var lib = common.lib;

  function createTableByModelDefinition(ds, models) {
    if (models && models.length > 0) {
      return ds.automigrate(models, function (err) {
        if (err) return console.error(err);
        console.log('Congratulation, auto migration completed!');
        return gulp.start('exit');
      });
    }
    return console.error('Please specify model name!');
  }

  gulp.task('db:automigrate', 'Create table by model definition', function () {

    gulp.start('app');
    lib.afterAppLaunch(function() {
      if ($.argv.ds !== undefined || $.argv.m !== undefined) {
        return console.error('Please specify task arguments! Available arguments: --ds=ds --m=model1[model2, model3...]');
      }

      if (common.dataSource.indexOf($.argv.ds) === -1) {
        return console.error('Data source does not exist!');
      }

      var ds = common[$.argv.ds];
      var models = $.argv.m.split(',');

      createTableByModelDefinition(ds, models);
      return null;
    });

  });

};
