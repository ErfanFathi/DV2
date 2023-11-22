const URL = "https://erfanfathi.github.io/DV2/";

// Set the dimensions and margins of the graph
var margin = { top: 10, right: 100, bottom: 10, left: 200 },
  width = 1200 - margin.left - margin.right,
  height = 1000 - margin.top - margin.bottom;

// Format variables
var formatNumber = d3.format(",.0f"), // zero decimal places
  format = function (d) { return formatNumber(d); },
  color = d3.scaleOrdinal(d3.schemeCategory10);

// Append the SVG object to the body of the page
var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
  .nodeWidth(40)
  .nodePadding(45)
  .size([width, height]);

var path = sankey.links();

// Load the data
d3.csv(URL + "data/Alluvial/data.csv").then(function (data) {

  // Set up graph in the same style as the original example but empty
  sankeydata = { "nodes": [], "links": [] };

  data.forEach(function (d) {
    sankeydata.nodes.push({ "name": d.source });
    sankeydata.nodes.push({ "name": d.target });
    sankeydata.links.push({
      "source": d.source,
      "target": d.target,
      "value": +d.value
    });
  });

  // Return only the distinct nodes
  sankeydata.nodes = Array.from(
    d3.group(sankeydata.nodes, d => d.name),
    ([value]) => (value)
  );

  // Loop through each link replacing the text with its index from node
  sankeydata.links.forEach(function (d, i) {
    sankeydata.links[i].source = sankeydata.nodes
      .indexOf(sankeydata.links[i].source);
    sankeydata.links[i].target = sankeydata.nodes
      .indexOf(sankeydata.links[i].target);
  });

  // Now loop through each node to make nodes an array of objects
  sankeydata.nodes.forEach(function (d, i) {
    sankeydata.nodes[i] = { "name": d };
  });

  graph = sankey(sankeydata);

  // add tooltip
  const tooltip =d3.select('body')
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("background-color", "white")
    .style("font-family","Fira Sans")

    const mouseover_link = function(event,d) {
        tooltip
        .html(d.source.name + 
                "<br>" +
                d.target.name +
                "<br>" +
                "Value: " + d.value)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px")
        .style("opacity", 1)
    }

    const mousemove_link = function(event,d) {
        tooltip
        .html(d.source.name + 
            "<br>" +
            d.target.name +
            "<br>" +
            "Value: " + d.value)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px")
    }

    const mouseleave_link = function() {
        tooltip
        .style("opacity", 0)
    }

    const mouseover_node = function(event,d) {
        tooltip
        .html(d.name + 
                "<br>" +
                "Value: " + d.value)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px")
        .style("opacity", 1)
    }

    const mousemove_node = function(event,d) {
        tooltip
        .html(d.name + 
            "<br>" +
            "Value: " + d.value)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px")
    }

    const mouseleave_node = function() {
        tooltip
        .style("opacity", 0)
    }

  // Add in the links
  var link = svg.append("g")
    .selectAll(".link")
    .data(graph.links)
    .enter().append("path")
    .attr("class", "link")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke-width", function (d) { return d.width; })
    .on("mouseover", mouseover_link)
    .on("mousemove", mousemove_link)
    .on("mouseleave", mouseleave_link);


  // Add in the nodes
  var node = svg.append("g")
    .selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
    .attr("class", "node")
    .on("mouseover", mouseover_node)
    .on("mousemove", mousemove_node)
    .on("mouseleave", mouseleave_node);

  // Add the rectangles for the nodes
  node.append("rect")
    .attr("x", function (d) { return d.x0; })
    .attr("y", function (d) { return d.y0; })
    .style("stroke", "black")
    .style("stroke-width", 2)
    .attr("height", function (d) { return d.y1 - d.y0; })
    .attr("width", sankey.nodeWidth())
    .style("fill", function (d) {
      return d.color = color(d.name.replace(/ .*/, ""));
    })
    .style("stroke", function (d) {
      return d3.rgb(d.color).darker(5);
    });

  // Add in the text for the nodes
  node.append("text")
    .attr("x", function (d) { return d.x0 - 6; })
    .attr("y", function (d) { return (d.y1 + d.y0) / 2; })
    .attr("dy", "0.35em")
    .attr("text-anchor", "end")
    .text(function (d) { return d.name; })
    .style("fill", function (d) { return d.color; })
    .filter(function (d) { return d.x0 < width / 2; })
    .attr("x", function (d) { return d.x1 + 6; })
    .attr("text-anchor", "start");
});
