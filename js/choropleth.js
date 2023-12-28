import * as d3 from "https://cdn.jsdelivr.net/npm/d3@4/+esm";

const URL = "https://erfanfathi.github.io/DV2/";

function drawChart_choropleth()
{
    //Width and height of map
    var width = 1200;
    var height = 500;

    var lowColor = 'white'
    var highColor = 'darkblue'

    var div_id = "choropleth"

    // add tooltip
    const tooltip =d3.select('body').select("#" + div_id)
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("background-color", "white")
    .style("font-family","Fira Sans")

    const onmouseover = (event, d) => {
        tooltip
        .style("opacity", 1)
        .html("Postal : " + event.properties.abbr + 
            "<br>" 
            + "State : " + event.properties.name
            + "<br>"
            + "Density : " + event.properties.value
            + "<br>"
            + "Area : " + event.properties.area)
        .style("left", path.centroid(event)[0] + 400 + "px")
        .style("top", path.centroid(event)[1] + 100 + "px")
    }

    const onmousemove = (event, d) => {
        tooltip
        .style("opacity", 1)
        .html("Postal : " + event.properties.abbr + 
                "<br>" 
                + "State : " + event.properties.name
                + "<br>"
                + "Density : " + event.properties.value
                + "<br>"
                + "Area : " + event.properties.area)
        .style("left", path.centroid(event)[0] + 400 + "px")
        .style("top", path.centroid(event)[1] + 100 + "px")
    }

    const onmouseout = (event, d) => {
        tooltip
        .style("opacity", 0)
    }

    // D3 Projection
    var projection = d3.geoAlbersUsa()
        .translate([width / 2, height / 2]) // translate to center of screen
        .scale([1000]); // scale things down so see entire US

    // Define path generator
    var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
    .projection(projection); // tell path generator to use albersUsa projection

    //Create SVG element and append map to the SVG
    var svg = d3.select("#" + div_id)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

    // Load in my states data!
    d3.csv(URL + "data/Maps/statesdata_2.csv", function(data) {
        var dataArray = [];
        for (var d = 0; d < data.length; d++) {
            dataArray.push(parseFloat(data[d].value))
        }
        var minVal = d3.min(dataArray)
        var maxVal = d3.max(dataArray)
        var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor])
        
    // Load GeoJSON data and merge with states data
    d3.json(URL + "utils/us-states.json", function(json) {

        // Loop through each state data value in the .csv file
        for (var i = 0; i < data.length; i++) {

        // Grab State Name
        var dataState = data[i].state;

        // Grab data value 
        var dataValue = data[i].value;

        // Find the corresponding state inside the GeoJSON
        for (var j = 0; j < json.features.length; j++) {
            var jsonState = json.features[j].properties.name;

            if (dataState == jsonState) {

            // Copy the data value into the JSON
            json.features[j].properties.value = dataValue;

            json.features[j].properties.area = data[i].area;

            // Stop looking through the JSON
            break;
            }
        }
        }

        // Bind the data to the SVG and create one path per GeoJSON feature
        svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#000")
        .style("stroke-width", "1")
        .style("fill", function(d) { return ramp(d.properties.value) })
        .on("mouseover", onmouseover)
        .on("mousemove", onmousemove)
        .on("mouseout", onmouseout);
        
    });
    });
};


function drawChart_choropleth_density()
{
    //Width and height of map
    var width1 = 1200;
    var height1 = 500;

    var lowColor1 = 'white'
    var highColor1 = 'darkgreen'

    var div_id1 = "choropleth_density"

    // add tooltip
    const tooltip =d3.select('body')
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("background-color", "white")
    .style("font-family","Fira Sans")

    // D3 Projection
    var projection = d3.geoAlbersUsa()
        .translate([width1 / 2, height1 / 2]) // translate to center of screen
        .scale([1000]); // scale things down so see entire US

    // Define path generator
    var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
        .projection(projection); // tell path generator to use albersUsa projection

    //Create SVG element and append map to the SVG
    var svg = d3.select("#" + div_id1)
        .append("svg")
        .attr("width", width1)
        .attr("height", height1);

    const onmouseover = (event, d) => {
        tooltip
        .style("opacity", 1)
        .html("Postal : " + event.properties.abbr + 
            "<br>" 
            + "State : " + event.properties.name
            + "<br>"
            + "Density : " + event.properties.value
            + "<br>"
            + "Area : " + event.properties.area)
        .style("left", path.centroid(event)[0] + 400 + "px")
        .style("top", path.centroid(event)[1] + (height1 * 1.3) + "px")
    }

    const onmousemove = (event, d) => {
        tooltip
        .style("opacity", 1)
        .html("Postal : " + event.properties.abbr + 
                "<br>" 
                + "State : " + event.properties.name
                + "<br>"
                + "Density : " + event.properties.value
                + "<br>"
                + "Area : " + event.properties.area)
        .style("left", path.centroid(event)[0] + 400 + "px")
        .style("top", path.centroid(event)[1] + (height1 * 1.3) + "px")
    }

    const onmouseout = (event, d) => {
        tooltip
        .style("opacity", 0)
    }

    // Load in my states data!
    d3.csv(URL + "data/Maps/statesdata_2.csv", function(data) {
        var dataArray = [];
        for (var d = 0; d < data.length; d++) {
            dataArray.push(parseFloat(data[d].value)/parseFloat(data[d].area))
        }
        var minVal1 = d3.min(dataArray)
        var maxVal1 = d3.max(dataArray)
        var ramp = d3.scaleLinear().domain([minVal1,maxVal1]).range([lowColor1,highColor1])
        
    // Load GeoJSON data and merge with states data
    d3.json(URL + "utils/us-states.json", function(json) {

        // Loop through each state data value in the .csv file
        for (var i = 0; i < data.length; i++) {

        // Grab State Name
        var dataState = data[i].state;

        // Grab data value 
        var dataValue = data[i].value;

        // Find the corresponding state inside the GeoJSON
        for (var j = 0; j < json.features.length; j++) {
            var jsonState = json.features[j].properties.name;

            if (dataState == jsonState) {

            // Copy the data value into the JSON
            json.features[j].properties.value = dataValue / parseFloat(data[i].area);

            json.features[j].properties.area = data[i].area;

            // Stop looking through the JSON
            break;
            }
        }
        }

        // Bind the data to the SVG and create one path per GeoJSON feature
        svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#000")
        .style("stroke-width", "1")
        .style("fill", function(d) { return ramp(d.properties.value) })
        .on("mouseover", onmouseover)
        .on("mousemove", onmousemove)
        .on("mouseout", onmouseout);
        
    });
    });
};


drawChart_choropleth();
drawChart_choropleth_density();