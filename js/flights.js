class Flights {
  constructor() {
    this.svg = null;
    this.flights = d3.select("#flights").classed("flights", true);
    this.margin = { top: 30, right: 90, bottom: 30, left: 0 };
    this.svgBounds = this.flights.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right - 30;
    this.svgHeight = this.svgBounds.height - this.margin.bottom - this.margin.top;
    this.xScale = null;
    this.yaxisWidth = 80;
  }

  update(dates) {
    var vm = this;
    console.log(vm.svgHeight);
    vm.svg.select(".dateLine").remove();
    vm.svg.append("g").classed("dateLine", true);

    // vm.svg.selectAll(".dateLine").remove();
    vm.svg.select(".dateLine")
      .selectAll("line")
      .data(dates)
      .enter()
      .append("line")
      .attr("transform", `translate(${vm.yaxisWidth},0)`)
      .attr("x1", (d,i) => {
        return vm.xScale(new Date(d)) - 35;
      })
      .attr("x2", d => vm.xScale(new Date(d)) - 35)
      .attr("y1", 0)
      .attr("y2", vm.svgHeight - vm.margin.bottom - 5)
      .attr("stroke-width", 1)
      // .attr("id", "dateLine")
      .style("stroke", "red");
  }

  render(data) {
  	var vm = this;

    vm.flights.selectAll("svg").remove();

    vm.svg = vm.flights.append("svg");
    vm.svg.append("g").classed("xFlightAxis",true);
    vm.svg.append("g").classed("yFlightAxis",true);
    vm.svg.attr("height", vm.svgHeight + vm.margin.bottom);
    vm.svg.attr("width", vm.svgWidth);

    // let minYear = d3.min(data, (data) => data.Period);
    // let maxYear = d3.max(data, (data) => data.Period);
    
    let minFlight = d3.min(data, (data) => data.Total);
    let maxFlight = d3.max(data, (data) => data.Total);

    vm.svg.select("#line")
      .attr("width", vm.svgWidth)
      .attr("height", vm.svgHeight)
      .attr("transform", "translate(" + vm.margin.left + "," + vm.margin.top + ")");

    let dates = [];
    data.forEach(function (d) {
      let date = new Date(d.Period);
      dates.push(date);
    });

    vm.xScale = d3.scaleTime().domain([dates[0], dates[dates.length-1]]).range([0, vm.svgWidth]).nice();

    let yScale = d3
      .scaleLinear()
      .domain([minFlight, maxFlight])
      .range([vm.svgHeight - 35, 0]);

    let yaxisWidth = 60;
    const drawLine = d3
      .line()
      .x((d) => vm.xScale(new Date(d.Period).valueOf()))
      .y((d) => yScale(d.Total));

    vm.svg
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", drawLine(data))
      .attr("transform", `translate(${vm.yaxisWidth},0)`)
      .attr("stroke", "#105189")
      .attr("stroke-width", 2)
      .attr("fill", "transparent");

    let xAxis = d3.axisBottom(vm.xScale).tickFormat(d3.timeFormat("%m/%Y"));
      d3.select(".xFlightAxis")
        .call(xAxis)
        .attr("transform", `translate(${vm.yaxisWidth}, ${vm.svgHeight - 35})`)
        .selectAll("text")
        .attr("transform", "rotate(90)")
        .attr("x", 9)
        .attr("dy", "-.35em")
        .style("text-anchor", "start");

    d3.select(".xFlightAxis")
        .append("text")      // text label for the x axis
        .attr("x", vm.svgWidth/2 - 5  )
        .attr("y",  60 )
        .style("fill", "black")
        .style("text-anchor", "middle")
        .text("Date");
  
      let yAxis = d3.axisLeft(yScale);
      d3.select(".yFlightAxis")
        .attr("transform", `translate(${vm.yaxisWidth}, 0)`)
        .call(yAxis)
        .selectAll("text");

    d3.select(".yFlightAxis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50  )
        .attr("x", -vm.svgHeight/2  )
        .style("fill", "black")
        .style("text-anchor", "middle")
        .text("Total US Flights");
  }
}