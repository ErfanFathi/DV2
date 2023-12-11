const URL = "https://erfanfathi.github.io/DV2/";
// A list for years
var years_list = [1995, 2010, 2012];
var cityName = "Alabama";

// func for draw line chart
function drawChart_radar() {
    d3.select("#chart1").select("svg").remove();
    d3.select("#chart2").select("svg").remove();
    d3.select("#chart3").select("svg").remove();

    var margin = { top: 50, right: 70, bottom: 100, left: 70 },
    width = 350 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // add tooltip
    const tooltip = d3.select('body')
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("background-color", "white")
        .style("font-family","Fira Sans")

    // Read the csv's
    Promise.all([
        d3.csv(URL + "data/Time_and_Distribution/Average/"+ cityName + ".csv"),
        d3.csv(URL + "data/Time_and_Distribution/Maximum/"+ cityName + ".csv"),
        d3.csv(URL + "data/Time_and_Distribution/Minimum/"+ cityName + ".csv")
    ]).then(function (datasets) {
        var dataAvg = datasets[0];
        var dataMax = datasets[1];
        var dataMin = datasets[2];
        var data_list = [dataMin, dataAvg, dataMax];

        var months = Object.keys(dataAvg[0]).slice(1, 13);
        
        var minTemperature = d3.min(dataMin, function (d) {
            return d3.min(months, function (month) {
                return +d[month];
            });
        });

        var maxTemperature = d3.max(dataMax, function (d) {
            return d3.max(months, function (month) {
                return +d[month];
            });
        });

        for (var i = 0; i < data_list.length; i++) {
            var radar_svg = d3.select("#" + "chart" + (i + 1)).append("svg")
                .attr("id", (i+1) + "_svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");

            // scale for the data
            var rScale = d3.scaleLinear()
                .domain([d3.min([0, minTemperature]), maxTemperature])
                .range([0, width / 2]);

            // circle ticks
            var circleTicks = [minTemperature, 0, maxTemperature];

            // draw the circles
            radar_svg.selectAll(".circle-ticks")
                .data(circleTicks)
                .join(
                    enter => enter.append("circle")
                        .attr("class", "circle-ticks")
                        .attr("cx", width / 2)
                        .attr("cy", width / 2)
                        .attr("fill", "none")
                        .attr("stroke", "black")
                        .attr("r", function (d) { return rScale(d); })
                        .attr("stroke-width", 1)
                );

            // draw the labels
            radar_svg.selectAll(".circle-labels")
                .data(circleTicks)
                .join(
                    enter => enter.append("text")
                        .attr("class", "circle-labels")
                        .attr("x", width / 2 - 5)
                        .attr("y", function (d) { return width / 2 - rScale(d); })
                        .attr("dy", "0.2em")
                        .attr("fill", "none")
                        .attr("stroke", "black")
                        .attr("stroke-width", 1)
                        .text(function (d) { return d; }),
                    update => update
                        .text(function (d) { return d; })
                );

            // angle to coordinate calculator
            var angleToCoordinate = function (angle, value) {
                var x = Math.cos(angle) * rScale(value);
                var y = Math.sin(angle) * rScale(value);
                return { "x": width / 2 - x, "y": width / 2 - y };
            };

            var month_detail = months.map((m, i) => {
                var angle = (Math.PI / 2) + (2 * Math.PI * i / months.length);
                return {
                    "month": m,
                    "angle": angle,
                    "coord": angleToCoordinate(angle, maxTemperature),
                    "label_coord": angleToCoordinate(angle, maxTemperature * 1.3)
                };
            });

            // Draw axis lines
            radar_svg.selectAll(".axis-line")
                .data(month_detail)
                .join(
                    enter => enter.append("line")
                        .attr("class", "axis-line")
                        .attr("x1", width / 2)
                        .attr("y1", width / 2)
                        .attr("x2", function (d) { return d.coord.x; })
                        .attr("y2", function (d) { return d.coord.y; })
                        .attr("stroke", "black")
                        .attr("stroke-width", 1),
                    update => update
                        .attr("x2", function (d) { return d.coord.x; })
                        .attr("y2", function (d) { return d.coord.y; })
                );

            // Draw axis labels
            radar_svg.selectAll(".axis-label")
                .data(month_detail)
                .join(
                    enter => enter.append("text")
                        .attr("class", "axis-label")
                        .attr("x", function (d) { return d.label_coord.x -13 ; })
                        .attr("y", function (d) { return d.label_coord.y +5; })
                        .attr("dy", "0.1em")
                        .attr("fill", "none")
                        .attr("stroke", "green")
                        .attr("stroke-width", 1)
                        .text(function (d) { return d.month; }),
                    update => update
                        .text(function (d) { return d.month; })
                );

            // Draw the radar chart blobs
            var radarLine = d3.line()
                .x(d => d.x)
                .y(d => d.y);

            // create a func for getting path coordinates
            function getPathCoordinates(data_point) {
                var coordinates = [];
                // remove nan values
                for (var i = 0; i < months.length; i++){
                    var month = months[i];
                    if(!isNaN(data_point[month])){
                        var angle = (Math.PI / 2) + (2 * Math.PI * i / months.length);
                        coordinates.push(angleToCoordinate(angle, data_point[month]));
                        
                    }
                }
                coordinates.push(angleToCoordinate((Math.PI / 2) + (2 * Math.PI), data_point["Jan"]));
                return coordinates;
            }

            
            var data = [];
            years_list.forEach(function (year) {
                var yearData = data_list[i].filter(function (d) { return +d.year == +year; });
                var point = {};
                months.forEach(m => point[m] = yearData[0][m]);
                data.push(point);

                // color base on the year
                var color = d3.schemeCategory10[years_list.indexOf(year)];

                // draw the path and circles
                radar_svg.selectAll(".radar-path")
                .data(Object.values(data))
                .join(
                    enter => enter.append("path")
                        .attr("class", "radar-path")
                        .attr("d", function (d) {
                            return radarLine(getPathCoordinates(d));
                        })
                        .attr("stroke-width", 2)
                        .attr("stroke", color)
                        .attr("fill", 'none')
                );

            radar_svg.selectAll(".radar-circle")
                .data(Object.values(data))
                .join(
                    enter => enter
                        .filter(dp => !isNaN(dp))
                        .append("circle")
                        .attr("class", "radar-circle")
                        .attr("cx", width / 2)
                        .attr("cy", width / 2)
                        .attr("r", 4)
                        .attr("fill", 'none')
                );

            }); 
    }
        
});
}

// Selectation Part - cities
fetch(URL + "utils/cities2.json")
    .then(response => response.json())
    .then(data => {
        const citySelect = document.getElementById('city');
        data["cities"].forEach(city => {
            const option = document.createElement('option');
            option.value = city; // Set the option value
            option.textContent = city; // Set the option text 
            citySelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error fetching data:', error));

drawChart_radar();

$("#city").on('change', function(){
    cityName = $(this).val();
    drawChart_radar();
});

// script for button to select one ot multiple years
document.getElementById('applyButton').addEventListener('click', function() {
    var inputValue = document.getElementById('inputField').value;
    if (inputValue >= 1895 && inputValue <= 2023) {
        // add to the list
        years_list.push(inputValue);
    } else {
        alert("Please enter a year between 1895 and 2023");
    }
    drawChart_radar();
});
document.getElementById('removeButton').addEventListener('click', function() {
    var inputValue = document.getElementById('inputField').value;
    // remove from the list
    years_list = years_list.filter(function(value, index, arr){ 
        return value != inputValue;
    });
    drawChart_radar();
});