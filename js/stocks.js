class Stocks {
  constructor(tooltip, classSelector) {
    this.classSelector = classSelector;
    this.tooltip = tooltip;
  }

  render(data) {
    console.log(data);
    let map = d3.select("#stocks").classed("stocks", true);
    let margin = { top: 30, right: 0, bottom: 30, left: 0 };
    //Gets access to the div element created for this chart and legend element from HTML
    let svgBounds = map.node().getBoundingClientRect();
    let svgWidth = svgBounds.width - margin.left - margin.right;
    let svgHeight = svgWidth / 2;

    const svg = map.append("svg");
  }
}
