App.getResultsCollection = function (opts) {

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
      this.listenTo(this, 'reset', function () {
        collection.avgBPM = Math.round(_.reduce(this.pluck('bpm'), function (a, b, c) {
          a = parseInt(a, 10);
          if (b === undefined || b === null) {
            return a + a / c;
          }
          b = parseInt(b, 10);
          if (Math.abs(1 - a / c / b) > 0.2 && Math.abs(1 - a / c / (b * 2)) > 0.2 && Math.abs(1 - a / c / (b / 2)) > 0.2 && c > 5) {
            return a + a / c;
          }
          return a + b;
        }) / this.size());
      });
    },

    generateList: function (firstKey, length) {
      this.resetList();
      var firstTrack = this.models.filter(function (model) {
        return model.get('key') === firstKey;
      });
      firstTrack = firstTrack[Math.floor(Math.random() * firstTrack.length)];
      this.list.add(firstTrack);

      this.getNext(firstKey, 1);

      this.list.reset(this.list.first(length), {silent: true});

      return this.list;
    },

    getNext: function (prevKey, direction) {
      var collection = this;
      var direction = direction || 1;
      var keyIndex = App.Util.getKeyIndex(prevKey);
      var orders = App.Static.orders;

      nextKey = orders[((keyIndex + direction % orders.length) + orders.length) % orders.length][Math.round(Math.random())];

      var filterFunc = function (model) {
        return _.indexOf(collection.list.pluck('id'), model.get('id')) < 0;
      }

      if (opts.preferJumps) {
        var thisKey = (this.where({key: nextKey}).filter(filterFunc).length > 0) ? nextKey : prevKey;
      }
      else {
        var thisKey = (this.where({key: prevKey}).filter(filterFunc).length > 0) ? prevKey : nextKey;
      }


      var nextTrackIndex = Math.floor(Math.random() * this.where({key: thisKey}).length);
      var nextTrack = this.where({key: thisKey})[nextTrackIndex];

      if (nextTrack !== undefined && !this.list.findWhere({id: nextTrack.get('id')})) {
        this.blockedNum = 0;
        nextTrack.direction = direction > 0 ? 'Forwards' : 'Backwards';
        if (Math.abs(1 - collection.avgBPM / nextTrack.get('bpm')) * 100 <= 4) {
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
      if (this.absBlockedNum < 100 && this.iterationNum++ < collection.size() * 10) {
        abc = nextTrack !== undefined ? thisKey : prevKey;
        this.getNext(abc);
      }
    }

  });

  return new Collection;
}
