var path = require('path');
var moment = require('moment');

App.getResultsCollection = function (options, filesCollection) {

  var Collection = Backbone.Collection.extend({
    model: App.Model.File,

    resetList: function () {
      this.absBlockedNum = 0;
      this.blockedNum = 0;
      this.iterationNum = 0;
      this.list = new Backbone.Collection();
    },

    initialize: function () {
      var collection = this;
      this.resetList();

      this.listenTo(App.Event, 'files:complete results:random', function (data) {
        var models = filesCollection.models;
        collection.reset(models, {silent: false});

        // firstKey = Static.orders[Math.floor(Math.random() * Static.orders.length)][Math.floor(Math.random())];
        var firstKey = App.Util.getMaxDistKey(collection);
        var trackCount = App.Util.getTrackCount(options);

        collection.reset(collection.generateList(firstKey, trackCount).models);
        collection.trigger('complete');

      });

      this.listenTo(App.Event, 'results:export', function (data) {
        collection.exportPlaylist();
      });

    },

    exportPlaylist: function () {
      var collection = this;
      var curDate = moment().format('YYYY-MM-DD--HH-mm-ss');
      var filename = 'krobar-export--' + curDate + '.m3u';
      App.Event.trigger('file:save:file', {filename: filename}, function (filename) {
        if (!filename) return;
        fs.writeFile(filename, collection.pluck('file').join('\n'), {encoding: 'utf-8'}, function () {
          alert('File written to ' + filename + '!');
        });
      });
    },

    generateList: function (firstKey, length) {
      this.resetList();
      var firstTrack = this.models.filter(function (model) {
        return model.get('key') === firstKey;
      });
      firstTrack = firstTrack[Math.floor(Math.random() * firstTrack.length)];

      this.list.add(firstTrack);
      this.getNext(firstKey, -1, length);

      this.list.reset(this.list.first(length), {silent: true});
      return this.list;
    },

    _getNextKey: function (prevKey, direction) {
      var orders = App.Static.orders;
      var keyIndex = App.Util.getKeyIndex(prevKey);
      return orders[((keyIndex + direction % orders.length) + orders.length) % orders.length][Math.round(Math.random())];
    },

    _checkAvailable: function (key) {
      var collection = this;
      var filterFunc = function (model) {
        return true;
        return _.indexOf(collection.list.pluck('id'), model.get('id')) < 0;
      }
      return this.where({key: key}).filter(filterFunc).length > 0;
    },

    getNext: function (prevKey, direction, length) {
      var collection = this;
      var direction = direction || 1;
      var length = length || Infinity;
      var orders = App.Static.orders;

      var thisKey, nextKey = this._getNextKey(prevKey, direction);

      thisKey = function () {
        if (!options.preferJumps) {
          // console.log('Not liking jumps');
          return this._checkAvailable(prevKey) ? prevKey : nextKey;
        }
        if (this._checkAvailable(nextKey)) {
          // console.log('First key choice available!', nextKey);
          return nextKey;
        }
        nextKey = this._getNextKey(prevKey, -direction);
        if (this._checkAvailable(nextKey)) {
          // console.log('Second key choice available!', nextKey);
          return nextKey;
        }
        // console.log('Just using previous :(', prevKey);
        return prevKey;
      }.bind(this)()


      var nextTrackIndex = Math.floor(Math.random() * this.where({key: thisKey}).length);
      var nextTrack = this.where({key: thisKey})[nextTrackIndex];

      if (nextTrack !== undefined && !this.list.findWhere({id: nextTrack.get('id')})) {
        this.blockedNum = 0;
        nextTrack.direction = direction > 0 ? 'Forwards' : 'Backwards';
        if (Math.abs(1 - filesCollection.avgBPM / nextTrack.get('bpm')) * 100 <= 4) {
          this.list.add(nextTrack);
        }
      }
      else {
        this.blockedNum++;
        this.absBlockedNum++;

        if (this.blockedNum > orders.length) {
          direction = direction * -1;
          this.blockedNum = 0;
        }
      }
      this.iterationNum++;
      if (this.absBlockedNum < 20 && (this.iterationNum < collection.size() * 2) && this.iterationNum <= length) {
        abc = nextTrack !== undefined ? thisKey : prevKey;
        this.getNext(abc, direction, length);
      }
    }

  });

  return new Collection;
}
