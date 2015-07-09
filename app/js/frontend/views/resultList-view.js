App.View.ResultList = Marionette.CollectionView.extend({

  template: false,
  tagName: 'table',
  className: 'result-list',

  initialize: function (options) {

    this.childView = App.View.FileListItem;

    options = {
      preferJumps: false
    }

    this.collection = collection = App.getResultsCollection(options);

    this.listenTo(this.collection, 'reset', this.render);

    App.Event.on('files:complete', function (data) {
      var models = data.files.models;
      collection.reset(models, {silent: false});

      // firstKey = Static.orders[Math.floor(Math.random() * Static.orders.length)][Math.floor(Math.random())];
      var firstKey = 'Dm';

      collection.reset(collection.generateList(firstKey, 20).models);

      // console.log(collection.getNext(firstKey, 1));
    });
  },

  onRender: function () {
    if (window.initialLoading) {
      App.loader(false);
    }
  }

}, {
  busy: false
});
