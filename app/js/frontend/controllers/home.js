App.Controller.Home = function (page) {

  // App.Event.trigger('file:choose:folder', {}, function (dir) {
    if (!App.Page.Home) {
      App.Page.Home = new App.View.Page();
      App.Page.Home.render();
      // App.Event.trigger('file:update', dir);
      // App.Event.trigger('start:process');
    }
  // });

};
