(function (App) {

  App.loader = function (hasToShow, copy) {
    const $el = $('.loading');

    if (hasToShow === true && !$el.hasClass('hidden')
      || hasToShow === false && $el.hasClass('hidden')) {
      return false;
    }

    if (hasToShow === true) {
      $el.find('.text').html(copy || 'Loading...');
    }

    $el[hasToShow === false ? 'addClass' : 'removeClass']('hidden');

    if (!hasToShow) {
      window.initialLoading = false;

      // Wait 10ms before removing the progressbar class.
      setTimeout(() => {
        $el.removeClass('withProgressBar').removeClass('cancellable');
        $el.find('.progress').css('width', `${0.0}%`);
      }, 10);
    }
  };

  // Show by default
  window.initialLoading = true;
  // App.loader(true, i18n.__('loading'));
  App.loader(true, 'Loading...');

  jQuery(($) => {
    // Maximise and minimise commands.
    $('.btn-os.max').on('click', () => {
      if (win.isFullscreen) {
        win.toggleFullscreen();
      }
      else if (screen.availHeight <= win.height) {
        win.unmaximize();
      }
      else {
        win.maximize();
      }
    });

    $('.btn-os.min').on('click', () => {
      win.minimize();
    });

    $('.btn-os.close').on('click', () => {
      win.close();
    });

    $('.btn-os.fullscreen').on('click', () => {
      win.toggleFullscreen();
      $('.btn-os.fullscreen').toggleClass('active');
    });

    App.Router.on('route', () => {
      // ...
    });
  });

})(App);
