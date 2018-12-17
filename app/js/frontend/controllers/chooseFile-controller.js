(function (App) {

  App.Controller.ChooseFile = Marionette.Object.extend({
    chooseFolder (opts, callback) {
      this._fsExec(_.extend(opts, { nwdirectory: true }), callback);
    },
    chooseFile (opts, callback) {
      this._fsExec(_.extend(opts, { nwdirectory: false }), callback);
    },
    saveFile (opts, callback) {
      this._fsExec(_.extend(opts, { nwsaveas: opts.filename || true }), callback);
    },
    _fsExec (opts, callback) {
      let dir; var opts = opts || {}; const
        chooser = $('<input style="display:none;" id="fileDialog" type="file" />');
      chooser.prependTo('body');
      if (opts.nwdirectory) {
        chooser.attr('nwdirectory', opts.nwdirectory);
      }
      if (opts.nwsaveas) {
        chooser.attr('nwsaveas', opts.nwsaveas);
      }
      chooser.change(function (e) {
        if ($(this).val()) {
          dir = $(this).val();
        }
        if (callback) {
          callback(dir);
          chooser.remove();
        }
      });
      chooser.trigger('click');
    },
    choosePath (opts, callback) {
      let dir; var
        opts = opts || {};
      const prompt = window.prompt('Choose path:', (localStorage.dir || process.env.HOME || process.env.USERPROFILE));
      if (prompt !== null) {
        localStorage.dir = dir = prompt;
      }
      if (callback) callback(dir);
    },
    initialize () {
      this.listenTo(App.Event, 'file:choose:folder', this.chooseFolder);
      this.listenTo(App.Event, 'file:choose:file', this.chooseFile);
      this.listenTo(App.Event, 'file:save:file', this.saveFile);
      this.listenTo(App.Event, 'file:choose:path', this.choosePath);
    },
  });

  new App.Controller.ChooseFile();

})(App);
