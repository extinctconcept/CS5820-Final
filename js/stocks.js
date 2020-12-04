class Stocks {
  constructor(tooltip, classSelector) {
    this.classSelector = classSelector;
    this.tooltip = tooltip;
  }

  render(data) {

    let stocks = d3.select("#stocks").classed("stocks", true);
    stocks.selectAll("svg").remove();
    let margin = { top: 30, right: 90, bottom: 30, left: 0 };
    //Gets access to the div element created for this chart and legend element from HTML
    let svgBounds = stocks.node().getBoundingClientRect();
    let svgWidth = svgBounds.width - margin.left - margin.right;
    let svgHeight = svgBounds.height - margin.bottom - margin.top;

    const svg = stocks.append("svg");
    svg.append("g").classed("xStockAxis",true);
    svg.append("g").classed("yStockAxis",true);
    svg.attr("height", svgHeight + margin.bottom);
    svg.attr("width", svgWidth);

    let minYear = d3.min(data, (data) => data.Date);
    let maxYear = d3.max(data, (data) => data.Date);
    
    let minStock = d3.min(data, (data) => data.Low);
    let maxStock = d3.max(data, (data) => data.High);


    svg.select("#line")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let dates = [];
    data.forEach(function (d) {
      let date = new Date(d.Date);
      dates.push(date);
    });


    let xScale = d3.scaleTime().domain([dates[0], dates[dates.length-1]]).range([0, svgWidth]).nice();

    let yScale = d3
      .scaleLinear()
      .domain([parseFloat(minStock), parseFloat(maxStock)])
      .range([svgHeight - 40, 0]);

    let yaxisWidth = 60;
    const drawLine = d3
      .line()
      .x((d) => xScale(new Date(d.Date).valueOf()) + xScale(dates[1]) / 2)
      .y((d) => yScale(+d.High));

    svg
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", drawLine(data))
      .attr("transform", `translate(${yaxisWidth},0)`)
      .attr("stroke", "#105189")
      .attr("stroke-width", 2)
      // .attr("fill", "black");

      let xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m/%Y"));
      d3.select(".xStockAxis")
        .call(xAxis)
        .attr("transform", `translate(${yaxisWidth}, ${svgHeight - 40})`)
        .selectAll("text")
        .attr("transform", "rotate(90)")
        .attr("x", 9)
        .attr("dy", "-.35em")
        .style("text-anchor", "start");
  
      let yAxis = d3.axisLeft(yScale);
      d3.select(".yStockAxis")
        .attr("transform", `translate(${yaxisWidth}, 0)`)
        .call(yAxis)
        .selectAll("text");
  }
}
