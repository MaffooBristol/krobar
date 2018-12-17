(function (App) {

  App.View.List = Marionette.CollectionView.extend({
    template: false,
    tagName: 'table',
    initialize (opts) {
      this.childView = App.View.FileListItem;
      this.listenTo(this.collection, 'complete', () => {
        App.loader(false);
      });
    },
    onRender () {
      if (window.initialLoading) {
        App.loader(false);
      }
      this.setStripes();
    },
    setStripes () {
      $('tr', this.$el).each((id, row) => {
        if (id % 2 === 0) {
          $(row).removeClass('even').addClass('odd');
        }
        else {
          $(row).removeClass('odd').addClass('even');
        }
      });
    },
  }, {
    busy: false,
  });

})(App);
