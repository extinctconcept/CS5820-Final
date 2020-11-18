class Map {
  constructor(tooltip, classSelector, topojson) {
    this.classSelector = classSelector;
    this.tooltip = tooltip;
  }

  async render(data) {
    // data points entering map should be an array of gps coords. This can be refactored however to fit whatever we need it to be 
    let tempData = [[523.3754804030681, 353.07903336329866], [544.5356591678276, 355.4857849174865]]

    let map = d3.select("#map").classed("map", true);
    let margin = { top: 30, right: 0, bottom: 30, left: 0 };
    //Gets access to the div element created for this chart and legend element from HTML
    let svgBounds = map.node().getBoundingClientRect();
    let svgWidth = svgBounds.width - margin.left - margin.right;
    let svgHeight = svgWidth / 2;

    let legend = d3.select("#legend").classed("map", true);

    let us = await d3.json("json/states-albers-10m.json");
    let path = d3.geoPath();
    console.log(us);

    const svg = map.append("svg").attr("viewBox", [0, 0, 1075, 910]);

    svg
      .append("path")
      .datum(topojson.merge(us, us.objects.states.geometries))
      .attr("fill", "#ddd")
      .attr("d", path);

    svg
      .append("path")
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-linejoin", "round")
      .attr("d", path);

    tempData.forEach(element => {
        svg
          .append("circle")
          .attr("fill", "blue")
          .attr("transform", `translate(${element})`)
          .attr("r", 5);
    })
  }
}
