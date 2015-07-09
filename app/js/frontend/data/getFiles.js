fs    = require('fs');
glob  = require('glob');
async = require('async');

module.exports = function (path, callback) {

  glob(path, function (err, files) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    return callback(null, files);
  });

}
