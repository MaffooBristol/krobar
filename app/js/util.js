var lo, Static, appRoot;

lo = require('lodash');

Static = require(__dirname + '/static.js');

module.exports = {
  getKeyIndex: function (key) {
    return lo.findIndex(Static.orders, function (o) {
      return ~o.indexOf(key);
    });
  }
}
