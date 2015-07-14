App.View.List = Marionette.CollectionView.extend({
  template: false,
  tagName: 'table',
  initialize: function (opts) {
    this.childView = App.View.FileListItem;
    this.listenTo(this.collection, 'complete', function () {
      App.loader(false);
    })
  },
  onRender: function () {
    if (window.initialLoading) {
      App.loader(false);
    }
    this.setStripes();
  },
  setStripes: function () {
    $('tr', this.$el).each(function (id, row) {
      if (id % 2 === 0) {
        $(row).removeClass('even').addClass('odd');
      }
      else {
        $(row).removeClass('odd').addClass('even');
      }
    });
  }
}, {
  busy: false
});
