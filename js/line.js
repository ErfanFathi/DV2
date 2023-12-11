const URL = "https://erfanfathi.github.io/DV2/";
// A list for years
var years_list = [1995, 2010, 2012];
var cityName = "Alabama";

// func for draw line chart
function drawChart_line1() {
    d3.select("#line1").select("svg").remove();

    var margin = { top: 70, right: 10, bottom: 70, left: 70 },
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

    // add tooltip
    const tooltip = d3.select('body')
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("background-color", "white")
        .style("font-family","Fira Sans")

    var yearDataAvg, yearDataMax, yearDataMin;
    var linechart_svg;

    // add the svg object
    linechart_svg = d3.select("#line1").append("svg")
        .attr("id", "linechart_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Read the csv's
    Promise.all([
        d3.csv(URL + "data/Time_and_Distribution/Average/"+ cityName + ".csv"),
        d3.csv(URL + "data/Time_and_Distribution/Maximum/"+ cityName + ".csv"),
        d3.csv(URL + "data/Time_and_Distribution/Minimum/"+ cityName + ".csv")
    ]).then(function (datasets) {
        var dataAvg = datasets[0];
        var dataMax = datasets[1];
        var dataMin = datasets[2];

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

        var x = d3.scaleBand()
            .domain(months)
            .range([0, width])
            .padding(1);
    
        var y = d3.scaleLinear()
            .domain([minTemperature, maxTemperature])
            .range([height, 0]);

        linechart_svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text") 
            .style("font-size", "15px")
            .style("font-weight", "bold")
            .style("font-family","Fira Sans");

        linechart_svg.append("g")
            .call(d3.axisLeft(y));
    
        // Add y-axis label
        linechart_svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 25 - margin.left)
            .attr("x", 10 - height / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "15px")
            .style("font-weight", "bold")
            .style("font-family","Fira Sans")
            .text("Temperature (°C)");

        // Append a title to the SVG
        linechart_svg.append("text")
            .attr("x", width / 2)
            .attr("y", 0 - margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .style("font-family","Fira Sans")
            .text(`${years_list.join(' - ')}`);

            years_list.forEach(function (year) {
            yearDataAvg = dataAvg.filter(function (d) { return +d.year == +year; });
            yearDataMax = dataMax.filter(function (d) { return +d.year == +year; });
            yearDataMin = dataMin.filter(function (d) { return +d.year == +year; });


        var color = d3.schemeCategory10[years_list.indexOf(year)];

        var lineMin = d3.line()
            .defined(function(d) { return !isNaN(d[1]); })
            .x(function(d) { return x(d[0]); })
            .y(function(d) { return y(d[1]); });

        var filteredDataMin = months.map(function(month) {
                return [month, +yearDataMin[0][month]];
            }).filter(function(d) {
                return !isNaN(d[1]);
            });

        linechart_svg.append("path")
            .datum(filteredDataMin)
            .attr("class", "line-min-" + year)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 1.5)
            .attr("d", lineMin);

        var lineMax = d3.line()
            .defined(function(d) { return !isNaN(d[1]); })
            .x(function(d) { return x(d[0]); })
            .y(function(d) { return y(d[1]); });
        
        var filteredDataMax = months.map(function(month) {
            return [month, +yearDataMax[0][month]];
        }).filter(function(d) {
            return !isNaN(d[1]);
        });

        const mouseover_max = function(event,d) {
            tooltip
            .html("Year : " + year +
                "<br>" +
                "Month : " + d + 
                "<br>" +
                "Value : " + yearDataMax[0][d])
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 10) + "px")
            .style("opacity", 1)
        }
    
        const mousemove_max = function(event,d) {
            tooltip
            .html("Year : " + year +
                "<br>" +
                "Month : " + d + 
                "<br>" +
                "Value : " + yearDataMax[0][d])
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 10) + "px")
        }

        const mouseover_avg = function(event,d) {
            tooltip
            .html("Year : " + year +
                "<br>" +
                "Month : " + d + 
                "<br>" +
                "Value : " + yearDataMax[0][d])
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 10) + "px")
            .style("opacity", 1)
        }
    
        const mousemove_avg = function(event,d) {
            tooltip
            .html("Year : " + year +
                "<br>" +
                "Month : " + d + 
                "<br>" +
                "Value : " + yearDataMax[0][d])
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 10) + "px")
        }

        const mouseover_min = function(event,d) {
            tooltip
            .html("Year : " + year +
                "<br>" +
                "Month : " + d + 
                "<br>" +
                "Value : " + yearDataMax[0][d])
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 10) + "px")
            .style("opacity", 1)
        }
    
        const mousemove_min = function(event,d) {
            tooltip
            .html("Year : " + year +
                "<br>" +
                "Month : " + d + 
                "<br>" +
                "Value : " + yearDataMax[0][d])
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 10) + "px")
        }
    
        const mouseleave = function() {
            tooltip
            .style("opacity", 0)
        }
        
        linechart_svg.append("path")
            .datum(filteredDataMax)
            .attr("class", "line-max-" + year)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 1.5)
            .attr("d", lineMax);
    
        linechart_svg.selectAll(".circle-avg-" + year)
            .data(months.filter(function(month) {
                return !isNaN(yearDataAvg[0][month]);
            }))
            .enter().append("circle")
            .attr("class", "circle-avg-" + year)
            .attr("cx", function (d) { return x(d); })
            .attr("cy", function (d) { return y(yearDataAvg[0][d]); })
            .attr("r", 4)
            .style("fill", color)
            .on("mouseover", mouseover_avg)
            .on("mousemove", mousemove_avg)
            .on("mouseleave", mouseleave);
    
        linechart_svg.selectAll(".circle-max-" + year)
            .data(months.filter(function(month) {
                return !isNaN(yearDataMax[0][month]);
            }))
            .enter().append("circle")
            .attr("class", "circle-max-" + year)
            .attr("cx", function (d) { return x(d); })
            .attr("cy", function (d) { return y(yearDataMax[0][d]); })           
            .attr("r", 4)
            .style("fill", color)
            .on("mouseover", mouseover_max)
            .on("mousemove", mousemove_max)
            .on("mouseleave", mouseleave);
            
    
        linechart_svg.selectAll(".circle-min-" + year)
            .data(months.filter(function(month) {
                return !isNaN(yearDataMin[0][month]);
            }))
            .enter().append("circle")
            .attr("class", "circle-min-" + year)
            .attr("cx", function (d) { return x(d); })
            .attr("cy", function (d) { return y(yearDataMin[0][d]); })       
            .attr("r", 4)
            .style("fill", color)
            .on("mouseover", mouseover_min)
            .on("mousemove", mousemove_min)
            .on("mouseleave", mouseleave);
    });
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

drawChart_line1();

$("#city").on('change', function(){
    cityName = $(this).val();
    drawChart_line1();
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
    drawChart_line1();
});
document.getElementById('removeButton').addEventListener('click', function() {
    var inputValue = document.getElementById('inputField').value;
    // remove from the list
    years_list = years_list.filter(function(value, index, arr){ 
        return value != inputValue;
    });
    drawChart_line1();
});