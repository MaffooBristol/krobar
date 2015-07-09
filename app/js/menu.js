module.exports = function (gui, isDebug) {

  var win = gui.Window.get();

  var menuBar = new gui.Menu({type: "menubar"});
  menuBar.createMacBuiltin("Krobar");

  // Add debug menu items.
  if (isDebug) {
    var developerSubmenu = new gui.Menu();
    var developerItem = new gui.MenuItem({
      label: 'Developer',
      submenu: developerSubmenu
    });
    var debugItem = new gui.MenuItem({
      label: 'Show developer tools',
      click: function () {
        win.showDevTools();
      }
    });
    menuBar.append(developerItem);
    developerSubmenu.append(debugItem);
  }

  return menuBar;

}
