(function (App) {

  App.View.FileListItem = Marionette.ItemView.extend({
    tagName: 'tr',
    className: 'file',
    model: App.Model.File,
    template (model) {
      return loadTemplate('fileListItem.tpl', model);
    },

    // id: function() {
    //   return 'file-' + this.model.get('id')
    // },

    events: {
    },

    initialize () {
      this.listenTo(this.model, 'change', this.render);
    },

    onRender () {
      this.$el.find('td.cell-index').text(this.model.collection.indexOf(this.model));
      this.$el[(this.model.get('bpm') === null) ? 'addClass' : 'removeClass']('no-bpm');
      this.$el[(this.model.get('key') === null) ? 'addClass' : 'removeClass']('no-key');
    },

    serializeData() {
      return _.extend({}, this.model.attributes, {
        file: this.model.getShortFile(),
        title: this.model.getShortTitle(),
      });
    },

  });

})(App);
