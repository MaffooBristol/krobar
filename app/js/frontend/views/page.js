App.View.Page = Marionette.LayoutView.extend({
  // className: 'page',

  template: function (model) {
    return loadTemplate('pageLayout.tpl', model);
  },

  // el: '#page',

  tagName: 'div',
  className: 'page',

  regions: {
    fileListRegion: '#file-list'
  },

  onRender: function () {
    // $('.' + this.className).remove();
    this.$el.appendTo('section.container');
    // $('<table class="file-list"></table>').appendTo(this.$el);
    var fileList = new App.View.FileList({});
    this.fileListRegion.show(fileList);
  },

  show: function () {
  }
});
