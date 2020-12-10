class Debt {
  constructor() {
    this.svg = null;
    this.debt = d3.select("#debt").classed("debt", true);
    this.margin = { top: 30, right: 90, bottom: 30, left: 0 };
    this.svgBounds = this.debt.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right - 30;
    this.svgHeight = this.svgBounds.height - this.margin.bottom - this.margin.top;
    this.xScale = null;
    this.yaxisWidth = 80;
  }
  
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
      .text(d => {
        let t = new Date(d);
        return t.toDateString();
      });
  }

  render(data) {
    var vm = this;

    vm.debt.selectAll("svg").remove();
    //Gets access to the div element created for this chart and legend element from HTML
  

    vm.svg = vm.debt.append("svg");
    vm.svg.append("g").classed("xDebtAxis",true);
    vm.svg.append("g").classed("yDebtAxis",true);
    vm.svg.attr("height", vm.svgHeight + vm.margin.bottom);
    vm.svg.attr("width", vm.svgWidth);
    
    let minTotal = d3.min(data, (data) => data["Total Public Debt Outstanding"]/1000000);
    let maxTotal = d3.max(data, (data) => data["Total Public Debt Outstanding"]/1000000);


    vm.svg.select("#line")
      .attr("width", vm.svgWidth)
      .attr("height", vm.svgHeight)
      .attr("transform", "translate(" + vm.margin.left + "," + vm.margin.top + ")");

    let dates = [];
    data.forEach(function (d) {
      dates.push(d.date);
    });

    vm.xScale = d3.scaleTime().domain([dates[0], dates[dates.length-1]]).range([0, vm.svgWidth]).nice();

    let yScale = d3
      .scaleLinear()
      .domain([parseFloat(minTotal), parseFloat(maxTotal)])
      .range([vm.svgHeight - 60, 0]);

    const drawLine = d3
      .area()
      .x((d) => vm.xScale(new Date(d["Record Date"]).valueOf()) + vm.xScale(dates[1]) / 2)
      .y0(vm.svgHeight - 60)
      .y1((d) => yScale(+d["Total Public Debt Outstanding"]/1000000));

    vm.svg
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", drawLine(data))
      .attr("transform", `translate(${vm.yaxisWidth},0)`)
      .attr("stroke", "#105189")
      .attr("stroke-width", 2)
      .attr("fill", "steelblue");

      let xAxis = d3.axisBottom(vm.xScale).tickFormat(d3.timeFormat("%m/%Y"));
      d3.select(".xDebtAxis")
        .call(xAxis)
        .attr("transform", `translate(${vm.yaxisWidth}, ${vm.svgHeight - 60})`)
        .selectAll("text")
        .attr("transform", "rotate(90)")
        .attr("x", 9)
        .attr("dy", "-.35em")
        .style("text-anchor", "start");
  
      let yAxis = d3.axisLeft(yScale);
      d3.select(".yDebtAxis")
        .attr("transform", `translate(${vm.yaxisWidth}, 0)`)
        .call(yAxis)
        .selectAll("text");

      d3.select(".xDebtAxis")
        .append("text")      // text label for the x axis
        .attr("x", vm.svgWidth/2 - 5  )
        .attr("y",  60 )
        .style("fill", "black")
        .style("text-anchor", "middle")
        .text("Date");

    d3.select(".yDebtAxis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -60  )
        .attr("x", -vm.svgHeight/2  )
        .style("fill", "black")
        .style("text-anchor", "middle")
        .text("Debt In Millions");
  }
}
