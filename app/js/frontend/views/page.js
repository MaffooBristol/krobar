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
    fileChartRegion: '#file-key-chart',
    resultListRegion: '#result-list',
    toolbarFilesRegion: '#toolbar-files',
    toolbarResultsRegion: '#toolbar-results'
  },

  events: {
    'click .action.action-files-load-folder': function () {
      App.Event.trigger('file:choose:folder', {}, function (dir) {
        App.Event.trigger('file:update', dir);
      });
    },
    'click .action.action-files-load-path': function () {
      App.Event.trigger('file:choose:path', {}, function (dir) {
        App.Event.trigger('file:update', dir);
      });
    },
    'click .action.action-results-random': function () {
      App.Event.trigger('results:random');
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

    this.fileChartRegion.show(new App.View.FileChart({
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
