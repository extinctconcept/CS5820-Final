class InfoPanel {
    constructor(classSelector) {
        this.classSelector = classSelector;
    }

    render(data) {
        this.panel = d3.select("#info-panel");
        
    }
}