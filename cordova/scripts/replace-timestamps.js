module.exports = function(context) {
  var fs = context.requireCordovaModule('fs');
  var cordova_util = context.requireCordovaModule('cordova-lib/src/cordova/util');
  var projectRoot = cordova_util.isCordova();
  var configXML = cordova_util.projectConfig(projectRoot);
  var data = fs.readFileSync(configXML, 'utf8');
  var timestamp = createTimestamp();
  data = data.replace('${ANDROID_VERSION_CODE}', timestamp.substr(2));
  data = data.replace('${IOS_BUNDLE_VERSION}', timestamp);
  fs.writeFileSync(configXML, data, 'utf8');
};

function createTimestamp() {
  var date = new Date();
  var year = date.getUTCFullYear();
  var month = pad(date.getUTCMonth() + 1);
  var day = pad(date.getUTCDate());
  var hour = pad(date.getUTCHours());
  var minute = pad(date.getUTCMinutes());
  return year + month + day + hour + minute;
}

function pad(number) {
  return (number < 10 ? '0' : '') + number;
}
