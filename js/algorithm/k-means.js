class KMeans{

    constructor(chart){

        this.chart = chart;
    }

    addCluster(data){

        chart.addCluster(data);
    }

    step(chart){

        let that = this;

        let points = chart.getPoints();

        let clusters = chart.getClusters();

        points.forEach(point => {
            point.clusterId = that.findNearestCentroid(point, clusters);
        });

        clusters.forEach(cluster => {
            chart.moveCluster(cluster.clusterId, that.updateCentroid(cluster, points))
        });

        points.forEach((p, i) => {
            chart.updatePoint(i, p);
        });
    }

    findNearestCentroid(point, clusters) {

        let nearest = null;

        clusters.forEach(cluster => {

            let value = distance.getDistance(point, cluster);

            if (!nearest || value < nearest.distance) {
                nearest = {
                    cluster: cluster,
                    distance: value
                }
            }
        });

        return nearest.cluster.clusterId;
    }

    updateCentroid(cluster, points) {

        let clusterId = cluster.clusterId;

        let centroid = [0, 0];
        let total = 0;

        points.forEach(point => {

            if (point.clusterId == clusterId) {
                centroid[0] += point.data[0];
                centroid[1] += point.data[1];
                total++;
            }
        });

        centroid[0] /= total;
        centroid[1] /= total;

        if (total > 0) {
            return new Point(clusterId, centroid);
        } else {
            return cluster;
        }
    }
}
