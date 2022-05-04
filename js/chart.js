class Chart {

    static POINTER = 0;
    static ADD_POINTS = 1;
    static ADD_CLUSTERS = 2;

    constructor(el) {

        const that = this;

        this.operation = Chart.POINTER;

        this.chart = Highcharts.chart(el, {
            chart: {
                type: 'scatter',
                events: {
                    click: function (e) {

                        const x = e.xAxis[0].value;
                        const y = e.yAxis[0].value;

                        if (that.operation == Chart.ADD_POINTS) {
                            that.addPoint([x, y]);
                        }
                        if (that.operation == Chart.ADD_CLUSTERS) {
                            that.addCluster([x, y]);
                        }
                    }
                }
            },
            title: "",
            tooltip: {
                enabled: false
            },
            accessibility: {
                enabled: false
            },
            plotOptions: {
                series: {
                    stickyTracking: false,
                    lineWidth: 0,
                    point: {
                        events: {
                            'click': function () {
                                if (this.name !== "Centroid") {
                                    this.remove();
                                }
                            }
                        }
                    }
                }
            },
            xAxis: {
                min: 0,
                max: 100,
                title: {
                    enabled: true,
                    text: 'X Values'
                },
            },
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    enabled: true,
                    text: 'Y Values'
                },
            },
            series: [{
                data: [],
                name: "Points",
                marker: {
                    symbol: 'circle',
                    radius: 8,
                }
            }, {
                data: [],
                name: "Clusters",
                marker: {
                    symbol: 'diamond',
                    radius: 8,
                    lineColor: "red",
                    lineWidth: 1,
                }
            }]
        });
    }

    setOperation(operation = Chart.POINTER) {

        this.operation = operation;
    }

    clearAll() {

        this.getClusterSeries().setData([]);
        this.getPointSeries().setData([]);
    }

    setSize(width, height) {

        this.chart.setSize(width, height);
    }

    setXAxisMinAndMax(values){

        this.chart.xAxis[0].setExtremes(values.min, values.max);
    }

    setYAxisMinAndMax(values){

        this.chart.yAxis[0].setExtremes(values.min, values.max);
    }

    getAxisRange() {

        return {
            x: [this.chart.xAxis[0].min, this.chart.xAxis[0].max],
            y: [this.chart.yAxis[0].min, this.chart.yAxis[0].max],
        };
    }

    getClusterSeries() {
        return this.chart.series[1];
    }

    getNumberOfClusters() {
        return this.getClusterSeries().data.length;
    }

    getClusters() {
        return this.getClusterSeries().data.map(e => e.point.copy());
    }

    addCluster(data) {

        let nClusters = this.getNumberOfClusters();

        if (nClusters === 10) {
            throw new Error("Max limit of clusters");
        }

        let point = new Point(nClusters, data);

        this.getClusterSeries().addPoint({
            x: point.x,
            y: point.y,
            point: point,
            color: point.getColor(),
        });
    }

    moveCluster(clusterId, point) {

        let current = this.getClusterSeries().data[clusterId];

        // if (!current.point.isEqual(point)) {

        current.update({
            x: point.x,
            y: point.y,
            point: point,
            color: point.getColor(),
        });
        // }
    }

    getPointSeries() {
        return this.chart.series[0];
    }

    getPoints() {
        return this.getPointSeries().data.map(e => e.point.copy());
    }

    addPoint(data) {

        let point = new Point(-1, data);

        this.getPointSeries().addPoint({
            x: point.x,
            y: point.y,
            point: point,
            color: point.getColor()
        });
    }

    updatePoint(pointId, point) {

        let current = this.getPointSeries().data[pointId];

        if (current.point.clusterId !== point.clusterId) {

            current.update({
                x: point.x,
                y: point.y,
                point: point,
                color: point.getColor()
            });
        }
    }

}
