App.View.Page = Marionette.LayoutView.extend({
  // className: 'page',

  template: function (model) {
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
    toolbarResultsRegion: '#toolbar-results'
  },

  events: {
    'click .action.action-files-load-folder': function () {
      App.Event.trigger('file:choose:folder', {}, function (dir) {
        if (dir) {
          App.Event.trigger('file:update', dir);
          App.loader(true, 'Loading folder...');
        }
      });
    },
    'click .action.action-files-load-path': function () {
      App.Event.trigger('file:choose:path', {}, function (dir) {
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
    }
  },

  onRender: function () {

    this.$el.appendTo('section.container');

    this.options = _.extend(this.options, {
      preferJumps: false,
      mixLength:   60,
      mixSpeed:    'medium'
    });

    this.options.preferJumps = true;
    this.options.mixLength   = 60;
    this.options.mixSpeed    = 'slow';

    var filesCollection = App.getFilesCollection(this.options || {});

    // filesCollection.fetch();

    this.fileListRegion.show(new App.View.FileList({
      collection: filesCollection,
      options: this.options
    }));

    this.fileKeyRadialChartRegion.show(new App.View.FileKeyRadialChart({
      collection: filesCollection,
      options: this.options
    }));

    this.fileBPMBarChartRegion.show(new App.View.FileBPMBarChart({
      collection: filesCollection,
      options: this.options
    }));

    var resultsCollection = App.getResultsCollection(this.options || {}, filesCollection);

    this.resultListRegion.show(new App.View.ResultList({
      collection: resultsCollection,
      filesCollection: filesCollection,
      options: this.options
    }));

    //
  },

  show: function () {
  }
});
