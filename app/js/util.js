var lo, Static, appRoot;

lo = require('lodash');

Static = require(__dirname + '/static.js');

module.exports = {
  getKeyIndex: function (key) {
    return lo.findIndex(Static.orders, function (o) {
      return ~o.indexOf(key);
    });
  },
  hashFilter: function (hash, testFunc) {
    var filtered, key, keys, i;
    keys = Object.keys(hash); filtered = {};
    for (i = 0; i < keys.length; i++) {
      key = keys[i];
      if (testFunc(hash[key], key)) {
        filtered[key] = hash[key];
      }
    }
    return filtered;
  },
  getTrackCount: function (opts) {
    var trackSpliceNum = 9999;

    if (opts.mixSpeed === 'very slow') {
      trackSpliceNum = Math.ceil(opts.mixLength / 5);
    }
    else if (opts.mixSpeed === 'slow') {
      trackSpliceNum = Math.ceil(opts.mixLength / 4);
    }
    else if (opts.mixSpeed === 'medium') {
      trackSpliceNum = Math.ceil(opts.mixLength / 3);
    }
    else if (opts.mixSpeed === 'fast') {
      trackSpliceNum = Math.ceil(opts.mixLength / 2);
    }

    return trackSpliceNum;
  },
  getMaxDistKey: function (collection) {
    var dists = this.getKeyDistData(collection);
    dists = lo.extend(dists.minor, dists.major);
    var keys = lo.keys(dists);
    return lo.max(keys, function (key) {return dists[key] });
  },
  getKeyDistData: function (collection) {
    var dists = lo.countBy(collection.models, function (model) {
      return model.get('key');
    });

    var distData = {major: {}, minor: {}};

    lo.each(Static.orders, function (order) {
      distData.major[order[0]] = 0;
      distData.minor[order[1]] = 0;
    });

    lo.each(distData, function (group, gid) {
      lo.each(group, function (dist, k) {
        if (dists[k]) distData[gid][k] += dists[k];
      });
    });

    return distData;
  },
  getBPMDistData: function (collection) {
    var bpms = lo.filter(lo.compact(collection.pluck('bpm')), function (bpm) { return bpm > 120});
    var dists = lo.countBy(bpms);
    var distData = {};

    for (var i = lo.min(bpms); i <= lo.max(bpms); i++) {
      distData[i] = dists[i] || 0;
    }

    return distData;
  }

}
