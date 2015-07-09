var path = require('path');

App.Model.File = Backbone.Model.extend({

  defaults: {
    title: false,
    tags: {},
    key: null,
    bpm: null
  },

  buildBasicView: function () {

    var model = this;

    model.view = new App.View.FileListItem({
      model: model
    });

    model.on('change', function () {
      model.view.render();
    });

  },

  getShortFile: function() {
    return path.basename(this.get('file'));
  },

  getShortTitle: function () {
    var title = this.get('title');
    if (!title || title.length < 40) return title;
    return title.substring(0, 40) + "&hellip;";
  },

  initialize: function () {
    this.buildBasicView();
  }

});
