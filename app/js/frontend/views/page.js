(function (App) {

  App.View.Page = Marionette.LayoutView.extend({
    // className: 'page',

    template (model) {
      return loadTemplate('pageLayout.tpl', model);
    },

    // el: '#page',

    tagName: 'div',
    className: 'page',

    regions: {
      fileListRegion: '#file-list',
      fileKeyRadialChartRegion: '#file-key-radial-chart-region',
      fileBPMBarChartRegion: '#file-bpm-bar-chart-region',
      resultListRegion: '#result-list',
      toolbarFilesRegion: '#toolbar-files',
      toolbarResultsRegion: '#toolbar-results',
    },

    events: {
      'click .action.action-files-load-folder': function () {
        App.Event.trigger('file:choose:folder', {}, (dir) => {
          if (dir) {
            App.Event.trigger('file:update', dir);
            App.loader(true, 'Loading folder...');
          }
        });
      },
      'click .action.action-files-load-path': function () {
        App.Event.trigger('file:choose:path', {}, (dir) => {
          if (dir) {
            App.Event.trigger('file:update', dir);
            App.loader(true, 'Loading path...');
          }
        });
      },
      'click .action.action-results-random': function () {
        App.Event.trigger('results:random');
        // App.loader(true, 'Regenerating random mix');
      },
      'click .action.action-results-export': function () {
        App.Event.trigger('results:export');
      },
    },

    onRender () {
      this.$el.appendTo('section.container');

      this.options = _.extend(this.options, {
        allowJumps: true,
        mixLength: 60,
        mixSpeed: 'fast',
      });

      // this.options.allowJumps = false;
      // this.options.mixLength   = 60;
      // this.options.mixSpeed    = 'slow';

      const filesCollection = App.getFilesCollection(this.options || {});

      // filesCollection.fetch();

      this.fileListRegion.show(new App.View.FileList({
        collection: filesCollection,
        options: this.options,
      }));

      this.fileKeyRadialChartRegion.show(new App.View.FileKeyRadialChart({
        collection: filesCollection,
        options: this.options,
      }));

      this.fileBPMBarChartRegion.show(new App.View.FileBPMBarChart({
        collection: filesCollection,
        options: this.options,
      }));

      const resultsCollection = App.getResultsCollection(this.options || {}, filesCollection);

      this.resultListRegion.show(new App.View.ResultList({
        collection: resultsCollection,
        filesCollection,
        options: this.options,
      }));

      //
    },

    show () {
    },
  });

})(App);
