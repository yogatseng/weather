// Set map data
const countryData = mapData.features;
const townData = mapDetailData.features;

// Set svg data
let width = document.body.clientWidth;
let height = document.body.clientHeight;
let x = width / 2;
let y = height / 2;
let k = 1;
let centered;
let thisCountry;
let thisTown;
let eventX = width / 2;
let eventY = height / 2;
const colors = {
  green: "#cff1e1",
  yellow: "#fffed5",
  red: "#ffc4c4",
  gray: "#868686"
}

// Set map location
const projection = d3.geo.mercator()
  .scale(9000)
  // Center the Map in Colombia
  .center([120.5, 24]) // 調整位置
  .translate([width / 2, height / 2]);

const path = d3.geo.path()
  .projection(projection);

const drag = d3.behavior.drag()
  .on("dragstart", function () {
    g.attr("cursor", "grab");
    let startPosition = getCursorPosition();
    eventX = startPosition[0];
    eventY = startPosition[1];
  })
  .on("drag", function () {
    x += eventX - d3.event.x;
    y += eventY - d3.event.y;
    eventX = d3.event.x;
    eventY = d3.event.y;
    g.attr("cursor", "grabbing")
      .attr("transform", `translate(${width / 2},${height / 2})scale(${k})translate(${-x},${-y})`);
  })
  .on("dragend", function () {
    g.attr("cursor", "default");
  });

const zoom = d3.behavior.zoom()
  .translate(projection.translate())
  .scale(1)
  .scaleExtent([height, 8 * height])
  .on("zoom", function () {
    k = d3.event.scale / 600;
    g.attr("transform", `translate(${width / 2},${height / 2})scale(${k})translate(${-x},${-y})`);
  });

// Set svg width & height
const svg = d3.select("#map")
  .attr("width", width)
  .attr("height", height)
  .call(drag)
  .call(zoom);

// Add background
svg.append("rect")
  .attr("class", "background")
  .attr("width", width)
  .attr("height", height)
  .on("mouseover", mouseover)
  .on("click", clicked);

const g = svg.append("g");

const textG = svg.append("g");

const bigText = textG.append("text")
  .classed("big-text", true)
  .attr("x", 20)
  .attr("y", 45);

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
  .attr("fill", colors.green)
  .on("mouseover", mouseover);

mapDetailLayer.selectAll("path")
  .data(townData)
  .enter().append("path")
  .attr("d", path)
  .attr("stroke", colors.gray)
  .attr("vector-effect", "non-scaling-stroke")
  .attr("fill", colors.yellow)
  .on("mouseover", function (d, e) {
    let x = d3.event.pageX - document.getElementById("map").getBoundingClientRect().x + 10;
    let y = d3.event.pageY - document.getElementById("map").getBoundingClientRect().y + 10;

    bigText
      .text(d.properties.TOWNNAME)
      .attr("x", x)
      .attr("y", y);

    if (thisTown !== this) {
      if (thisTown) {
        d3.select(thisTown).style("fill", colors.yellow);
      }
      d3.select(this).style("fill", colors.red);
      thisTown = this;
    }
  });

// When mouseover, show town
function mouseover() {
  if (thisTown) {
    bigText.text("");
    d3.select(thisTown).style("fill", colors.yellow);
    thisTown = null;
  }
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
  console.log(width / 2, height / 2, k, -x, -y)
  // Zoom
  g.transition()
    .attr("transform", `translate(${width / 2},${height / 2})scale(${k})translate(${-x},${-y})`);
}

// Get mouse position
function getCursorPosition(e) {
  var posx = 0;
  var posy = 0;

  if (!e) var e = window.event;

  if (e.pageX || e.pageY) {
    posx = e.pageX - document.documentElement.scrollLeft - document.body.scrollLeft;
    posy = e.pageY - document.documentElement.scrollTop - document.body.scrollTop;
  }
  else if (e.clientX || e.clientY) { // For IE
    posx = e.clientX; //+ document.body.scrollLeft+ document.documentElement.scrollLeft;
    posy = e.clientY; //+ document.body.scrollTop + document.documentElement.scrollTop;

    //如果想取得目前的捲動值 就把後面的註解拿掉
  }

  return [posx, posy]; // posx posy就是游標的X,Y值了
}