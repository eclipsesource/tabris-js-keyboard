module.exports = function(context) {
  var fs = context.requireCordovaModule('fs');
  var cordova_util = context.requireCordovaModule('cordova-lib/src/cordova/util');
  var projectRoot = cordova_util.isCordova();
  var configXML = cordova_util.projectConfig(projectRoot);
  var data = fs.readFileSync(configXML, 'utf8');
  for (var envVar in process.env) {
    data = data.replace('$' + envVar, process.env[envVar]);
  }
  fs.writeFileSync(configXML, data, 'utf8');
};

