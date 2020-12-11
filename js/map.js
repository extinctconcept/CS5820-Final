class Map {
  /**
   * Constructor for Map class
   */
  constructor() {
    this.map = null;
    this.infoPanel = null;
    this.data = [];
    this.parentData = [];
    this.circle = null;
  }

  /**
   * Renders our base map
   * Should only be called once
   * @param {*} infoPanel InfoPanel instance to be saved to our Map instance.
   */
  async init(infoPanel) {
    var vm = this;
    vm.infoPanel = infoPanel;
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

  /**
   * Remove all events from the map when,
   * new year is selected
   * or new data set is selected
   * @param { Array } data Object array of events to be passed to rendering method
   */
  cleanMap(data) {
    d3.select("#map>svg").selectAll("circle").remove();
    this.parentData = data;
    this.data = data;
    this.circle = {r: 5, fill: "blue", id: "all-events"};
    this.render();
  }
  
  /**
   * Renders selected events
   * @param { String } event 
   */
  selectedEvent(event) {
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
  
  /**
   * Renders all the events for the current selection.
   */
  render() {
    var vm = this;
    let projection = d3.geoAlbersUsa().scale(1280).translate([480, 300]);

    vm.data.forEach(x => {
      if(x.coords) {
        vm.map
          .append("circle")
          .attr("id", vm.circle.id)
          .style("fill", vm.circle.fill)
          .attr("transform", `translate(${projection(x.coords)})`)
          .attr("r", vm.circle.r)
          .on("click", function() {
            vm.infoPanel.clickEvent(x.groupingName);
          })
          .append("title")
          .text(x.groupingName);
      }
    })
  }
}
