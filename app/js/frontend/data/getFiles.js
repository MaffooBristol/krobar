(function () {

  const fs = require('fs');
  const glob = require('glob');
  const async = require('async');

  module.exports = function (path, callback) {
    glob(path, (err, files) => {
      if (err) {
        // console.error(err);
        return callback(err);
      }
      return callback(null, files);
    });
  };

})(App);
