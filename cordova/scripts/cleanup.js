module.exports = function(context) {

  var fs = context.requireCordovaModule('fs');

  fs.mkdirSync('trash');
  try {
    fs.renameSync('www/src', 'trash/src');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

};
