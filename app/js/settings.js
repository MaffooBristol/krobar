Settings = {

  _defaultSettings: {
    version: "0.0.1",
    connectionCheckUrl: "http://www.google.com"
  },

  setup: function (forceReset) {
    gui = require('nw.gui');
    var currentVersion = gui.App.manifest.version;
    Settings.getHardwareInfo();
  },

  get: function (variable) {
    return localStorage['settings_' + variable];
  },

  set: function (variable, newValue) {
    localStorage.setItem('settings_' + variable, newValue);
  },

  getHardwareInfo: function() {
    if (/64/.test(process.arch)) {
      Settings.set('arch', 'x64');
    }
    else {
      Settings.set('arch', 'x86');
    }

    switch (process.platform) {
      case 'darwin':
        Settings.set('os', 'mac');
        break;
      case 'win32':
        Settings.set('os', 'windows');
        break;
      case 'linux':
        Settings.set('os', 'linux');
        break;
      default:
        Settings.set('os', 'unknown');
        break;
    }
  }


};

Settings.setup();
