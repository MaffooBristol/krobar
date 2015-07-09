App.View.FileList = Marionette.CollectionView.extend({

  template: false,
  tagName: 'table',
  className: 'file-list',

  initialize: function (options) {

    this.childView = App.View.FileListItem;

    this.collection = App.getFilesCollection(options);

    this.collection.fetch();

    this.listenTo(this.collection, 'reset', function () {
      this.collection.getMetaData();
    });

    this.listenTo(this.collection, 'reset', this.render);
  },

  onRender: function () {
    if (window.initialLoading) {
      App.loader(false);
    }
  }

}, {
  busy: false
});
