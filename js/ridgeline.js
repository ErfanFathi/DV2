const URL = "https://erfanfathi.github.io/DV2/";
// A list for years
var years_list = [1995, 2010, 2012];
var cityName = "Alabama";

// func for draw Rigiline chart
function drawChart_rigid() {
    d3.select("#ridgeline").select("svg").remove();

    var margin = { top: 0, right: 10, bottom: 70, left: 10 },
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

    // add svg
    var ridgeline_svg = d3.select("#ridgeline").append("svg")
        .attr("id", "ridgeline_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // Read the csv's
    Promise.all([
        d3.csv(URL + "data/Time_and_Distribution/Maximum/"+ cityName + ".csv"),
        d3.csv(URL + "data/Time_and_Distribution/Minimum/"+ cityName + ".csv")
    ]).then(function (datasets) {
        var dataMax = datasets[0];
        var dataMin = datasets[1];

        var months = Object.keys(dataMax[0]).slice(1, 13);
        
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

        var thresholds = d3.ticks(...d3.nice(...[minTemperature, maxTemperature], 2), 12);

        // X axis 
        var x = d3.scaleLinear()
            .domain([d3.min(thresholds), d3.max(thresholds)])
            .range([0, width]);

        ridgeline_svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        
        ridgeline_svg.selectAll(".tick text")
            .attr("y", 10)
            .attr("x", 5)
            .attr("font-family", "Fira Sans")
            .attr("font-size", "10px")
            .attr("font-weight", "bold")
            .attr("fill", "#000000");

        // Add X axis label
        ridgeline_svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width - 50)
            .attr("y", height + 50)
            .attr("font-family", "Fira Sans")
            .attr("font-size", "15px")
            .attr("font-weight", "bold")
            .attr("fill", "#000000")
            .text("Temperature (°C)");


        var y = d3.scaleLinear()
            .domain([0, 1.1])
            .range([height, 0]);

        var y_name = d3.scaleBand()
            .domain(years_list)
            .range([0, height])
            .paddingInner(1)
            .paddingOuter(.5);

        var midd = y_name(years_list[Math.floor(years_list.length / 2)]);

        var densities_list = [];

        years_list.forEach(function (year) {
            var yearDataMax = dataMax.filter(function (d) { return +d.year == +year; });
            var yearDataMin = dataMin.filter(function (d) { return +d.year == +year; });
            var max_month_list = [];
            var min_month_list = [];
            months.forEach(function (month) {
                max_month_list.push(+yearDataMax[0][month]);
                min_month_list.push(+yearDataMin[0][month]);
            });
            var kdeMax = kernelDensityEstimator(kernelEpanechnikov(1), thresholds, max_month_list);
            var kdeMin = kernelDensityEstimator(kernelEpanechnikov(1), thresholds, min_month_list);
            densities_list.push({ "year": year, "max": kdeMax, "min": kdeMin });
        });

        // add line for each year
        ridgeline_svg.selectAll("lines")
            .data(densities_list)
            .join("g")
            .attr("transform", function(d) {
                var dist_from_middle = y_name(d.year) - midd;
                var translate = midd + (dist_from_middle * 0.6) ;
                return `translate(0, ${translate - height})`
                })
            .call(g => {
                g.append("line")
                    .attr("x1", 0)
                    .attr("x2", width)
                    .attr("y1", y(0))
                    .attr("y2", y(0))
                    .attr("stroke", "grey")
                    .attr("stroke-width", 1);

                g.append("text")
                    .attr("x", width + 20)
                    .attr("y", y(0))
                    .attr("dy", "0.3em")
                    .attr("text-anchor", "end")
                    .attr("font-family", "Fira Sans")
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold")
                    .text(function(d) { return d.year; }
                )});

        // add area for maximum densities
        ridgeline_svg.selectAll("areas")
            .data(densities_list)
            .join("g")
            .attr("transform", function(d) {
                var dist_from_middle = y_name(d.year) - midd;
                var translate = midd + (dist_from_middle * 0.6) ;
                return `translate(0, ${translate - height})`
                })
            .call(g => {
                g.append("path")
                    .datum(function(d) { return d.max; })
                    .attr("fill", "#FF0000")
                    .attr("stroke", "#FF0000")
                    .attr("stroke-width", 1)
                    .attr("opacity", 0.5)
                    .attr("d",  d3.line()
                        .curve(d3.curveBasis)
                        .x(function(d) { return x(d[0]); })
                        .y(function(d) { return y(d[1]); })
                    )});

        // add area for minimum densities
        ridgeline_svg.selectAll("areas")
            .data(densities_list)
            .join("g")
            .attr("transform", function(d) {
                var dist_from_middle = y_name(d.year) - midd;
                var translate = midd + (dist_from_middle * 0.6) ;
                return `translate(0, ${translate - height})`
                })
            .call(g => {
                g.append("path")
                    .datum(function(d) { return d.min; })
                    .attr("fill", "#0000FF")
                    .attr("stroke", "#0000FF")
                    .attr("stroke-width", 1)
                    .attr("opacity", 0.5)
                    .attr("d",  d3.line()
                        .curve(d3.curveBasis)
                        .x(function(d) { return x(d[0]); })
                        .y(function(d) { return y(d[1]); })
                    )});

        // add legend for maximum and minimum
        var legend = ridgeline_svg.append("g")
            .attr("transform", "translate(" + (width -70) + "," + (height - 50) + ")");

        legend.append("rect")
            .attr("width", 70)
            .attr("height", 50)
            .attr("fill", "white")
            .attr("stroke", "black");

        legend.append("text")
            .attr("x", 10)
            .attr("y", 20)
            .attr("font-family", "Fira Sans")
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
            .attr("fill", "#FF0000")
            .text("Maximum");

        legend.append("text")
            .attr("x", 10)
            .attr("y", 40)
            .attr("font-family", "Fira Sans")
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
            .attr("fill", "#0000FF")
            .text("Minimum");

    });

}

// Kernel Density Estimation
function kernelDensityEstimator(kernel, thresholds, data) {
    return thresholds.map(function (t) { return [t, d3.mean(data, function (d) { return kernel(t - d); })]; });
}

function kernelEpanechnikov(k) {
    return function (v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
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

    drawChart_rigid();

$("#city").on('change', function(){
    cityName = $(this).val();
    drawChart_rigid();
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
    drawChart_rigid();
});
document.getElementById('removeButton').addEventListener('click', function() {
    var inputValue = document.getElementById('inputField').value;
    // remove from the list
    years_list = years_list.filter(function(value, index, arr){ 
        return value != inputValue;
    });
    drawChart_rigid();
});