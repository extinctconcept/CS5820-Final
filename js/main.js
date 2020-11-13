class Main {
    constructor() {
        this.classSelector = new ClassSelector();
        this.tooltip = new Tooltip(this.classSelector);
        this.info = new Info(this.classSelector);
        this.cartogram = new Cartogram(this.tooltip, this.classSelector);
        this.line = new Line(this.classSelector);
        this.bar = new Bar(this.classSelector);
        this.timeline = new Timeline(this.classSelector, this.info, this.line);
    }

    reRender(year) {
        d3.csv("assets/beer.csv")
        .then((data) => {   
            this.cartogram.render(data, year)
            this.timeline.render(data, year);
            this.bar.render(data, year);
        });
    }

    selectBrush(years) {
        this.timeline.selectBrush(years);
    }
}

const main = new Main();

function reRender(year) {
    main.reRender(year);
}

function selectBrush(years) {
    main.selectBrush(years);
}

function init() {
    reRender("2008");
}

init();