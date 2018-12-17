module.exports = function (gui, isDebug) {
  const win = gui.Window.get();

  const menuBar = new gui.Menu({ type: 'menubar' });
  menuBar.createMacBuiltin('Krobar');

  // Add debug menu items.
  if (isDebug) {
    const developerSubmenu = new gui.Menu();
    const developerItem = new gui.MenuItem({
      label: 'Developer',
      submenu: developerSubmenu,
    });
    const debugItem = new gui.MenuItem({
      label: 'Show developer tools',
      click () {
        win.showDevTools();
      },
    });
    menuBar.append(developerItem);
    developerSubmenu.append(debugItem);
  }

  return menuBar;
};
