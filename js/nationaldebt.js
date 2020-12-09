class Debt {
  constructor() {

  }

  render(data) {
    //console.log(" Debt: ",data);
    let debt = d3.select("#debt").classed("debt", true);
    debt.selectAll("svg").remove();
    let margin = { top: 30, right: 90, bottom: 30, left: 0 };
    //Gets access to the div element created for this chart and legend element from HTML
    let svgBounds = debt.node().getBoundingClientRect();
    let svgWidth = svgBounds.width - margin.left - margin.right - 30;
    let svgHeight = svgBounds.height - margin.bottom - margin.top;

    const svg = debt.append("svg");
    svg.append("g").classed("xDebtAxis",true);
    svg.append("g").classed("yDebtAxis",true);
    svg.attr("height", svgHeight + margin.bottom);
    svg.attr("width", svgWidth);

    let minYear = d3.min(data, (data) => data.Date);
    let maxYear = d3.max(data, (data) => data.Date);
    
    let minStock = d3.min(data, (data) => data["Total Public Debt Outstanding"]/1000000);
    let maxStock = d3.max(data, (data) => data["Total Public Debt Outstanding"]/1000000);


    svg.select("#line")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let dates = [];
    data.forEach(function (d) {
      let date = new Date(d["Record Date"]);
      dates.push(date);
    });

    // console.log(dates);

    let xScale = d3.scaleTime().domain([dates[0], dates[dates.length-1]]).range([0, svgWidth]).nice();

    let yScale = d3
      .scaleLinear()
      .domain([parseFloat(minStock), parseFloat(maxStock)])
      .range([svgHeight - 60, 0]);

    let yaxisWidth = 80;
    const drawLine = d3
      .area()
      .x((d) => xScale(new Date(d["Record Date"]).valueOf()) + xScale(dates[1]) / 2)
      .y0(svgHeight - 60)
      .y1((d) => yScale(+d["Total Public Debt Outstanding"]/1000000));

    svg
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", drawLine(data))
      .attr("transform", `translate(${yaxisWidth},0)`)
      .attr("stroke", "#105189")
      .attr("stroke-width", 2)
      .attr("fill", "steelblue");
      // .attr("fill", "black");

      let xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m/%Y"));
      d3.select(".xDebtAxis")
        .call(xAxis)
        .attr("transform", `translate(${yaxisWidth}, ${svgHeight - 60})`)
        .selectAll("text")
        .attr("transform", "rotate(90)")
        .attr("x", 9)
        .attr("dy", "-.35em")
        .style("text-anchor", "start");
  
      let yAxis = d3.axisLeft(yScale);
      d3.select(".yDebtAxis")
        .attr("transform", `translate(${yaxisWidth}, 0)`)
        .call(yAxis)
        .selectAll("text");

      d3.select(".xDebtAxis")
        .append("text")      // text label for the x axis
        .attr("x", svgWidth/2 - 5  )
        .attr("y",  60 )
        .style("fill", "black")
        .style("text-anchor", "middle")
        .text("Date");

    d3.select(".yDebtAxis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -60  )
        .attr("x", -svgHeight/2  )
        .style("fill", "black")
        .style("text-anchor", "middle")
        .text("Debt In Millions");
  }
}
