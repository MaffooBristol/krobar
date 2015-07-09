App.Controller.Home = function (page) {

  if (!App.Page.Home) {
    App.Page.Home = new App.View.Page({
    });
    App.Page.Home.render();
  }

  // Clean up if first page
  // if (!page || page == '1'){
  //   App.Page.Home.show();
  // }

  // setTimeout(function(){
  //   fileList.constructor.busy = false;
  // }, 5000);

};
