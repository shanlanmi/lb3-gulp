/* usage example:
 * @ `gulp --env=l`: node app as environment is local(default)
 * @ `gulp --env=d`: node app as environment is development
 * @ `gulp --env=s`: node app as environment is staging
 * @ `gulp --env=p`: node app as environment is production
 *
 * @ `gulp --env={env} -m`: nodemon app as environment is {local}
 */

module.exports = function (gulp, common) {

  var $ = common.plugins;
  var lib = common.lib;

  gulp.task('default', 'Run server', function () {
    var opt = {
      script: 'server/server.js',
      ext: 'js json',
      ignore: ['gulpfile.js', 'ignored.js', 'arc-manager.json', './gulp', './server/app/public', './server/views'],
    };
    if ($.argv.m) {
      var stream = $.nodemon(opt);
      stream
        .on('restart', function () {
          setTimeout(function () {
            lib.notifier('Restart node!');
          }, 3500);
        })
        .on('crash', function () {
          console.error('Application has crashed!\n');
          stream.emit('restart', 10);  // restart the server in 10 seconds
        });
    } else {
      var cmd = 'node .';
      $.sh.exec(cmd);
    }

  });
};
