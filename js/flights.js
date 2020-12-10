class Flights {
  constructor() {

  }

  update(dates) {
    let flights = d3.select("#flights").classed("flights", true);
    console.log("flights update: ", dates)
  }

  render(data) {
  	let flights = d3.select("#flights").classed("flights", true);
  	flights.selectAll("svg").remove();
    let margin = { top: 30, right: 90, bottom: 50, left: 0 };
    //Gets access to the div element created for this chart and legend element from HTML
    let svgBounds = flights.node().getBoundingClientRect();
    let svgWidth = svgBounds.width - margin.left - margin.right;
    let svgHeight = svgBounds.height - margin.bottom - margin.top;

    const svg = flights.append("svg");
    svg.append("g").classed("xFlightAxis",true);
    svg.append("g").classed("yFlightAxis",true);
    svg.attr("height", svgHeight + margin.bottom);
    svg.attr("width", svgWidth);

    // let minYear = d3.min(data, (data) => data.Period);
    // let maxYear = d3.max(data, (data) => data.Period);
    
    let minFlight = d3.min(data, (data) => data.Total);
    let maxFlight = d3.max(data, (data) => data.Total);

    svg.select("#line")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let dates = [];
    data.forEach(function (d) {
      let date = new Date(d.Period);
      dates.push(date);
    });

    let xScale = d3.scaleTime().domain([dates[0], dates[dates.length-1]]).range([0, svgWidth]).nice();

    let yScale = d3
      .scaleLinear()
      .domain([minFlight, maxFlight])
      .range([svgHeight - 35, 0]);

    let yaxisWidth = 60;
    const drawLine = d3
      .line()
      .x((d) => xScale(new Date(d.Period).valueOf()))
      .y((d) => yScale(d.Total));

    svg
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", drawLine(data))
      .attr("transform", `translate(${yaxisWidth},0)`)
      .attr("stroke", "#105189")
      .attr("stroke-width", 2)
      .attr("fill", "transparent");

    let xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m/%Y"));
      d3.select(".xFlightAxis")
        .call(xAxis)
        .attr("transform", `translate(${yaxisWidth}, ${svgHeight - 35})`)
        .selectAll("text")
        .attr("transform", "rotate(90)")
        .attr("x", 9)
        .attr("dy", "-.35em")
        .style("text-anchor", "start");

    d3.select(".xFlightAxis")
        .append("text")      // text label for the x axis
        .attr("x", svgWidth/2 - 5  )
        .attr("y",  60 )
        .style("fill", "black")
        .style("text-anchor", "middle")
        .text("Date");
  
      let yAxis = d3.axisLeft(yScale);
      d3.select(".yFlightAxis")
        .attr("transform", `translate(${yaxisWidth}, 0)`)
        .call(yAxis)
        .selectAll("text");

    d3.select(".yFlightAxis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -35  )
        .attr("x", -svgHeight/2  )
        .style("fill", "black")
        .style("text-anchor", "middle")
        .text("Total US Flights");
  }
}