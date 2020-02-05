// Set map data
const countryData = mapData.features;
const townData = mapDetailData.features;

// Set svg data
let width = document.getElementById("map").clientWidth;
let height = document.getElementById("map").clientHeight;
let centered;
let thisCountry;

// Set map location
var projection = d3.geo.mercator()
  .scale(9000)
  // Center the Map in Colombia
  .center([120.5, 24]) // 調整位置
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);

// Set svg width & height
const svg = d3.select("#map")
  .attr("width", width)
  .attr("height", height);

// Add background
svg.append("rect")
  .attr("class", "background")
  .attr("width", width)
  .attr("height", height)
  .on("mouseover", mouseover)
  .on("click", clicked);

const g = svg.append("g");

const mapDetailLayer = g.append("g")
  .classed("map-layer", true);

const mapLayer = g.append("g")
  .classed("map-layer", true);

// Draw each province as a path
mapLayer.selectAll("path")
  .data(countryData)
  .enter().append("path")
  .attr("d", path)
  .attr("vector-effect", "non-scaling-stroke")
  .attr("fill", "#cff1e1")
  .on("mouseover", mouseover);

mapDetailLayer.selectAll("path")
  .data(townData)
  .enter().append("path")
  .attr("d", path)
  .attr("stroke", "#868686")
  .attr("vector-effect", "non-scaling-stroke")
  .attr("fill", "#fffed5")
  .on("click", clicked);

// When mouseover, show town
function mouseover() {
  if (thisCountry !== this) {
    if (thisCountry) {
      d3.select(thisCountry).style("display", "inline");
    }
    if (this.tagName === "path") {
      d3.select(this).style("display", "none");
    }
    thisCountry = this;
  }
}

// When clicked, zoom in
function clicked(d) {
  let x, y, k;

  // Compute centroid of the selected path
  if (d && centered !== d) {
    let centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  // Zoom
  g.transition()
    .duration(200)
    .attr("transform", `translate(${width / 2},${height / 2})scale(${k})translate(${-x},${-y})`);
}