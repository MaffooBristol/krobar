
const appRoot = './';

const gui = require('nw.gui');
const os = require('os');
const path = require('path');
const fs = require('fs');
const url = require('url');
const i18n = require('i18n');

const isWin = process.platform === 'win32';
const isLinux = process.platform === 'linux';
const isOSX = process.platform === 'darwin';

const isDebug = gui.App.argv.indexOf('--debug') > -1;
const win = gui.Window.get();

let BUTTON_ORDER = ['close', 'min', 'max'];
if (isWin || isLinux) {
  BUTTON_ORDER = ['min', 'max', 'close'];
}

const templates = {};

const loadTemplate = function (path, opts) {
  var opts = opts || {};
  let tpl;
  if (templates[path] !== undefined) {
    tpl = templates[path];
  }
  else {
    tpl = _.template(fs.readFileSync(`${appRoot}templates/${path}`, 'utf-8'));
    templates[path] = tpl;
  }
  return tpl(opts);
};

// Global app skeleton for Backbone.
const App = {
  Controller: {},
  View: {},
  Model: {},
  Collection: {},
  Page: {},
  Localization: {},
  Static: require(`${appRoot}js/static.js`),
  Util: require(`${appRoot}js/util.js`),
  Event: new Backbone.Wreqr.EventAggregator(),
};

// var App = new Marionette.Application();

// Render application bar icons.
$('#header').html(loadTemplate('header.tpl', { buttons: BUTTON_ORDER }));

win.menu = require(`${appRoot}js/menu.js`)(gui, isDebug);

// Set the app title (for Windows mostly).
win.title = 'Krobar';

// Focus the window when the app opens.
win.focus();

// Don't allow new windows, multiple tabs, etc.
win.on('new-win-policy', (frame, url, policy) => {
  policy.ignore();
});

const preventDefault = function(e) {
  e.preventDefault();
};

// Prevent dropping files into the window
window.addEventListener('dragover', preventDefault, false);
window.addEventListener('drop', preventDefault, false);

// Prevent dragging files outside the window
window.addEventListener('dragstart', preventDefault, false);
