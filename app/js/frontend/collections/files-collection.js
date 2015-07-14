var glob = require('glob');
var async = require('async');
var ffmpeg = require('fluent-ffmpeg');
var id3 = require('id3js');
var watch = require('watch');

App.getFilesCollection = function (options) {

  var Collection = Backbone.Collection.extend({
    model: App.Model.File,
    initialize: function () {
      var collection = this;
      this.listenTo(App.Event, 'file:update', function (dir) {
        if (!dir || typeof dir !== 'string') return;
        watch.unwatchTree(options.dir);
        options.dir = dir;
        collection.fetch();
        watch.watchTree(options.dir, function (f, curr, prev) {
          if (!curr && !prev) return;
          var model = collection.findWhere({file: f});
          if (curr && curr.size) {
            if (!model) {
              model = collection.add(collection.mapFile(f));
            }
            collection.getMetaData(model, function (err, model) {
              // ...
            });
          }
          else {
            collection.remove(model);
          }
        });
      });
    },
    mapFile: function (file) {
      return {
        file: file,
        id: require('crypto').createHash('md5').update(file).digest('hex')
      }
    },
    fetch: function () {
      var collection = this;
      var globOpts = {
        nocase: true
      }
      glob(options.dir + '/**/*.mp3', globOpts, function (err, files) {
        if (err) {
          console.log(err);
          return alert('Error!');
        }
        files = files.map(collection.mapFile);
        collection.reset(files);
        collection.getAllMetaData();
      });
    },
    getMetaData: function (model, callback) {
      var collection = this;
      var file = model.get('file');
      id3({file: file, type: id3.OPEN_LOCAL}, function (err, data) {
        if (err) {
          console.log(err);
          return callback(err);
        }
        data.artist = data.artist !== 'undefined' && data.artist !== null ? data.artist.replace(/\0/g, '') : 'Unknown';
        data.title = data.title !== 'undefined' && data.title !== null ? data.title.replace(/\0/g, '') : 'Unknown';
        var fileFrags = model.getShortFile().split('-').map(function (c) {
          c = c.trim();
          return c.replace(path.extname(c), '').trim();
        });
        if (data.title === null || data.title === '' || data.title === undefined || data.title === 'undefined') {
          data.title = fileFrags[1];
        }
        if (data.artist === null || data.artist === '' || data.artist === undefined || data.artist === 'undefined') {
          data.title = fileFrags[1];
          data.artist = fileFrags[0];
        }
        model.set({
          tags: data,
          fullTitle: data.artist + ' - ' + data.title,
          artist: data.artist,
          title: data.title,
          key: (data.v2['initial-key'] !== undefined) ? data.v2['initial-key'] : null,
          bpm: (data.v2['bpm'] !== undefined) ? parseInt(data.v2['bpm'], 10) : null,
        });

        if (callback) callback(null, model);
      });
    },
    getAllMetaData: function () {
      var collection = this;
      var startTime = Date.now();
      async.eachLimit(collection.models, 10, function (model, callback) {
        collection.getMetaData(model, callback);
      }, function (err, asyncResults) {
        collection.calculateAverageBPM();
        App.Event.trigger('files:complete', {files: collection});
        collection.trigger('complete', collection);
      });
    },
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
