class Map {
  constructor(tooltip, classSelector, topojson) {
    this.classSelector = classSelector;
    this.tooltip = tooltip;
  }

  async render(data) {
    let map = d3.select("#map").classed("map", true);

    // Remove any existing svg elements
    map.selectAll("svg").remove();
    
    // set margin around map
    let margin = { top: 30, right: 0, bottom: 30, left: 0 };

    //Gets access to the div element created for this chart and legend element from HTML
    let svgBounds = map.node().getBoundingClientRect();
    let svgWidth = svgBounds.width - margin.left - margin.right;
    let svgHeight = svgWidth / 2;

    let legend = d3.select("#legend").classed("map", true);

    let us = await d3.json("json/states-albers-10m.json");
    let path = d3.geoPath();

    let locations = []
    let projection = d3.geoAlbersUsa().scale(1280).translate([480, 300]);
    

    data.forEach(element => {
      if(element.coords) {
        locations.push(projection({"0": parseFloat(element.coords[1]), "1": parseFloat(element.coords[0])}))
      }
    });

    console.log(locations);

    const svg = map.append("svg").attr("viewBox", [-225, -50, 1350, 660]);

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

    locations.forEach(element => {
        svg
          .append("circle")
          .attr("fill", "blue")
          .attr("transform", `translate(${element})`)
          .attr("r", 5);
    })
  }
}
