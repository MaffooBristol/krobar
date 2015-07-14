App.Controller.Home = function (page) {

  App.Event.trigger('file:choose:folder', {}, function (dir) {
    if (!App.Page.Home) {
      App.Page.Home = new App.View.Page({dir: dir});
      App.Page.Home.render();
      App.Event.trigger('file:update', dir);
    }
  });

};
