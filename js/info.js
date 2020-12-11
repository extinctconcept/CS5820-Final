class InfoPanel {
    /**
     * Constructor for InfoPanel class
     * @param { Map } map instance of class
     * @param { Flights } flights instance of class
     * @param { Stocks } stocks instance of class
     * @param { Debt } debt instance of class
     */
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

    /**
     * External call to rerender the map events
     */
    update() {
        var vm = this;
        vm.map.render()
    }

    /**
     * Sends data to components for rendering on event selection
     * can be called from here or the map
     * @param { String } d string for groupingName
     * @param { * } from is it from internal or external call, carries 'this' if exists else 'null'
     */
    clickEvent(d, from) {  
        var vm = this;
        if(!!vm.selectedEvent) {
            vm.selectedEvent.classed("text-not-selected", true);
            vm.selectedEvent.classed("text-selected", false);
        }
        if(!from) {
            vm.selectedEvent = d3.select(from);
        }
        else {
            vm.selectedEvent = d3.select(document.getElementById(`${d}`))
        }
        vm.selectedEvent.classed("text-not-selected", false);
        vm.selectedEvent.classed("text-selected", true);
        vm.map.selectedEvent(d);
        vm.stocks.update(vm.eventsList[d]);
        vm.debt.update(vm.eventsList[d]);
        vm.flights.update(vm.eventsList[d]);
    }

    /**
     * 
     * @param {*} data 
     */
    render(data) {
        var vm = this;
        vm.eventsList = [];
        vm.panel.selectAll("svg").remove();
        vm.eventsList = data[data.length - 1];

        var svgWidth = vm.svgBounds.width - vm.margin.left - vm.margin.right;
        const arr = Object.keys(vm.eventsList).sort();
        const svg = vm.panel.append("svg");

        svg.attr("height", arr.length*15+10);
        svg.attr("width", svgWidth);
        
        svg.append("g")
            .selectAll("text")
            .data(arr)
            .enter()
            .append("text")
            .classed("text-normal", true)
            .on("click", d => { vm.clickEvent(d, this) })
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
            .attr("id", d => d)
            .text(d => d);

    }
}