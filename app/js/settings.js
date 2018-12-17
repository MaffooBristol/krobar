Settings = {

  _defaultSettings: {
    version: '0.0.1',
    connectionCheckUrl: 'http://www.google.com',
  },

  setup (forceReset) {
    gui = require('nw.gui');
    const currentVersion = gui.App.manifest.version;
    Settings.getHardwareInfo();
  },

  get (variable) {
    return localStorage[`settings_${variable}`];
  },

  set (variable, newValue) {
    localStorage.setItem(`settings_${variable}`, newValue);
  },

  getHardwareInfo() {
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
  },

};

Settings.setup();
