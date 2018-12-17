(function (App) {

  App.View.FileBPMBarChart = Marionette.ItemView.extend({
    template: false,
    tagName: 'canvas',
    id: 'file-bpm-bar-chart',
    attributes: {
      width: 200,
      height: 120,
    },
    initialize () {
      this.listenTo(this.collection, 'complete', this.render);
    },
    onRender (defaultOptions) {
      const options = _.extend((defaultOptions || {}), {
        pointLabelFontFamily: "'Arial'",
        pointLabelFontStyle: 'normal',
        pointLabelFontSize: 8,
        pointLabelFontColor: 'rgba(0,0,0,0.7)',
        pointDot: false,
        pointDotRadius: 2,
        pointDotStrokeWidth: 0,
        angleLineColor: 'rgba(0,0,0,.1)',
        datasetStroke: false,
        datasetFill: false,
      });

      if (!this.$el.length || !this.collection.length) return;

      const distData = App.Util.getBPMDistData(this.collection);

      const ctx = this.$el[0].getContext('2d');
      const data = {
        labels: _.map(_.keys(distData), (key, index) => {
          if (_.size(distData) < 20) return key; return (index % 5 === 0) ? key : '';
        }),
        datasets: [
          {
            label: 'BPMs',
            fillColor: 'rgba(255, 100, 0, 0.3)',
            strokeColor: 'rgba(0,0,0,0.6)',
            datasetFill: false,
            data: _.values(distData),
          },
        ],
      };
      this.chart = new Chart(ctx).Line(data, options);
    },
  });

})(App);
