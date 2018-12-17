var path = require('path');
// var glob = require('glob');
// var async = require('async');
// var ffmpeg = require('fluent-ffmpeg');
// var id3 = require('id3js');
// var watch = require('watch');
var xml = require('xml2js');

require('dotenv').config({ path: `${path.resolve()}/.env` });

App.getFilesCollection = function (options) {

  var Collection = Backbone.Collection.extend({

    model: App.Model.File,

    initialize: function () {

      this.fetchTraktorCollection((err) => {
        this.calculateAverageBPM();
        App.Event.trigger('files:complete', { files: this });
        this.trigger('complete', this);
      });

      // var collection = this;
      // this.listenTo(App.Event, 'file:update', function (dir) {
      //   if (!dir || typeof dir !== 'string') return;
      //   watch.unwatchTree(options.dir);
      //   options.dir = dir;
      //   watch.watchTree(options.dir, function (f, curr, prev) {
      //     if (!curr && !prev) return;
      //     var model = collection.findWhere({file: f});
      //     if (curr && curr.size) {
      //       if (!model) {
      //         model = collection.add(collection.mapFile(f));
      //       }
      //       collection.getMetaData(model, function (err, model) {
      //         // ...
      //       });
      //     }
      //     else {
      //       collection.remove(model);
      //     }
      //   });
      // });
    },
    mapTraktorEntry: function (entry) {
      const file = path.join(entry.LOCATION[0].$.DIR.replace(/:/gi,'').replace(/\/+$/gi, ''), entry.LOCATION[0].$.FILE);
      return {
        type: 'traktor',
        id: entry.$.AUDIO_ID,
        artist: entry.$.ARTIST,
        title: entry.$.TITLE,
        key: entry.INFO !== undefined ? entry.INFO[0].$.KEY : null,
        bpm: entry.TEMPO !== undefined ? entry.TEMPO[0].$.BPM : null,
        rating: entry.INFO !== undefined && entry.INFO[0].$.RANKING !== undefined ? entry.INFO[0].$.RANKING / 51 : 0,
        playtime: entry.INFO !== undefined ? entry.INFO[0].$.PLAYTIME : null,
        loudness: entry.LOUDNESS !== undefined ? entry.LOUDNESS[0].$.ANALYZED_DB : null,
        release_date: entry.INFO !== undefined ? entry.INFO[0].$.RELEASE_DATE : '1970/01/01',
        file,
      };
    },
    filterTraktorEntry: function (entry) {
      const criteria = [
        entry.rating >= 3,// || entry.rating === 0,
        entry.bpm >= 170 && entry.bpm <= 180,
        entry.playtime > 240 && entry.playtime < 540,
        entry.loudness < 5,
        entry.key !== undefined,
        entry.release_date && entry.release_date.split('/')[0] >= 2008,
      ];
      let success = true;
      criteria.forEach((a) => {
        if (!a) {
          success = false;
        }
      });
      return success;
    },
    sortTraktorEntry: function (a, b) {
      return 0;
      return a.loudness - b.loudness;
    },
    fetchTraktorCollection: function (callback) {
      const traktorCollection = process.env.TRAKTOR_PATH;
      if (traktorCollection === undefined) {
        throw new Error('Please specify TRAKTOR_PATH in .env file... this will be fixed');
      }
      fs.readFile(traktorCollection, 'utf-8', (err, xmlData) => {
        xml.parseString(xmlData, (err, result) => {
          if (err) {
            throw err;
          }
          const entries = result.NML.COLLECTION[0].ENTRY
            .map(this.mapTraktorEntry)
            .filter(this.filterTraktorEntry)
            .sort(this.sortTraktorEntry);
          this.reset(entries);
          setTimeout(callback, 0);
        });
      });
      return;
    },
    // mapFile: function (file) {
    //   return {
    //     file: file,
    //     id: require('crypto').createHash('md5').update(file).digest('hex'),
    //   }
    // },
    // fetch: function () {
    //   var collection = this;
    //   var globOpts = {
    //     nocase: true,
    //   };
    //   glob(options.dir + '/**/*.mp3', globOpts, function (err, files) {
    //     if (err) {
    //       console.log(err);
    //       return alert('Error!');
    //     }
    //     files = files.map(collection.mapFile);
    //     collection.reset(files);
    //     collection.getAllMetaData();
    //   });
    // },
    // getMetaData: function (model, callback) {
    //   var collection = this;
    //   var file = model.get('file');
    //   id3({ type: id3.OPEN_LOCAL, file }, function (err, data) {
    //     if (err) {
    //       console.log(err);
    //       return callback(err);
    //     }
    //     data.artist = data.artist !== 'undefined' && data.artist !== null ? data.artist.replace(/\0/g, '') : 'Unknown';
    //     data.title = data.title !== 'undefined' && data.title !== null ? data.title.replace(/\0/g, '') : 'Unknown';
    //     var fileFrags = model.getShortFile().split('-').map(function (c) {
    //       c = c.trim();
    //       return c.replace(path.extname(c), '').trim();
    //     });
    //     if (data.title === null || data.title === '' || data.title === undefined || data.title === 'undefined') {
    //       data.title = fileFrags[1];
    //     }
    //     if (data.artist === null || data.artist === '' || data.artist === undefined || data.artist === 'undefined') {
    //       data.title = fileFrags[1];
    //       data.artist = fileFrags[0];
    //     }
    //     model.set({
    //       tags: data,
    //       fullTitle: data.artist + ' - ' + data.title,
    //       artist: data.artist,
    //       title: data.title,
    //       key: (data.v2['initial-key'] !== undefined) ? data.v2['initial-key'] : null,
    //       bpm: (data.v2['bpm'] !== undefined) ? parseInt(data.v2['bpm'], 10) : null,
    //     });

    //     if (callback) callback(null, model);
    //   });
    // },
    // getAllMetaData: function () {
    //   var collection = this;
    //   var startTime = Date.now();
    //   async.eachLimit(collection.models, 10, function (model, callback) {
    //     collection.getMetaData(model, callback);
    //   }, function (err, asyncResults) {
    //     collection.calculateAverageBPM();
    //     App.Event.trigger('files:complete', {files: collection});
    //     collection.trigger('complete', collection);
    //   });
    // },
    calculateAverageBPM: function () {
      var collection = this;
      var bpms = _.compact(this.pluck('bpm'));
      collection.avgBPM = Math.round(_.reduce(bpms, function (a, b, c) {
        a = parseInt(a, 10);
        if (b === undefined || b === null) {
          return a + a / c;
        }
        b = parseInt(b, 10);
        if (
          Math.abs(1 - a / c / b) > 0.2
          // && Math.abs(1 - a / c / (b * 2)) > 0.2
          // && Math.abs(1 - a / c / (b / 2)) > 0.2
          // && c > 5
        ) {
          return a + a / c;
        }
        return a + b;
      }) / bpms.length);
    }
  });

  return new Collection();

}
