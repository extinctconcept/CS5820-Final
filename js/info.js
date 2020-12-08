class InfoPanel {
    constructor(classSelector) {
        this.classSelector = classSelector;
        this.panel = d3.select("#info-panel").classed("info", true);
        this.svgBounds = this.panel.node().getBoundingClientRect();
        this.margin = { top: 30, right: 10, bottom: 10, left: 0 };


        this.eventsList = [];
        this.selectedEvent = null;
    }

    render(data, dataType) {
        // console.log(data)
        var vm = this;
        vm.eventsList = [];
        vm.panel.selectAll("svg").remove();
        vm.eventsList = data.slice(data.length-1, data.length).flat();
        var svgWidth = vm.svgBounds.width - vm.margin.left - vm.margin.right;

        const svg = vm.panel.append("svg");
        svg.attr("height",(vm.eventsList.length*15));
        svg.attr("width", svgWidth);


        svg.append("g")
            .selectAll("text")
            .data(vm.eventsList)
            .enter()
            .append("text")
            .classed("text-normal", true)
            .on("click", function() {

                if(!!vm.selectedEvent) {
                    vm.selectedEvent.classed("text-not-selected", true);
                    vm.selectedEvent.classed("text-selected", false);
                }
                vm.selectedEvent = d3.select(this);
                vm.selectedEvent.classed("text-not-selected", false);
                vm.selectedEvent.classed("text-selected", true);

            })
            .on("mouseover", function() {
                d3.select(this).classed("text-normal", false);
                d3.select(this).classed("text-hover", true);
            })
            .on("mouseout", function() {
                d3.select(this).classed("text-normal", true);
                d3.select(this).classed("text-hover", false);
            })

            .attr("x", "5")
            .attr("y", (d,i) => (i+1)*15)
            .text(d => d);

    }
}