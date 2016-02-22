
<!--Loads JavaScript for Google Charts-->
google.charts.load('current', {packages: ['corechart' , 'geochart', 'bar']});

$(function() {

    loadCountryDropdowns();


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

    function loadCountryDropdowns(){
        $(".countrySelect").append ($('<option>', {
            text: 'Select a country',
            value: 'Not Selected'
        }));
        var countryList = jsonRequest("api.php?data=countries&action=fetchcountrynamestop10visits");
        $.each(countryList, function(key, value) {
            $(".countrySelect").append ($('<option>', {
                text: countryList[key].CountryName,
                value: countryList[key].CountryName
            }));
        });
    }

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
        var countries = [];
        countries.push($("#colChartCountrySelect1").val());
        countries.push($("#colChartCountrySelect2").val());
        countries.push($("#colChartCountrySelect3").val());

        if($.inArray('Not Selected', countries)) {

            var chartArrayData = [];
            var countriesParam = "";

            for(var i = 0; i< countries.length; i++){
                console.log(countries[i]);
                countriesParam += countries[i] + ",";
            }
            countriesParam = countriesParam.slice(0, -1);

            var jsonData = jsonRequest("api.php?data=visits&action=visitsforbarchart&param=" + countriesParam);

            chartArrayData.push(['Month', jsonData[0].CountryName, jsonData[1].CountryName, jsonData[2].CountryName]);

            for (var i = 0; i < jsonData.length; i+=3){
                chartArrayData.push([jsonData[i].MonthName, jsonData[i].Visits, jsonData[i+1].Visits, jsonData[i+2].Visits]);
            }

            var data = google.visualization.arrayToDataTable(chartArrayData);

            var options = {
                chart: {
                    title: 'Site Visits',
                    subtitle: "'" + 2016 + "'",
                },
                bars: 'horizontal' // Required for Material Bar Charts.
            };

            var chart = new google.charts.Bar(document.getElementById('barChart'));

            chart.draw(data, options);
        }
        else {
            for(var i = 0; i< countries.length; i++){
               console.log(countries[i]);
            }
            alert("Please fill in all three countries");
        }
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


});



