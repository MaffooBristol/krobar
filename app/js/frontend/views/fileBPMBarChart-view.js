App.View.FileBPMBarChart = Marionette.ItemView.extend({
  template: false,
  tagName: 'canvas',
  id: 'file-bpm-bar-chart',
  attributes: {
    width: 200,
    height: 120
  },
  initialize: function () {
    this.listenTo(this.collection, 'complete', this.render);
  },
  onRender: function (options) {

    var options = _.extend((options || {}), {
      pointLabelFontFamily : "'Arial'",
      pointLabelFontStyle : "normal",
      pointLabelFontSize : 8,
      pointLabelFontColor : "rgba(0,0,0,0.7)",
      pointDot : false,
      pointDotRadius : 2,
      pointDotStrokeWidth : 0,
      angleLineColor : "rgba(0,0,0,.1)",
      datasetStroke : false,
      datasetFill : false,
    });

    if (!this.$el.length || !this.collection.length) return;

    var distData = App.Util.getBPMDistData(this.collection);

    var ctx = this.$el[0].getContext("2d");
    var data = {
      labels: _.map(_.keys(distData), function (key, index) { return (index % 3 === 0) ? key : '' }),
      datasets: [
        {
          label: 'BPMs',
          fillColor: 'rgba(255, 100, 0, 0.3)',
          strokeColor: 'rgba(0,0,0,0.6)',
          datasetFill : false,
          data: _.values(distData)
        }
      ]
    };
    this.chart = new Chart(ctx).Line(data, options);
  }
});
