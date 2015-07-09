App.loader = function (hasToShow, copy) {
  var $el = $('.loading');

  if (hasToShow === true && !$el.hasClass('hidden') ||
    hasToShow === false && $el.hasClass('hidden')) {
    return false;
  }

  if (hasToShow === true) {
    $el.find('.text').html(copy ? copy : 'Loading...');
  }

  $el[hasToShow === false ? 'addClass' : 'removeClass']('hidden');

  if (!hasToShow) {
    window.initialLoading = false;

    // Wait a second before removing the progressbar class.
    setTimeout(function(){
      $el.removeClass('withProgressBar').removeClass('cancellable');
      $el.find('.progress').css('width', 0.0 + '%');
    }, 1000);
  }
};

// Show by default
window.initialLoading = true;
// App.loader(true, i18n.__('loading'));
App.loader(true, 'Loading...');

jQuery(function ($) {

  // Maximise and minimise commands.
  $('.btn-os.max').on('click', function () {
    if (win.isFullscreen) {
      win.toggleFullscreen();
    }
    else {
      if (screen.availHeight <= win.height) {
        win.unmaximize();
      }
      else {
        win.maximize();
      }
    }
  });

  $('.btn-os.min').on('click', function () {
    win.minimize();
  });

  $('.btn-os.close').on('click', function () {
    win.close();
  });

  $('.btn-os.fullscreen').on('click', function () {
    win.toggleFullscreen();
    $('.btn-os.fullscreen').toggleClass('active');
  });

  App.Router.on('route', function () {
    alert('route!');
      // Ensure sidebar is hidden
      // App.sidebar.hide();
    });


});
