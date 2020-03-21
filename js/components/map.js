class Map {
  constructor(mapCountainer) {
    this.mapCountainer = mapCountainer;
    this.mapSvg = this.mapCountainer.append("svg");
    this.react = this.mapSvg.append("rect").attr("class", "background");
    this.mapSelf = this.mapSvg.append("g");
    this.groups = []; // 圖層
    this.actions = {}; // 事件
    this.colors = {
      green: "#cff1e1",
      yellow: "#fffed5",
      red: "#ffc4c4",
      gray: "#868686"
    }
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;

    this.resetWidthAndHeight();
    this.bindMapEvent();
  }

  set width(width) {
    this._width = width;
  }
  get width() {
    return this._width;
  }

  set height(height) {
    this._height = height;
  }
  get height() {
    return this._height;
  }

  set translateX(translateX) {
    this._translateX = translateX;
  }
  get translateX() {
    return this._translateX;
  }

  set translateY(translateY) {
    this._translateY = translateY;
  }
  get translateY() {
    return this._translateY;
  }

  resetWidthAndHeight() {
    this.width = window.innerWidth;
    this.height = window.innerHeight - document.getElementById("weather").clientHeight - 6;
    this.mapSvg
      .attr("width", this.width)
      .attr("height", this.height);
    this.react
      .attr("width", this.width)
      .attr("height", this.height);

    const gData = this.mapSelf[0][0].getBBox();
    this.gWidth = gData.width;
    this.gHeight = gData.height;
    this.translateX = (window.innerWidth - this.gWidth) / 2;
    this.translateY = 0;
    this.mapSelf.attr("transform", `translate(${this.translateX},${this.translateY})scale(${this.scale})`);
  }

  // Get mouse position
  getCursorPosition(e) {
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

  bindMapEvent() {
    const map = this;
    const svg = map.mapSvg[0][0];

    let shiftX = 0;
    let shiftY = 0;

    const getTransX = function (pageX) {
      return map.translateX + pageX - shiftX;
    }
    const getTransY = function (pageY) {
      return map.translateY + pageY - shiftY;
    }

    const moveAt = function (pageX, pageY) {
      return `translate(${getTransX(pageX)},${getTransY(pageY)})scale(${map.scale})`;
    }

    const draging = function (event) {
      svg.style.cursor = "grabbing";
      map.mapSelf.attr("transform", moveAt(event.pageX, event.pageY));
      event.stopPropagation();
    }

    const drop = function (event) {
      svg.style.cursor = "grab";
      map.translateX = getTransX(event.pageX);
      map.translateY = getTransY(event.pageY);
      stop();
    }

    const stop = function () {
      svg.removeEventListener("mousemove", draging);
      svg.removeEventListener("mouseup", drop);
    }

    svg.addEventListener("mousedown", function (event) {
      shiftX = event.clientX;
      shiftY = event.clientY;

      svg.addEventListener("mousemove", draging);
      svg.addEventListener("mouseup", drop);
    }, true);
    document.body.addEventListener("mouseleave", stop);

    const scrollSensitivity = 0.25;
    svg.addEventListener("mousewheel", function (event) {
      let evt = event || window.event;
      let scrollVar = evt.detail ? evt.detail * scrollSensitivity : (evt.wheelDelta / 120) * scrollSensitivity;

      let scroll = map.scale + scrollVar;
      if (scroll < 0.6) scroll = 0.6;
      else if (scroll > 3) scroll = 3;
      if (scroll !== map.scale) {
        map.translateX -= evt.pageX * scrollVar;
        map.translateY -= evt.pageY * scrollVar;
      }
      map.scale = scroll;

      map.mapSelf
      // .transition()
      //   .duration(500)
      //   .ease('linear')
        .attr("transform", `translate(${map.translateX},${map.translateY})scale(${map.scale})`);
    })
  }

  createGroup() {
    const object = {
      g: this.mapSelf.append("g").attr("class", "group"),
      layers: []
    };
    this.groups.push(object);
  }

  createLayer(index) {
    const group = this.groups[index];
    if (index !== undefined && group) {
      const object = {
        g: group.g.append("g").attr("class", "layer")
      };
      group.layers.push(object);
    }
  }

  drawLayer(data, layer, mouseover) {
    const projection = d3.geo.mercator()
      .scale(9000)
      .center([119.5, 25]) // 調整位置

    const path = d3.geo.path()
      .projection(projection);

    layer.selectAll("path")
      .data(data)
      .enter().append("path")
      .attr("d", path)
      .attr("class", "district")
      .attr("vector-effect", "non-scaling-stroke")
      .attr("stroke", this.colors.gray)
      .on("mouseover", mouseover);
  }
}