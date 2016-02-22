
<!--Loads JavaScript for Google Charts-->
google.charts.load('current', {packages: ['corechart' , 'geochart', 'bar']});

$(function() {
    $("#areaChartBtn").click(function() {
        google.charts.setOnLoadCallback(drawAreaChart);
        drawAreaChart();
    })

    $("#geoChartBtn").click(function() {
        google.charts.setOnLoadCallback(drawGeoChart);
        drawAreaChart();
    })

    $("#barChartBtn").click(function() {
        google.charts.setOnLoadCallback(drawBarChart);
        drawBarChart();
    })

    function drawAreaChart() {
        var shortMonth = $("#areaChartMonth").val();

        var jsonData = jsonRequest("api.php?data=visits&action=countmonthbyday&param=" + shortMonth);

        var chartArrayData = [];
        chartArrayData.push(['Date', 'Visits']);

        for (var i = 1; i < jsonData.length; i++){
            var dateStr = jsonData[i].Date.split("-");

            var day = parseInt(dateStr[2]);
                chartArrayData.push([day, parseInt(jsonData[i].Visits)]);
            }


        var data = google.visualization.arrayToDataTable(chartArrayData);
        var currMonth = $("#areaChartMonth option:selected").text();
        var options = {
            title: currMonth + ' Visits',
            hAxis: {title: 'Day',  titleTextStyle: {color: '#333'}},
            vAxis: {minValue: 0}
        };

        var chart = new google.visualization.AreaChart(document.getElementById('areaChart'));
        chart.draw(data, options);
    }

    function drawGeoChart() {
        var shortMonth = $("#geoChartMonth").val();

        var jsonData = jsonRequest("api.php?data=countries&action=visitsbycountry&param=" + shortMonth);

        var chartArrayData = [];
        chartArrayData.push(['Country', 'Visits']);

        for (var i = 1; i < jsonData.length; i++){
            chartArrayData.push([jsonData[i].CountryName, parseInt(jsonData[i].Visits)]);
        }

        var data = google.visualization.arrayToDataTable(chartArrayData);

        var options = {};

        var chart = new google.visualization.GeoChart(document.getElementById('geoChart'));

        chart.draw(data, options);
    }

    function drawBarChart(){

        var data = google.visualization.arrayToDataTable([
            ['Year', 'Sales', 'Expenses', 'Profit'],
            ['2014', 1000, 400, 200],
            ['2015', 1170, 460, 250],
            ['2016', 660, 1120, 300],
            ['2017', 1030, 540, 350]
        ]);

        var fullDate = new Date();
        var currYear = fullDate.getFullYear();

        var options = {
            chart: {
                title: 'Site Visits',
                subtitle: "'" + currYear + "'",
            },
            bars: 'vertical' // Required for Material Bar Charts.
        };

        var chart = new google.charts.Bar(document.getElementById('barChart'));

        chart.draw(data, options);
    }

    function jsonRequest (url) {
        return (function () {
            var result = null;
            $.ajax({
                'async': false,
                'global': false,
                'url': url,
                'dataType': "json",
                'success': function (data) {
                    result = data;
                }
            });
            return result;
        })();
    }


        // ['Day', 'Visits'],
        //['2016-01-01',  197],
        //['2016-01-02',  211],
        //['2016-01-03',  194],
        //['2016-01-04',  213]
    function createChartsArray(headerArray, item1Array, item2Array, item3Array){



    }

});



