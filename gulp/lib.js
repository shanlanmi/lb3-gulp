module.exports = function(gulp, common) {

  var $ = common.plugins;
  var envs = ["local", "development", "staging", "production", "test"];

  return {
    afterAppLaunch: function(fn) {
      var timer = setInterval(function() {
        if (common.app) {
          clearInterval(timer);
          fn();
        }
      }, 100);
    },

    notifier: function(str) {
      try {
        var notify = require("node-notifier");
        return notify.notify(str);
      } catch (err) {
        if (err) {
          return console.info("You may want to run 'npm install node-notifier' for getting some notify.");
        }
        return null;
      }
    },

    /**
     * Read env yaml file, the direction of yaml file is "../application.yml"
     */
    getEnvYaml: function(envName) {
      var envYamlDir;
      var config;
      switch (envName) {
        case 'local':
          config = require("../server/config.local.js");
          break;
        case 'development':
          config = require("../server/config.development.js");
          break;
        case 'staging':
          config = require("../server/config.staging.js");
          break;
        case 'production':
          config = require("../server/config.production.js");
          break;
        default:
          config = require("../server/config.js");
      }
      var envYaml = false;
      var envYamlDir = $.path.resolve(__dirname, config['$applicationDir']);
      var delEnvType = function(array) {
        var output = [];
        array.forEach(function(i) {
          if (envs.indexOf(i) === -1) {
            output.push(i);
          }
        });
        return output;
      };

      var envKeys = {
        commonKeys: [],
        localKeys: [],
        developmentKeys: [],
        stagingKeys: [],
        productionKeys: []
      };
      try {
        envYaml = $.yaml.safeLoad($.fs.readFileSync(envYamlDir, 'utf8'), { json: true });
        envKeys.commonKeys = delEnvType(Object.keys(envYaml));
        envs.forEach(function (envName) {
          envKeys[envName + "Keys"] = envYaml[envName] ?
            Object.keys(envYaml[envName]) : null;
        });
      } catch (e) {
        console.error(e);
      }
      return [envYaml, envKeys];
    },

    envSeries: function(envObj, keys) {
      if (envObj && keys) {
        keys.forEach(function(key) {
          process.env[key] = envObj[key];
        });
      }
    },

    /**
     * Set environment
     */
    setEnv: function(argvEnv) {
      var envName;
      switch (argvEnv) {
        case 'l':
          envName = envs[0];
          break;
        case 'd':
          envName = envs[1];
          break;
        case 's':
          envName = envs[2];
          break;
        case 'p':
          envName = envs[3];
          break;
        default:
          envName = envs[0];
      }
      process.env.NODE_ENV = envName;
      var [envYaml, envKeys] = this.getEnvYaml(envName);
      if (envYaml) {
        this.envSeries(envYaml, envKeys.commonKeys);
        this.envSeries(envYaml[envName], envKeys[envName + "Keys"]);
      }
      console.info("Start server with >> " + envName + " << environment");
    },

    displayLog: function() {
      return function(file) {
        console.log(file.contents.toString().replace(/^.*\*{3}/, ""));
      }
    },

    displayEnv: function() {
      console.info("Start server with >> " + process.env.NODE_ENV + " << environment");
    },

    parseSchema: function(schema) {
      var columnNames = Object.keys(schema.properties);
      columnNames.forEach(function(columnName) {
        var psql =  schema.properties[columnName].postgresql;
        var column = schema.properties[columnName];
        if (!psql) return;
        // fix automigrate dataPrecision bug
        if (psql.dataType === "integer" && psql.dataPrecision) {
          delete psql.dataPrecision;
        }
        // fix automigrate ARRAY bug
        if (psql.dataType.toLowerCase() === "array") {
          if (column.type === "Number") {
            column.type =  ["Number"];
            psql.dataType =  "integer ARRAY";
          } else {
            column.type =  ["String"];
            psql.dataType = "text ARRAY";
          }
        }
        return;
      });
    },

    generateModel: function(schema, updateJs, callback) {
      var fileName =
        schema.name.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "").replace(/s$/, "");
      var jsName = common.outputPath + '/' + fileName + '.js';
      var jsonName = jsName + "on";
      var oldData;
      try {
        oldData = require(jsonName);
      } catch(err) {}
      if (oldData) {
        var oldId = oldData.properties.id || null;
        oldData.properties = schema.properties;
        delete oldData.properties.id;
        if (oldId) {
          delete oldId.dataPrecision;
          oldData.properties.id = oldId;
        }
        schema = oldData;
      }
      if (updateJs) {
        $.fs.writeFile(jsName, "module.exports = function (" + schema.name.replace(/s$/, "") +
        ") {\n\n};", function (error) {
          if (error) {
            console.log(error);
          } else {
            console.log("JS saved to " + jsName);
          }
        });
      }
      $.fs.writeFile(jsonName, JSON.stringify(schema, null, 2), function (error) {
        if (error) {
          console.log(error);
        } else {
          console.log("JSON saved to " + jsonName);
          callback();
        }
      });
    },

    afterDiscover: function(schema, updateJs, callback) {
      console.log('Auto discovery success: ' + schema.name);
      this.parseSchema(schema);
      this.generateModel(schema, updateJs, callback);
    }
  };

};
