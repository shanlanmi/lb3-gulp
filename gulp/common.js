var path = require('path');
var fs = require('fs');

// 声明插件以及配置文件的依赖
var pluginsOpt = {
  pattern: [
    'gulp-*',
    'path',
    'fs',
    'shelljs',
    'js-yaml',
    'yargs',
    'request',
    'browser-sync',
    'main-bower-files',
    'through2',
    'browserify'
  ],
  rename: {
    shelljs: 'sh',
    yargs: 'argv',
    'js-yaml': 'yaml',
    'browser-sync': 'browserSync',
    'main-bower-files': 'mainBowerFiles'
  },
  postRequireTransforms: {
    argv: function (argv) {
      return argv.argv;
    },
    browserSync: function (browserSync) {
      return browserSync.create();
    }
  },
  camelize: true,
  lazy: true
};
var plugins = require('gulp-load-plugins')(pluginsOpt);
// var packageInfo = require('../package.json');
// var lib = require('./lib.js');
// var config = require('./config.js');


var common = {};
// add plugins
common.plugins = plugins;
common.plugins.path = path;
common.plugins.fs = fs;

// add veriable
common.app = {};
common.postgresAppDs = {};
common.postgresCityData = {};
common.postgresPathSourceDs = {};
common.dataSource = ["postgresAppDs", "postgresCityData", "postgresPathSourceDs"];
common.outputPath = path.resolve(__dirname, '../server/models');
common.migration = path.resolve(__dirname, './tasks/model-migrations');
common.devPM = process.env.DEV_PM;
common.productionPM = process.env.PRODUCTION_PM;
common.stagingPM = process.env.STAGING_PM;

module.exports = common;

