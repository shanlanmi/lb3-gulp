var gulp = require('gulp-help')(require('gulp'), {
  description: 'Display this help text.',
  hideDepsMessage: true
});
var fs = require('fs');
var common = require('./gulp/common.js');

// Load lib
var lib = require('./gulp/lib.js');
common.lib = lib(gulp, common);
common.lib.setEnv(common.plugins.argv.env);

// Load tasks
var taskPath = 'gulp/tasks';
var taskClass = [];
var loadTask = function(dir) {
  fs.readdirSync(dir).filter(function (file) {
    return file.match(/js$/);
  }).forEach(function (fileName) {
    require('./' + dir + '/' + fileName)(gulp, common);
  });
};
var discoverFolder = function() {
  return fs.readdirSync(taskPath).filter(function (file) {
    if (!file.match(/\./)) {
      return file;
    }
    return null;
  });
};
taskClass = discoverFolder();

loadTask(taskPath);
taskClass.forEach(function(filename) {
  loadTask(taskPath + '/' + filename);
});
