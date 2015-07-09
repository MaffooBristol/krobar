App.View.Page = Marionette.LayoutView.extend({
  // className: 'page',

  template: function (model) {
    return loadTemplate('pageLayout.tpl', model);
  },

  // el: '#page',

  tagName: 'div',
  className: 'page',

  regions: {
    fileListRegion: '#file-list',
    resultListRegion: '#result-list'
  },

  onRender: function () {
    // $('.' + this.className).remove();
    this.$el.appendTo('section.container');
    // $('<table class="file-list"></table>').appendTo(this.$el);
    this.fileListRegion.show(new App.View.FileList({dir: this.options.dir}));

    this.resultListRegion.show(new App.View.ResultList({}));
  },

  show: function () {
  }
});
