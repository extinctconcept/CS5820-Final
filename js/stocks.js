class Stocks {
  constructor(tooltip, classSelector) {
    this.classSelector = classSelector;
    this.tooltip = tooltip;
  }

  render(data) {
    console.log(data);
    let stocks = d3.select("#stocks").classed("stocks", true);
    let margin = { top: 30, right: 0, bottom: 30, left: 0 };
    //Gets access to the div element created for this chart and legend element from HTML
    let svgBounds = stocks.node().getBoundingClientRect();
    let svgWidth = svgBounds.width - margin.left - margin.right;
    let svgHeight = svgWidth / 2.5;

    const svg = stocks.append("svg");

    let minYear = d3.min(data, (data) => data.Date);
    let maxYear = d3.max(data, (data) => data.Date);
    
    let minStock = d3.min(data, (data) => data.Low);
    let maxStock = d3.max(data, (data) => data.High);

    console.log(minStock, maxStock)

    svg.select("#line")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let dates = [];
    data.forEach(function (d) {
      let date = new Date(d.Date);
      let item = date.valueOf();
      console.log(item);
      dates.push(item);
    });

    console.log(dates);

    let xScale = d3.scaleBand().domain(dates).range([0, svgWidth]);

    let yScale = d3
      .scaleLinear()
      .domain([parseFloat(minStock), parseFloat(maxStock)])
      .range([svgHeight, 0]);

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

      let xAxis = d3.axisBottom(xScale);
      d3.select("#xAxis")
        .call(xAxis)
        .attr("transform", `translate(${yaxisWidth}, ${svgHeight + 0})`)
        .selectAll("text")
        .attr("transform", "rotate(90)")
        .attr("x", 9)
        .attr("dy", "-.35em")
        .style("text-anchor", "start");
  
      let yAxis = d3.axisLeft(yScale);
      d3.select("#yAxis")
        .attr("transform", `translate(${yaxisWidth}, 0)`)
        .call(yAxis)
        .selectAll("text");
  }
}
