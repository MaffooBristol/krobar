App.View.List = Marionette.CollectionView.extend({
  template: false,
  tagName: 'table',
  initialize: function (opts) {
    this.childView = App.View.FileListItem;
  },
  onRender: function () {
    if (window.initialLoading) {
      App.loader(false);
    }
    $('tr', this.$el).each(function (id, row) {
      if (id % 2 === 0) {
        $(row).addClass('odd');
      }
      else {
        $(row).addClass('even');
      }
    })
  }
}, {
  busy: false
});
