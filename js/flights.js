class Flights {
  constructor(tooltip, classSelector) {
    this.classSelector = classSelector;
    this.tooltip = tooltip;
  }

  render(data) {
  	console.log(data);
  	let flights = d3.select("#stocks").classed("flights", true);
  	flights.selectAll("svg").remove();
    let margin = { top: 30, right: 90, bottom: 30, left: 0 };
    //Gets access to the div element created for this chart and legend element from HTML
    let svgBounds = flights.node().getBoundingClientRect();
    let svgWidth = svgBounds.width - margin.left - margin.right;
    let svgHeight = svgBounds.height - margin.bottom - margin.top;

    const svg = flights.append("svg");
    svg.append("g").classed("xFlightAxis",true);
    svg.append("g").classed("yFlightAxis",true);
    svg.attr("height", svgHeight + margin.bottom);
    svg.attr("width", svgWidth);
  }
}