let lo; let Static; let
  appRoot;

lo = require('lodash');

Static = require(`${__dirname}/static.js`);

module.exports = {
  getKeyIndex (key) {
    return lo.findIndex(Static.orders, (o) => {
      return ~o.indexOf(key);
    });
  },
  hashFilter (hash, testFunc) {
    let filtered; let key; let keys; let
      i;
    keys = Object.keys(hash); filtered = {};
    for (i = 0; i < keys.length; i++) {
      key = keys[i];
      if (testFunc(hash[key], key)) {
        filtered[key] = hash[key];
      }
    }
    return filtered;
  },
  getTrackCount (opts) {
    let trackSpliceNum = 9999;

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
  getMaxDistKey (collection) {
    let dists = this.getKeyDistData(collection);
    dists = lo.extend(dists.minor, dists.major);
    const keys = lo.keys(dists);
    return lo.maxBy(keys, (key) => {
      return dists[key];
    });
  },
  getKeyDistData (collection) {
    const dists = lo.countBy(collection.models, (model) => {
      return model.get('key');
    });

    const distData = { major: {}, minor: {} };

    lo.each(Static.orders, (order) => {
      distData.major[order[0]] = 0;
      distData.minor[order[1]] = 0;
    });

    lo.each(distData, (group, gid) => {
      lo.each(group, (dist, k) => {
        if (dists[k]) distData[gid][k] += dists[k];
      });
    });

    return distData;
  },
  getBPMDistData (collection) {
    const bpms = lo.filter(lo.compact(collection.pluck('bpm')), (bpm) => {
      return bpm > 120;
    });
    const dists = lo.countBy(bpms);
    const distData = {};

    for (let i = lo.min(bpms); i <= lo.max(bpms); i++) {
      distData[i] = dists[i] || 0;
    }

    return distData;
  },

};
