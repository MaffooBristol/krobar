App.View.FileList = Marionette.ItemView.extend({

  template: false,
  tagName: 'table',
  className: 'file-list',

  initialize: function (options) {

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

    var fileList = this;

    $.each(this.collection.models, function (index) {
      var $file = this.view.$el;
      var $currentEl = fileList.$el.find('#file-'+ this.get('id') );
      if (!$currentEl.length) {
        $file.appendTo(fileList.$el);
      }
    });

  }
}, {
  busy: false
});
