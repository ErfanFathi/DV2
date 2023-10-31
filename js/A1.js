// Import the D3 packages we want to use
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

function drawChart_bar1(name) {
    var city_name;
    // if name was 1 then set it to Albuquerque
    if (name == 1) {
        city_name = "Albuquerque";
    }else {
        city_name = name;
    }
    console.log(city_name);
    // Select the container for the bar chart
    let div_id = "#bar1";
    // Remove any previous chart
    d3.select(div_id).select("svg").remove();

    // Init the div target dimentions
    let ratio = 2.5; // 3 width = 1 height
    let win_width = d3.select(div_id).node().getBoundingClientRect().width;
    let win_height = win_width / ratio;

    // MInit argins
    let margin = {top: 30, right: 200, bottom: 140, left: 70};
    let width = win_width - margin.right - margin.left;
    let height = win_height - margin.top - margin.bottom;

    let svg = d3.select(div_id)
        .append("svg")
        .attr("viewBox", "0 0 " + win_width + " " + win_height);

    let xScale = d3.scaleBand().range([0, width]).padding(0.2),
        yScale = d3.scaleLinear().range([height, 0]);

    let g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("../data/A1_Bar1" + city_name + ".csv").then(function(data) {
        data.forEach(function(d) {
            d.count = +d.count;
        });

    data = data.slice(0, 5);

    xScale.domain(data.map(function(d) { return d.scientific_name; }));
    yScale.domain([0, d3.max(data, function(d) { return d.count; })]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
        

    g.append("g")
        .call(d3.axisLeft(yScale).tickFormat(function(d){
            return d;
        }).ticks(5))
        .append("text")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end");

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .style("fill", "steelblue")
        .on("mouseover", onMouseOver) // Add listener for event
        .on("mouseout", onMouseOut)
        .attr("x", function(d) { return xScale(d.scientific_name); })
        .attr("y", function(d) { return yScale(d.count); })
        .attr("width", xScale.bandwidth())
        .transition()
        .ease(d3.easeLinear)
        .duration(500)
        .delay(function(d,i){ return i * 50})
        .attr("height", function(d) { return height - yScale(d.count); });
	})
        
    function onMouseOver(d, i) {
        d3.select(this).attr('class', 'highlight');
        d3.select(this)
            .transition()     // adds animation
            .duration(100)
            .attr('width', xScale.bandwidth() + 5)
            .attr("y", function(d) { return yScale(i.count) - 10; })
            .attr("height", function(d) { return height - yScale(i.count) + 10; });
        // fill the bar
        d3.select(this).style('fill', 'orange');
        // Name
        g.append("text")
            .attr('class', 'val') 
            .attr('x', function() {
                return xScale(i.scientific_name);
            })
            .attr('y', function() {
                return yScale(i.count) - 23;
            })
            .attr("font-size", "10px")
            .attr("font-weight", "regular")
            .text(function() {
                return ["Name: " + i.scientific_name];
            });
            // Count
            g.append("text")
            .attr('class', 'val') 
            .attr('x', function() {
                return xScale(i.scientific_name);
            })
            .attr('y', function() {
                return yScale(i.count) - 10;
            })
            .attr("font-size", "10px")
            .attr("font-weight", "regular")
            .text(function() {
                return ["Count:" + i.count];
            });
            // Average height
            g.append("text")
            .attr('class', 'val') 
            .attr('x', function() {
                return xScale(i.scientific_name);
            })
            .attr('y', function() {
                return yScale(i.count) ;
            })
            .attr("font-size", "10px")
            .attr("font-weight", "regular")
            .text(function() {
                return ["Average Height:" + i.height_M];
            });
    }

    function onMouseOut(d, i) {
        // use the text label class to remove label on mouseout
        d3.select(this).attr('class', 'bar');
        d3.select(this)
            .transition()     // adds animation
            .duration(400)
            .attr('width', xScale.bandwidth())
            .attr("y", function(d) { return yScale(d.count); })
            .attr("height", function(d) { return height - yScale(d.count); });

        d3.select(this).style('fill', 'steelblue');

        d3.selectAll('.val')
            .remove()
    }
}

// Selectation Part
fetch("../utils/cities.json")
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

$("#city").on('change', function(){
    var cityName = $(this).val();
    drawChart_bar1(cityName)
});