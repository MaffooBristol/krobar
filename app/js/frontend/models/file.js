(function (App) {

  const path = require('path');

  App.Model.File = Backbone.Model.extend({

    defaults: {
      type: null,
      title: false,
      tags: {},
      key: null,
      bpm: null,
      rating: 0,
      playtime: null,
      loudness: null,
      release_date: null,
      gap: false,
    },

    getShortFile() {
      return path.basename(this.get('file'));
    },

    getShortTitle () {
      const title = this.get('title');
      if (!title || title.length < 40) return title;
      return `${title.substring(0, 40)}&hellip;`;
    },

  });

})(App);
