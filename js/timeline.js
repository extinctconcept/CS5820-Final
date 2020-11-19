class Timeline {
    constructor(classSelector, infoPanel) {
        this.classSelector = classSelector;
        this.infoPanel = infoPanel;
        this.padding = 30;
        this.width = window.innerWidth - 100;
        this.height = 50;
        this.svg = d3.select("#timeline")
            .attr("width", this.width)
            .attr("height", this.height)
        ;

        this.selected = null;
        this.years = [];
    }

    render(data, year) {
        if (this.years.length === 0) {
            const radius = 10;

            let brush = d3.brushX()
            .extent([[0, 0], [this.width, this.height]])
            .on("end", () => {
                if (d3.event !== null) {
                    let x0 = d3.event.selection[0];
                    let x1 = d3.event.selection[1];
                    
                    let circles = this.svg.selectAll('circle.yearChart')
                    let selected = [];
                    circles.each(function(d) {
                        let start = +d3.select(this).attr('cx');
                        let end = start + (radius * 2);
                        
                        if ((start >= x0 && start <= x1) &&
                            (end >= x0 && end <= x1)) {
                            selected.push(d);
                        }
                    });
                    this.selectBrush(selected)
                }
            })
            ;

            this.svg.append("g").attr("class", "brush").call(brush);

            let xscale = d3.scaleLinear()
                .domain([0, this.years.length - 1])
                .range([this.padding, this.width - this.padding]);
        
            this.svg.selectAll('line')
            .data(this.years)
            .enter()
            .append('line')
            .attr('x1', (d, i) => xscale(i))
            .attr('y1', radius + 4)
            .attr('x2', (d, i) => i > 0 ? xscale(i - 1) : xscale(i))
            .attr('y2', radius + 4)
            .classed('lineChart', true)
            ;
        
            this.svg.selectAll('circle')
            .data(this.years)
            .enter()
            .append('circle')
            .attr('cx', (d, i) => xscale(i))
            .attr('cy', radius + 4)
            .attr('r', radius)
            .attr('class', d => d.class)
            .classed('yearChart', true)
            .attr('id', d => `y${d.year}`)
            .classed("highlighted", d => {
                if (d.year === +year) {
                    this.selected = d3.select(`#y${d.year}`);
                    return true;
                }
                return false;
            })
            .on('click', d => {
                this.selectYear(d3.select(d3.event.target), d.year);
            })
            .on('mouseover', function (d, i) {
                d3.select(this).transition()
                     .duration('50')
                     .attr('r', radius+2)
                     .attr('stroke-width', '2px')
                     .attr('stroke', "blue");
                //Makes the new div appear on hover:
           })
           .on('mouseout', function (d, i) {
                d3.select(this).transition()
                     .duration('50')
                     .attr('r', radius)
                     .attr('stroke', "none");;
           });

            this.svg.selectAll('text')
            .data(this.years)
            .enter()
            .append('text')
            .attr('x', (d, i) => xscale(i) - 15)
            .attr('y', radius + 12)
            .attr('dy', '1.3em')
            .text(d => d.year)
            .classed('yeartext', true)
            ;
        }
    }

    selectBrush(years) {
        this.line.render(years);
        this.infoPanel.render(years);
    }

    selectYear(selected, year) {
        if (this.selected) {
          this.selected.classed('highlighted', false);
        }
        this.selected = selected;
        this.selected.classed('highlighted', true);

        reRender(year)        
    }
}
