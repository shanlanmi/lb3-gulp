module.exports = function(gulp, common) {

  var $ = common.plugins;
  var lib = common.lib;

  function schemaCB(err, schema) {
    console.log("callback");
    if (schema) {
      console.log('Auto discovery success: ' + schema.name);
      var fileName =
        schema.name.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "").replace(/s$/, "");
      var jsName = common.outputPath + '/' + fileName + '.js';
      var jsonName = jsName + "on";
      $.fs.writeFile(jsName, "module.exports = function (" + schema.name.replace(/s$/, "") +
        ") {\n\n};", function (error) {
          if (error) {
            console.log(error);
          } else {
            console.log("JS saved to " + jsName);
          }
        });
      $.fs.writeFile(jsonName, JSON.stringify(schema, null, 2), function (error) {
        if (error) {
          console.log(error);
        } else {
          console.log("JSON saved to " + jsonName);
          gulp.start('exit');
        }
      });
    }

    if (err) {
      console.error(err);
    }
  }

  /**
   * Discover model by database's table
   */
  gulp.task('db:discover', 'Discover migrate and update datasources', function () {

    gulp.start('app');
    lib.afterAppLaunch(function() {

      if ($.argv.ds === undefined || $.argv.t === undefined) {
        return console.error('Please specify task arguments! Available arguments: --ds=ds --t=tableName');
      }
      if (common.dataSource.indexOf($.argv.ds) === -1) {
        return console.error('Data source does not exist!');
      }
      var ds = common[$.argv.ds];
      return ds.discoverSchema($.argv.t, { schema: 'public' }, schemaCB);
    });

  });
};
