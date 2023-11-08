import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const URL = "https://erfanfathi.github.io/DV2/";

function drawChart_bar3() {
    const margin = { top: 10, right: 150, bottom: 20, left: 140 };
    const width = window.screen.width * 0.6 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    let div_id = "#bar3";
  
    const svg = d3.select(div_id)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .classed('chart', true)
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    d3.csv(URL + "data/Stackbarchart/stack.csv").then(function (data) {
      const subgroups = data.columns.slice(1);
      const groups = data.map(d => (d.city));
  
      const x = d3.scaleLinear()
        .domain([0, 255000])
        .range([0, width]);
  
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
  
      const y = d3.scaleBand()
        .domain(groups)
        .range([0, height])
        .padding([0.2]);
  
      svg.append("g")
        .call(d3.axisLeft(y).tickSizeOuter(0));
  
      const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['red', 'green', 'blue', 'grey', 'black']);
  
      const stackedData = d3.stack()
        .keys(subgroups)
        (data);
  
      stackedData.forEach((element, id) => {
        element.forEach(subElement => {
          subElement.id = id;
        });
      });
  
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
        .html("Name: " + subgroups[d.id] + "<br>" + "Count: " + d.data[subgroups[d.id]])
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px")
        .style("opacity", 1)
        d3.select(this)
        .style("stroke", "black")
    }

    const mousemove = function(event,d) {
        tooltip
        .html("Name: " + subgroups[d.id] + "<br>" + "Count: " + d.data[subgroups[d.id]])
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px")
    }

    const mouseleave = function() {
        tooltip
        .style("opacity", 0)
        d3.select(this)
        .style("stroke", "none")
    }
  
      svg.append("g")
        .selectAll("g")
        .data(stackedData)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .classed("bar", true)
        .attr("y", d => y(d.data.city))
        .attr("x", d => x(d[0]) + 1)
        .attr("width", d => x(d[1]) - x(d[0]))
        .attr("height", y.bandwidth())
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

      const size = 12;
      svg.selectAll("mydots")
        .data(subgroups)
        .enter()
        .append("rect")
        .attr("x", width)
        .attr("y", (d, i) => margin.top + i * (size + 5))
        .attr("width", size)
        .attr("height", size)
        .style("fill", d => color(d));
  
      svg.selectAll("mylabels")
        .data(subgroups)
        .enter()
        .append("text")
        .attr("x", width + size * 1.2)
        .attr("y", (d, i) => margin.top + i * (size + 5) + (size / 2))
        .text(d => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
    });
}



drawChart_bar3();
