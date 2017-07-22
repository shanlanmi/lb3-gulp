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

var common = {};
// add plugins
common.plugins = plugins;
common.plugins.path = path;
common.plugins.fs = fs;

// add veriable
common.app = {};
common.ds = {};
common.dataSource = ["ds"];
common.outputPath = path.resolve(__dirname, '../server/models');

module.exports = common;

