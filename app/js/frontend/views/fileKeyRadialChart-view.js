(function (App) {

  App.View.FileKeyRadialChart = Marionette.ItemView.extend({
    template: false,
    tagName: 'canvas',
    id: 'file-key-radial-chart',
    attributes: {
      width: 160,
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
        pointDot: true,
        pointDotRadius: 2,
        pointDotStrokeWidth: 0,
        angleLineColor: 'rgba(0,0,0,.1)',
        datasetStroke: false,
        datasetFill: false,
      });

      if (!this.$el.length || !this.collection.length) return;

      const distData = App.Util.getKeyDistData(this.collection);

      const ctx = this.$el[0].getContext('2d');
      const data = {
        labels: _.map(App.Static.orders, (key) => {
          return `${key[0]}/${key[1]}`;
        }),
        datasets: [
          {
            label: 'Major',
            fillColor: 'rgba(255, 100, 0, 0.3)',
            datasetFill: false,
            data: _.values(distData.major),
          },
          {
            label: 'Minor',
            fillColor: 'rgba(0, 100, 255, 0.3)',
            datasetFill: false,
            data: _.values(distData.minor),
          },
        ],
      };
      this.chart = new Chart(ctx).Radar(data, options);
    },
  });

})(App);
