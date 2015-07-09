App.Controller.Home = function (page) {


  function chooseFile(name) {
    var chooser = $(name);
    chooser.change(function (e) {
      if (!App.Page.Home) {
        App.Page.Home = new App.View.Page({dir: $(this).val()});
        App.Page.Home.render();
      }
    });
    chooser.trigger('click');
  }
  chooseFile('#fileDialog');

  // Clean up if first page
  // if (!page || page == '1'){
  //   App.Page.Home.show();
  // }

  // setTimeout(function(){
  //   fileList.constructor.busy = false;
  // }, 5000);

};
