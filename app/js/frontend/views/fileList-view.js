App.View.ItemCount = Marionette.ItemView.extend({
  tagName: 'div',
  template: _.template('Number of items: <%= itemCount %>'),
  serializeData: function() {
    return { itemCount: this.collection.length };
  },
  initialize: function () {
    this.listenTo(this.collection, 'reset update', this.render);
  },
});

App.View.FileList = Marionette.LayoutView.extend({
  className: 'file-list',
  tagName: 'div',
  template: _.template(`
    <div id="file-list-item-count"></div>
    <div id="file-list-child">Loading...</div>
  `),
  regions: {
    itemCountRegion: '#file-list-item-count',
    childRegion: '#file-list-child',
  },
  onRender: function () {
    this.listenTo(this.collection, 'reset update', () => {
      if (this.collection.length > 0) {
        this.childRegion.show(new App.View.List({ collection: this.collection }));
        this.itemCountRegion.show(new App.View.ItemCount({ collection: this.collection }));
      }
    });
  },
});
