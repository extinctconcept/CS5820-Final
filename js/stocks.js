class Stocks {
  constructor() {
  }

  update(dates) {
    // console.log("stocks update: ", dates)
  }

  render(data) {
    //console.log(data)
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
    svg.append("g").classed("highPath",true);
    svg.append("g").classed("lowPath",true);
    svg.attr("height", svgHeight + margin.bottom);
    svg.attr("width", svgWidth);

    let minYear = d3.min(data, (data) => data.Date);
    let maxYear = d3.max(data, (data) => data.Date);
    
    let minStock = d3.min(data, (data) => data.Low);
    let maxStock = d3.max(data, (data) => data.High);

    //console.log(minStock, maxStock)
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
      .domain([minStock, maxStock])
      .range([svgHeight - 60, 0]);

    let yaxisWidth = 60;
    const drawLine = d3
      .line()
      .x((d) => xScale(new Date(d.Date).valueOf()) + xScale(dates[1]) / 2)
      .y((d) => yScale(d.High))
      .curve(d3.curveLinear);

    const drawLowLine = d3
      .line()
      .x((d) => xScale(new Date(d.Date).valueOf()) + xScale(dates[1]) / 2)
      .y((d) => yScale(d.Low))
      .curve(d3.curveLinear);

    svg
      .selectAll(".highPath")
      .data(data)
      .enter()
      .append("path")
      .attr("d", drawLine(data))
      .attr("transform", `translate(${yaxisWidth},0)`)
      .attr("stroke", "#105189")
      .attr("stroke-width", 2)
      .attr("opacity", .08)
      .on('mouseover', function (d, i) {
         d3.select(this)
         .attr("stroke-width", 3)
            .attr("opacity", .99);
           })
       .on('mouseout', function (d, i) {
         d3.select(this)
         .attr("stroke-width", 2)
            .attr("opacity", .08);
           });

    svg
      .selectAll(".lowPath")
      .data(data)
      .enter()
      .append("path")
      .attr("d", drawLowLine(data))
      .attr("transform", `translate(${yaxisWidth},0)`)
      .attr("stroke", "#cc0418")
      .attr("stroke-width", 2)
      .attr("opacity", .008)
      .on('mouseover', function (d, i) {
         d3.select(this)
         .attr("stroke-width", 3)
            .attr("opacity", .99);
           })
       .on('mouseout', function (d, i) {
         d3.select(this)
         .attr("stroke-width", 2)
            .attr("opacity", .008);
           });

      let xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m/%Y"));
      d3.select(".xStockAxis")
        .call(xAxis)
        .attr("transform", `translate(${yaxisWidth}, ${svgHeight - 60})`)
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

      d3.select(".xStockAxis")
        .append("text")      // text label for the x axis
        .attr("x", svgWidth/2 - 5  )
        .attr("y",  60 )
        .style("fill", "black")
        .style("text-anchor", "middle")
        .text("Date");

      d3.select(".yStockAxis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -35  )
        .attr("x", -svgHeight/2  )
        .style("fill", "black")
        .style("text-anchor", "middle")
        .text("Stock Index");

  }
}
