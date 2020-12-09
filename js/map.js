class Map {
  constructor() {
    this.map = null;
    this.data = [];
    this.parentData = [];
    this.circle = null;
    // vm.margin = { top: 30, right: 0, bottom: 30, left: 0 };
  }

  async init() {
    var vm = this;
    vm.map = d3.select("#map").classed("map", true).append("svg").attr("viewBox", [-225, -50, 1350, 660]);
    var us = await d3.json("json/states-albers-10m.json");
    var path = d3.geoPath();

    vm.map
      .append("path")
      .datum(topojson.merge(us, us.objects.states.geometries))
      .attr("fill", "#ddd")
      .attr("d", path);

    vm.map
      .append("path")
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", "2px")
      .attr("stroke-linejoin", "round")
      .attr("d", path);

  }

  cleanMap(data) {
    d3.select("#map>svg").selectAll("circle").remove();
    this.parentData = data;
    this.data = data;
    this.circle = {r: 5, fill: "blue", id: "all-events"};
    this.render();
  }
  
  selectedEvent(event) {
    console.log(event)
    this.map.selectAll("#selected-events").remove();
    this.data = [];
    this.circle = {r: 8, fill: "red", id: "selected-events"};
    this.parentData.forEach(x => {
      if(x.groupingName === event && x.coords) {
        this.data.push(x);
      }
    })
    this.render();
  }
  
  render() {
    let projection = d3.geoAlbersUsa().scale(1280).translate([480, 300]);

    this.data.forEach(x => {
      if(x.coords) {
        this.map
          .append("circle")
          .attr("id", this.circle.id)
          .style("fill", this.circle.fill)
          .attr("transform", `translate(${projection(x.coords)})`)
          .attr("r", this.circle.r);
      }
    })
  }
}
