class Stocks {
  /**
   * Constructor for Stocks class
   */
  constructor() {
    this.svg = null;
    this.stocks = d3.select("#stocks").classed("stocks", true);
    this.margin = { top: 30, right: 90, bottom: 30, left: 0 };
    this.svgBounds = this.stocks.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right - 30;
    this.svgHeight = this.svgBounds.height - this.margin.bottom - this.margin.top;
    this.xScale = null;
    this.yaxisWidth = 80;
  }

  /**
   * Renders the dotted line on graphs for a selected event
   * Represents the date that it occured
   * @param { Array } dates collection of Strings in date format
   */
  update(dates) {
    var vm = this;
    vm.svg.select(".dateLine").remove();
    vm.svg.append("g").classed("dateLine", true);

    vm.svg.select(".dateLine")
      .selectAll("line")
      .data(dates)
      .enter()
      .append("line")
      .attr("transform", `translate(${vm.yaxisWidth},0)`)
      .attr("x1", d => vm.xScale(new Date(d)))
      .attr("x2", d => vm.xScale(new Date(d)))
      .attr("y1", 0)
      .attr("y2", vm.svgHeight - vm.margin.bottom - 30)
      .classed("marker", true)
      .append("title")
      .text(d => (new Date(d)).toDateString());
  }

  /**
   * 
   * @param {*} data 
   */
  render(data) {
    var vm = this;

    vm.stocks.selectAll("svg").remove();

    vm.svg = vm.stocks.append("svg");
    vm.svg.append("g").classed("xStockAxis",true);
    vm.svg.append("g").classed("yStockAxis",true);
    vm.svg.append("g").classed("highPath",true);
    vm.svg.append("g").classed("lowPath",true);
    vm.svg.attr("height", vm.svgHeight + vm.margin.bottom);
    vm.svg.attr("width", vm.svgWidth);
    
    let minStock = d3.min(data, (data) => data.Low);
    let maxStock = d3.max(data, (data) => data.High);

    vm.svg.select("#line")
      .attr("width", vm.svgWidth)
      .attr("height", vm.svgHeight)
      .attr("transform", "translate(" + vm.margin.left + "," + vm.margin.top + ")");

    let dates = [];
    data.forEach(function (d) {
      let date = new Date(d.Date);
      dates.push(date);
    });

    vm.xScale = d3.scaleTime().domain([dates[0], dates[dates.length-1]]).range([0, vm.svgWidth]).nice();

    let yScale = d3
      .scaleLinear()
      .domain([minStock, maxStock])
      .range([vm.svgHeight - 60, 0]);

    const drawLine = d3
      .line()
      .x((d) => vm.xScale(new Date(d.Date).valueOf()) + vm.xScale(dates[1]) / 2)
      .y((d) => yScale(d.High))
      .curve(d3.curveLinear);

    const drawLowLine = d3
      .line()
      .x((d) => vm.xScale(new Date(d.Date).valueOf()) + vm.xScale(dates[1]) / 2)
      .y((d) => yScale(d.Low))
      .curve(d3.curveLinear);

    vm.svg
      .selectAll(".highPath")
      .data(data)
      .enter()
      .append("path")
      .attr("d", drawLine(data))
      .attr("transform", `translate(${vm.yaxisWidth},0)`)
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

    vm.svg
      .selectAll(".lowPath")
      .data(data)
      .enter()
      .append("path")
      .attr("d", drawLowLine(data))
      .attr("transform", `translate(${vm.yaxisWidth},0)`)
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

      let xAxis = d3.axisBottom(vm.xScale).tickFormat(d3.timeFormat("%b '%y"));
      d3.select(".xStockAxis")
        .call(xAxis)
        .attr("transform", `translate(${vm.yaxisWidth}, ${vm.svgHeight - 60})`)
        .selectAll("text")
        .attr("transform", "rotate(90)")
        .attr("x", 9)
        .attr("dy", "-.35em")
        .style("text-anchor", "start");
  
      let yAxis = d3.axisLeft(yScale);
      d3.select(".yStockAxis")
        .attr("transform", `translate(${vm.yaxisWidth}, 0)`)
        .call(yAxis)
        .selectAll("text");

      d3.select(".xStockAxis")
        .append("text")      // text label for the x axis
        .attr("x", vm.svgWidth/2 - 5  )
        .attr("y",  60 )
        .style("fill", "black")
        .style("text-anchor", "middle")
        .text("Date");

      d3.select(".yStockAxis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -35  )
        .attr("x", -vm.svgHeight/2  )
        .style("fill", "black")
        .style("text-anchor", "middle")
        .text("Stock Index");

  }
}
