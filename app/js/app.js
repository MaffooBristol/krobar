
var appRoot = './';
var isDebug = gui.App.argv.indexOf('--debug') > -1;
var win     = gui.Window.get();

var gui  = require('nw.gui');
var os   = require('os');
var path = require('path');
var fs   = require('fs');
var url  = require('url');
var i18n = require("i18n");

var isWin   = process.platform === 'win32';
var isLinux = process.platform === 'linux';
var isOSX   = process.platform === 'darwin';

var BUTTON_ORDER = ['close', 'min', 'max'];

if (isWin || isLinux) {
  BUTTON_ORDER = ['min', 'max', 'close'];
}
else if (isOSX) {
  BUTTON_ORDER = ['close', 'min', 'max'];
}

var templates = {};

var loadTemplate = function (path, opts) {
  var opts = opts || {};
  if (templates[path] !== undefined) {
    var tpl = templates[path];
  }
  else {
    var tpl = _.template(fs.readFileSync(appRoot + 'templates/' + path, 'utf-8'));
    templates[path] = tpl;
  }
  return tpl(opts);
}

// Global app skeleton for Backbone.
var App = {
  Controller: {},
  View: {},
  Model: {},
  Collection: {},
  Page: {},
  Localization: {},
  Static: require(appRoot + 'js/static.js'),
  Util: require(appRoot + 'js/util.js'),
  Event: new Backbone.Wreqr.EventAggregator()
};

//var App = new Marionette.Application();

// Render application bar icons.
$("#header").html(loadTemplate('header.tpl', {buttons: BUTTON_ORDER}));

win.menu = require(appRoot + 'js/menu.js')(gui, isDebug);

// Set the app title (for Windows mostly).
win.title = 'Krobar';

// Focus the window when the app opens.
win.focus();

// Don't allow new windows, multiple tabs, etc.
win.on('new-win-policy', function (frame, url, policy) {
  policy.ignore();
});

var preventDefault = function(e) {
  e.preventDefault();
}

// Prevent dropping files into the window
window.addEventListener("dragover", preventDefault, false);
window.addEventListener("drop", preventDefault, false);

// Prevent dragging files outside the window
window.addEventListener("dragstart", preventDefault, false);
