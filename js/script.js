let chart = new Chart("canvas");
let distance = new EuclideanDistance();
let kmeans = new KMeans(chart);

function resizeWindow() {

    let canvasHeight = $(window).height() - $("#canvas").offset().top - $("footer").height() - 30;

    chart.setSize($(".col-lg-9").width(), canvasHeight);

    $("#canvas").height(canvasHeight);

    $("#sidebar").height(canvasHeight - 2);
}

function initRandomClustersAndPoints(nClusters = 2, nPoints = 50) {

    chart.clearAll();

    for (let i = 0; i < nClusters; i++) {

        chart.addCluster(RandomUtils.nextPoint(chart));
    }

    for (let i = 0; i < nPoints; i++) {

        chart.addPoint(RandomUtils.nextPoint(chart));
    }
}

$(function () {

    url = new Url;

    RandomUtils.setSeed(url.query.seed || new Date().getTime());

    $(window).resize(resizeWindow);

    resizeWindow();

    window.onerror = (errorMsg) => {
        BootBoxUtils.alert(errorMsg, `<i class="fas fa-exclamation-triangle me-2"></i>Ooops...`);
        return false;
    }

    $(".dropdown-item-no-click").click((event) => {
        event.preventDefault();
        return false;
    });

    document.addEventListener("DOMContentLoaded", function () {

        // make it as accordion for smaller screens
        if (window.innerWidth < 992) {

            // close all inner dropdowns when parent is closed
            document.querySelectorAll('.navbar .dropdown').forEach(function (everydropdown) {
                everydropdown.addEventListener('hidden.bs.dropdown', function () {
                    // after dropdown is hidden, then find all submenus
                    this.querySelectorAll('.submenu').forEach(function (everysubmenu) {
                        // hide every submenu as well
                        everysubmenu.style.display = 'none';
                    });
                })
            });

            document.querySelectorAll('.dropdown-menu a').forEach(function (element) {
                element.addEventListener('click', function (e) {

                    let nextEl = this.nextElementSibling;

                    if (nextEl && nextEl.classList.contains('submenu')) {
                        // prevent opening link if link needs to open dropdown
                        e.preventDefault();
                        if (nextEl.style.display == 'block') {
                            nextEl.style.display = 'none';
                        } else {
                            nextEl.style.display = 'block';
                        }

                    }
                });
            })
        } // end if innerWidth
    });// DOMContentLoaded  end

    $("#pointer").click(() => chart.setOperation(Chart.POINTER));
    $("#add-points").click(() => chart.setOperation(Chart.ADD_POINTS));
    $("#add-clusters").click(() => chart.setOperation(Chart.ADD_CLUSTERS));


    $("#menubar-clear-all").click(() => {

        BootBoxUtils.confirm("Are you sure you want to clear all?").then(() => {

            chart.clearAll()
        });
    });

    $("#menubar-export-points").click((event) => {

        let positions = [];

        positions.push(["x", "y", "clusterId"])

        chart.getPoints().forEach(p => {
            positions.push([p.x, p.y, p.clusterId]);
        })

        FileUtils.exportToCSV(positions, "points.csv");
    });

    $("#menubar-export-clusters").click((event) => {

        let positions = [];

        positions.push(["x", "y", "clusterId"])

        chart.getClusters().forEach(p => {
            positions.push([p.x, p.y, p.clusterId]);
        })

        FileUtils.exportToCSV(positions, "clusters.csv");
    });

    $("#form-import-csv").submit(event => {

        let csvFile = $(this).find("#csv-file").prop('files')[0];
        let hasHeader = $(this).find("#has-header").is(':checked');
        let type = $(this).find('input[name="csv-type"]:checked').val();

        FileUtils.readCSV(csvFile, hasHeader, (points) => {

            if (type == "points") {
                chart.clearAll();
            }

            points.forEach(point => {

                let data = point.data;

                if (type == "points") {
                    chart.addPoint(data);
                }
                if (type == "clusters") {
                    chart.addCluster(data);
                }
            });

            $("#modal-import-csv").modal("hide");
        });

        return false;
    });

    $("#form-settings").submit(event => {

        event.preventDefault();

        chart.setXAxisMinAndMax({
            min: parseInt($('#x-axis-min').val()),
            max: parseInt($('#x-axis-max').val())
        });

        chart.setYAxisMinAndMax({
            min: parseInt($('#y-axis-min').val()),
            max: parseInt($('#y-axis-max').val())
        });

        return false;
    });

    $('.random').click(function () {

        BootBoxUtils.promptSeed("Seed").then((seed) => {

            BootBoxUtils.promptNumber("Number of Clusters", 1, 10).then((nClusters) => {

                BootBoxUtils.promptNumber("Number of Points", 1, 100).then((nPoints) => {

                    RandomUtils.setSeed(seed);

                    initRandomClustersAndPoints(nClusters, nPoints);
                });
            });
        });
    });

    $('.examples').click(function(){

        $.get("examples/" + $(this).data("file")+"/points.csv", function (result) {

            let points = FileUtils.parseContent(result, true);

            chart.clearAll();

            points.forEach(point => {
                chart.addPoint(point.data);
            });
        });
    });

    $("#step").click(() => {

        kmeans.step(chart);
    });

    initRandomClustersAndPoints();
});


