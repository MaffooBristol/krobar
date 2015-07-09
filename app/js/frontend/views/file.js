App.View.FileListItem = Marionette.ItemView.extend({
  tagName: 'tr',
  className: 'file',
  model: App.Model.File,
  template: function (model) {
    return loadTemplate('fileListItem.tpl', model)
  },

  id: function() {
    return 'file-' + this.model.get('id')
  },

  events: {
  },

  initialize: function () {
  },

  serializeData: function() {
    return _.extend({}, this.model.attributes, {
      file: this.model.getShortFile(),
      title: this.model.getShortTitle()
    });
  }

});
