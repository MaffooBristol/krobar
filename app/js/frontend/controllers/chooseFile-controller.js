App.Controller.ChooseFile = Marionette.Object.extend({
  chooseFolder: function (opts, callback) {
    this._fsExec(_.extend(opts, {nwdirectory: true}), callback);
  },
  chooseFile: function (opts, callback) {
    this._fsExec(_.extend(opts, {nwdirectory: false}), callback);
  },
  saveFile: function (opts, callback) {
    this._fsExec(_.extend(opts, {nwsaveas: opts.filename || true}), callback);
  },
  _fsExec: function (opts, callback) {
    var dir, opts = opts || {}, chooser = $('<input style="display:none;" id="fileDialog" type="file" />');
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
    chooser[0].files.append(new File("", ""))
    chooser.trigger('click');
  },
  choosePath: function (opts, callback) {
    var dir, opts = opts || {};
    var prompt = window.prompt('Choose path:', (localStorage.dir || process.env.HOME || process.env.USERPROFILE));
    if (prompt !== null) {
      localStorage.dir = dir = prompt;
    }
    if (callback) callback(dir);
  },
  initialize: function () {
    this.listenTo(App.Event, 'file:choose:folder', this.chooseFolder);
    this.listenTo(App.Event, 'file:choose:file', this.chooseFile);
    this.listenTo(App.Event, 'file:save:file', this.saveFile);
    this.listenTo(App.Event, 'file:choose:path', this.choosePath);
  }
});

new App.Controller.ChooseFile();
