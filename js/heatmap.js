// Import the D3 packages we want to use
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const URL = "https://erfanfathi.github.io/DV2/";

function draw_heatmap() {
    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 50, bottom: 30, left: 200},
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#heatmap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    d3.csv(URL + "data/Heatmap/heatmap.csv").then(function(data) {
        const gps = Array.from(new Set(data.map(d => d.city)))
        const vars = Array.from(new Set(data.map(d => d.scientific_name)))

        // Build X scales and axis:
        const x = d3.scaleBand()
            .range([ 0, width ])
            .domain(gps)
            .padding(0.01);
            svg.append("g")
            .style("font-size", 10)
            .style("font-family","Fira Sans")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickSize(2))
            .select(".domain").remove()

        // Build Y scales and axis:
        const y = d3.scaleBand()
            .range([ height, 0 ])
            .domain(vars)
            .padding(0.01);
            svg.append("g")
            .style("font-size", 10)
            .style("font-family","Fiara Sans")
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove()

        // Build color scale
        const myColor = d3.scaleSequential()
            .interpolator(d3.interpolateRdYlBu)
            .domain([d3.min(data, d => d.count), d3.max(data, d => d.count)])

        // create a tooltip
        const tooltip =d3.select('body').select("#heatmap")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("background-color", "white")
            .style("font-family","Fira Sans")

        // Three function that change the tooltip when user hover / move / leave a cell

        const mouseover = function(event,d) {
            tooltip
            .html("Count: " + d.count)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 10) + "px")
            .style("opacity", 1)
            d3.select(this)
            .style("stroke", "black")
        }

        const mousemove = function(event,d) {
            tooltip
            .html("Count: " + d.count)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 10) + "px")
        }

        const mouseleave = function() {
            tooltip
            .style("opacity", 0)
            d3.select(this)
            .style("stroke", "none")
        }

        // add the squares
        svg.selectAll()
            .data(data, function(d) {return d.city+':'+d.scientific_name;})
            .join("rect")
            .attr("x", function(d) { return x(d.city) })
            .attr("y", function(d) { return y(d.scientific_name) })
            .attr("rx", 1)
            .attr("ry", 1)
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .style("fill", function(d) { return myColor(d.count)} )
            .style("stroke-width", 1)
            .style("stroke", "none")
            .style("opacity", 0.9)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);
    })

    // Add title to graph
    svg.append("text")
        .attr("class", "title")
            .attr("x", width / 2)
            .attr("y", -margin.top / 2)
            .style("text-anchor", "middle")
            .style("font-size", "15px")
            .style("font-family","Fira Sans")
            .style("font-weight", "bold")
            .text("Heat map");
}

draw_heatmap();