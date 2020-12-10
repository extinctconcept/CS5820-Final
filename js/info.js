class InfoPanel {
    constructor(map, flights, stocks, debt) {
        this.map = map;
        this.flights = flights;
        this.stocks = stocks;
        this.debt = debt;

        this.panel = d3.select("#info-panel").classed("info", true);
        this.svgBounds = this.panel.node().getBoundingClientRect();
        this.margin = { top: 30, right: 10, bottom: 10, left: 0 };


        this.eventsList = [];
        this.selectedEvent = null;
    }

    update(event) {
        var vm = this;
        vm.map.render()
    }

    render(data, dataType) {
        var vm = this;
        vm.eventsList = [];
        vm.panel.selectAll("svg").remove();
        vm.eventsList = data[data.length - 1];

        var svgWidth = vm.svgBounds.width - vm.margin.left - vm.margin.right;
        const arr = Object.keys(vm.eventsList).sort();
        const svg = vm.panel.append("svg");

        svg.attr("height", arr.length*15+10);
        svg.attr("width", svgWidth);
        console.log(vm.eventsList)
        svg.append("g")
            .selectAll("text")
            .data(arr)
            .enter()
            .append("text")
            .classed("text-normal", true)
            .on("click", function(d) {

                if(!!vm.selectedEvent) {
                    vm.selectedEvent.classed("text-not-selected", true);
                    vm.selectedEvent.classed("text-selected", false);
                }
                vm.selectedEvent = d3.select(this);
                vm.selectedEvent.classed("text-not-selected", false);
                vm.selectedEvent.classed("text-selected", true);
                vm.map.selectedEvent(d);
                vm.stocks.update(vm.eventsList[d]);
                vm.debt.update(vm.eventsList[d]);
                vm.flights.update(vm.eventsList[d]);

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