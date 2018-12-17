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
        collection.reset(models, { silent: false });

        var firstKey = App.Util.getMaxDistKey(collection);
        var trackCount = App.Util.getTrackCount(options);

        collection.generateList(firstKey, trackCount);

        collection.reset(this.list.models);
        collection.trigger('complete');

        // var bestCollection = new Backbone.Collection({});

        // for (var i = 0; i < 1; i++) {
        //   // firstKey = App.Static.orders[Math.floor(Math.random() * App.Static.orders.length)][Math.floor(Math.random())];
        //   var newCollection = collection.generateList(firstKey, trackCount);
        //   if (newCollection.length > bestCollection.length) {
        //     bestCollection = newCollection;
        //   }
        // };
        // collection.reset(bestCollection.models);
        // collection.trigger('complete');

      });

      this.listenTo(App.Event, 'results:export', function (data) {
        collection.exportPlaylist();
      });

    },

    exportPlaylist: function () {
      var collection = this;
      var curDate = moment().format('YYYY-MM-DD--HH-mm-ss');
      var filename = 'krobar-export--' + curDate + '.m3u';
      App.Event.trigger('file:save:file', { filename }, function (filename) {
        if (!filename) return;
        fs.writeFile(filename, collection.pluck('file').join('\n'), { encoding: 'utf-8' }, function () {
          alert('File written to ' + filename + '!');
        });
      });
    },

    getKeyIndex: (track) => {
      return App.Static.orders.findIndex((x) => {
        return x[0] === track.get('key') || x[1] === track.get('key');
      });
    },

    generateList: function (firstKey, length) {
      this.resetList();

      const sortedTracks = this.models.sort((a, b) => {
        const aIndex = this.getKeyIndex(a);
        const bIndex = this.getKeyIndex(b);
        return aIndex - bIndex;
      });

      const mappedTracks = sortedTracks.map((track, index) => {
        const next = sortedTracks[index + 1];
        track.set('gap', (next !== undefined && Math.abs(this.getKeyIndex(track) - this.getKeyIndex(next)) > 1));
        return track;
      });

      this.list.reset(mappedTracks);

      return this.list;

      // var firstTrack = this.models.filter(function (model) {
      //   return model.get('key') === firstKey;
      // });
      // firstTrack = firstTrack[Math.floor(Math.random() * firstTrack.length)];

      // this.list.add(firstTrack);
      // this.getNext(firstKey, -1, length);

      // this.list.reset(this.list.first(length), {silent: true});
      // return this.list;
    },

    // _getNextKey: function (prevKey, direction) {
    //   var orders = App.Static.orders;
    //   var keyIndex = App.Util.getKeyIndex(prevKey);
    //   return orders[((keyIndex + direction % orders.length) + orders.length) % orders.length][Math.round(Math.random())];
    // },

    // _checkAvailable: function (key) {
    //   var collection = this;
    //   var filterFunc = function (model) {
    //     return true;
    //     return _.indexOf(collection.list.pluck('id'), model.get('id')) < 0;
    //   }
    //   return this.where({ key: key }).filter(filterFunc).length > 0;
    // },

    // getNext: function (prevKey, direction = 1, length = Infinity) {
    //   const collection = this;
    //   const orders = App.Static.orders;

    //   let stayOnCurrentKeyChance = 0.5;
    //   if (length < 10) {
    //     stayOnCurrentKeyChance = 0.3;
    //   }

    //   var thisKey, nextKey = this._getNextKey(prevKey, direction);

    //   thisKey = function () {
    //     if (!options.allowJumps) {
    //       // console.log('Not liking jumps');
    //       if (this._checkAvailable(prevKey)) {
    //         return prevKey;
    //       }
    //     }
    //     if (Math.random() < stayOnCurrentKeyChance && this._checkAvailable(prevKey)) {
    //       console.log(`Triggered staying on current, which is ${prevKey}`);
    //       return prevKey;
    //     }
    //     if (this._checkAvailable(nextKey)) {
    //       console.log(`First key choice available! Moving to ${nextKey}`);
    //       return nextKey;
    //     }
    //     nextKey = this._getNextKey(prevKey, 0 - direction);
    //     if (this._checkAvailable(nextKey)) {
    //       console.log(`Second key choice available! Moving to ${nextKey}`);
    //       return nextKey;
    //     }
    //     console.log(`Just using previous :(, which is ${prevKey}`);
    //     return prevKey;
    //   }.bind(this)();

    //   var nextTrackIndex = Math.floor(Math.random() * this.where({ key: thisKey }).length);
    //   var nextTrack = this.where({ key: thisKey })[nextTrackIndex];

    //   if (nextTrack !== undefined && !this.list.findWhere({ id: nextTrack.get('id') })) {
    //     this.blockedNum = 0;
    //     nextTrack.direction = direction > 0 ? 'Forwards' : 'Backwards';
    //     if (Math.abs(1 - filesCollection.avgBPM / nextTrack.get('bpm')) * 100 <= 4) {
    //       console.log(`Using ${nextTrack.get('title')}`);
    //       this.list.add(nextTrack);
    //     }
    //   }
    //   else {
    //     this.blockedNum++;
    //     this.absBlockedNum++;

    //     if (this.blockedNum > orders.length) {
    //       direction = direction * -1;
    //       this.blockedNum = 0;
    //     }
    //   }
    //   this.iterationNum++;
    //   if (this.absBlockedNum < 20 && (this.iterationNum < collection.size() * 2) && this.iterationNum <= length) {
    //     abc = nextTrack !== undefined ? thisKey : prevKey;
    //     this.getNext(abc, direction, length);
    //   }
    // }

  });

  return new Collection;
}
