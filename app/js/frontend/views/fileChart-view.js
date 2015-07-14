App.View.FileChart = Marionette.ItemView.extend({
  template: false,
  tagName: 'canvas',
  id: 'file-chart',
  attributes: {
    width: 160,
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
      pointDot : true,
      pointDotRadius : 2,
      pointDotStrokeWidth : 0,
      angleLineColor : "rgba(0,0,0,.1)",
      datasetStroke : false,
      datasetFill : false,
    });

    if (!$('#file-chart').length || !this.collection.length) return;

    var distData = App.Util.getDistData(this.collection);

    var ctx = document.getElementById('file-chart').getContext("2d");
    var data = {
      labels: _.map(App.Static.orders, function (key) {
        return key[0] + '/' + key[1];
      }),
      datasets: [
        {
          label: 'Major',
          fillColor: 'rgba(255, 100, 0, 0.3)',
          datasetFill : false,
          data: _.values(distData.major)
        },
        {
          label: 'Minor',
          fillColor: 'rgba(0, 100, 255, 0.3)',
          datasetFill : false,
          data: _.values(distData.minor)
        }
      ]
    };
    this.chart = new Chart(ctx).Radar(data, options);
  }
});
