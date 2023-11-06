// Import the D3 packages we want to use
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const URL = "https://erfanfathi.github.io/DV2/";

function drawChart_bar1(name) {
    var city_name;
    // if name was 1 then set it to Albuquerque
    if (name == 1) {
        city_name = "Albuquerque";
    }else {
        city_name = name;
    }

    // Select the container for the bar chart
    let div_id = "#bar1";
    // Remove any previous chart
    d3.select(div_id).select("svg").remove();

    // Init the div target dimentions
    let ratio = 2.5; // 3 width = 1 height
    let win_width = d3.select(div_id).node().getBoundingClientRect().width;
    let win_height = win_width / ratio;

    // MInit argins
    let margin = {top: 50, right: 70, bottom: 100, left: 70};
    let width = win_width - margin.right - margin.left;
    let height = win_height - margin.top - margin.bottom;

    let svg = d3.select(div_id)
        .append("svg")
        .attr("viewBox", "0 0 " + win_width + " " + win_height);

    let xScale = d3.scaleBand().range([0, width]).padding(0.2),
        yScale = d3.scaleLinear().range([height, 0]);

    let g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(URL + "data/Barchart/A1_Bar1" + city_name + ".csv").then(function(data) {
        data.forEach(function(d) {
            d.count = +d.count;
        });

    data = data.slice(0, 5);

    xScale.domain(data.map(function(d) { return d.scientific_name; }));
    yScale.domain([0, d3.max(data, function(d) { return d.count; })]);

    // create a tooltip
    const tooltip =d3.select('body').select(div_id)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("background-color", "white")
        .style("font-family","Fira Sans")

    const mouseover = function(event,d) {
        tooltip
        .html("Count: " + d.count + "<br>" + "Name: " + d.scientific_name + "<br>" + "Average Height: " + d.height_M)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px")
        .style("opacity", 1)
        d3.select(this)
        .style("stroke", "black")
    }

    const mousemove = function(event,d) {
        tooltip
        .html("Count: " + d.count + "<br>" + "Name: " + d.scientific_name + "<br>" + "Average Height: " + d.height_M)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px")
    }

    const mouseleave = function() {
        tooltip
        .style("opacity", 0)
        d3.select(this)
        .style("stroke", "none")
    }

    g.append("g")
        .call(d3.axisBottom(xScale))
        .attr("transform", "translate(0," + height + ")")
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-35)")
        .style("text-anchor", "end");

    g.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("y", 5)
        .attr("dy", "0.2em")
        .style("text-anchor", "end");


    // add the y Axis label
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x",0 - (height / 2))
        .attr("dy", "0.5em")
        .style("text-anchor", "middle")
        .style("font-family","Fira Sans")
        .text("Count");

    // add the x Axis label
    g.append("text")
        .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
        .attr("dy", "0.5em")
        .style("text-anchor", "middle")
        .style("font-family","Fira Sans")
        .text("Name");

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .style("fill", "orange")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .attr("x", function(d) { return xScale(d.scientific_name); })
        .attr("y", function(d) { return yScale(d.count); })
        .attr("width", xScale.bandwidth())
        .transition()
        .ease(d3.easeLinear)
        .duration(500)
        .delay(function(d,i){ return i * 50})
        .attr("height", function(d) { return height - yScale(d.count); });
	})
}

function drawChart_bar2(name) {
    var city_name;
    // if name was 1 then set it to Albuquerque
    if (name == 1) {
        city_name = "Albuquerque";
    }else {
        city_name = name;
    }

    // Select the container for the bar chart
    let div_id = "#bar2";
    // Remove any previous chart
    d3.select(div_id).select("svg").remove();

    // Init the div target dimentions
    let ratio = 2.5; // 3 width = 1 height
    let win_width = d3.select(div_id).node().getBoundingClientRect().width;
    let win_height = win_width / ratio;

    // MInit argins
    let margin = {top: 50, right: 70, bottom: 100, left: 120};
    let width = win_width - margin.right - margin.left;
    let height = win_height - margin.top - margin.bottom;

    let svg = d3.select(div_id)
        .append("svg")
        .attr("viewBox", "0 0 " + win_width + " " + win_height);

    // Define scales for the horizontal bar chart
    const xScale = d3.scaleLinear().range([0, width]);
    const yScale = d3.scaleBand().range([0, height]).padding(0.2);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.csv(URL + "data/Barchart/A1_Bar1" + city_name + ".csv").then(function(data) {
        data.forEach(function(d) {
            d.count = +d.count;
        });

    data = data.slice(0, 5);

    xScale.domain([0, d3.max(data, function(d) { return d.count; })]);
    yScale.domain(data.map(function(d) { return d.scientific_name; }));

    // create a tooltip
    const tooltip =d3.select('body').select(div_id)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("background-color", "white")
        .style("font-family","Fira Sans")

    const mouseover = function(event,d) {
        tooltip
        .html("Count: " + d.count + "<br>" + "Name: " + d.scientific_name + "<br>" + "Average Height: " + d.height_M)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px")
        .style("opacity", 1)
        d3.select(this)
        .style("stroke", "black")
    }

    const mousemove = function(event,d) {
        tooltip
        .html("Count: " + d.count + "<br>" + "Name: " + d.scientific_name + "<br>" + "Average Height: " + d.height_M)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px")
    }

    const mouseleave = function() {
        tooltip
        .style("opacity", 0)
        d3.select(this)
        .style("stroke", "none")
    }

    g.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-35)");

    g.append("g")
        .call(d3.axisBottom(xScale))
        .attr("transform", `translate(0, ${height})`);

    // add the x Axis label
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x",0 - (height / 2))
        .attr("dy", "0.5em")
        .style("text-anchor", "middle")
        .style("font-family","Fira Sans")
        .text("Name");

    // add the y Axis label
    g.append("text")
        .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
        .attr("dy", "0.5em")
        .style("text-anchor", "middle")
        .style("font-family","Fira Sans")
        .text("Count");

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .style("fill", "steelblue")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .attr("y", function(d) { return yScale(d.scientific_name); })
        .attr("x", 0)
        .attr("width", function(d) { return xScale(d.count); })
        .attr("height", yScale.bandwidth())
        .transition()
        .ease(d3.easeLinear)
        .duration(500)
        .delay(function(d,i){ return i * 50});
	})
}

// Selectation Part
fetch(URL + "utils/cities.json")
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
drawChart_bar1("Albuquerque");
drawChart_bar2("Albuquerque");

$("#city").on('change', function(){
    var cityName = $(this).val();
    drawChart_bar1(cityName)
    drawChart_bar2(cityName)
});
