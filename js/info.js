class InfoPanel {
    constructor(classSelector) {
        this.classSelector = classSelector;
        this.panel = d3.select("#info-panel").classed("info", true);
        this.svgBounds = this.panel.node().getBoundingClientRect();
        this.margin = { top: 30, right: 10, bottom: 10, left: 0 };


        this.eventsList = [];
    }

    render(data, dataType) {
        // console.log(data)
        this.eventsList = [];
        this.panel.selectAll("svg").remove();
        this.eventsList = data.slice(data.length-1, data.length).flat();
        var svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        // var svgHeight = this.svgBounds.height - this.margin.bottom - this.margin.top;

        const svg = this.panel.append("svg");
        // svg.append("g").classed("xStockAxis",true);
        // svg.append("g").classed("yStockAxis",true);
        svg.attr("height",(this.eventsList.length*15));
        svg.attr("width", svgWidth);


        svg.append("g")
            .selectAll("text")
            .data(this.eventsList)
            .enter()
            .append("text")
            .classed("text-normal", true)
            .on("mouseover", function() {
                d3.select(this).classed("text-normal", false)
                d3.select(this).classed("text-hover", true)
            })
            .on("mouseout", function() {
                d3.select(this).classed("text-hover", false)
                d3.select(this).classed("text-normal", true)
            })
            .attr("x", "5")
            .attr("y", (d,i) => (i+1)*15)
            .text(d => d)


    }
}