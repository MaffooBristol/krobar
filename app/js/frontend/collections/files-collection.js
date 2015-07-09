var glob = require('glob');
var async = require('async');
var ffmpeg = require('fluent-ffmpeg');
var id3 = require('id3js');

App.getFilesCollection = function (options) {

  var Collection = Backbone.Collection.extend({
    model: App.Model.File,
    fetch: function () {
      var collection = this;
      glob(options.dir + '/**/*.mp3', function (err, files) {
        if (err) {
          console.log(err);
          return alert('Error!');
        }
        files = files.map(function (file) {
          return {
            file: file,
            id: require('crypto').createHash('md5').update(file).digest('hex')
          }
        });
        collection.reset(files);
      });
    },
    getMetaData: function () {
      var collection = this;
      var startTime = Date.now();
      async.eachLimit(collection.models, 10, function (model, callback) {
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
            bpm: (data.v2['bpm'] !== undefined) ? data.v2['bpm'] : null,
          });

          if (callback) callback();
        });
      }, function (err, asyncResults) {
        App.Event.trigger('files:complete', {files: collection});
      });
    }
  });

  return new Collection();

}
