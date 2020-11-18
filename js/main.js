class Main {
    constructor() {
        this.classSelector = new ClassSelector();
        // this.tooltip = new Tooltip(this.classSelector);
        // this.info = new Info(this.classSelector);
        // this.cartogram = new Cartogram(this.tooltip, this.classSelector);
        this.line = new Line(this.classSelector);
        this.map = new Map(this.classSelector);
        this.timeline = new Timeline(this.classSelector, this.info, this.line);
    }

    //Our terrorist data needs to have this added.
    // Only included states that were present in data so no Alaska, Maine, Montana, Rhode Island, South Dakota, Vermont, or Wyoming.
    whatIsStateCode(state) {
        switch(state) {
            case "Alabama":
                return "AL";
            case "Arizona":
                return "AZ";
            case "Arkansas":
                return "AR";
            case "California":
                return "CA";
            case "Colorado":
                return "CO";
            case "Connecticut":
                return "CT";
            case "District of Columbia":
                return "DC";
            case "Florida":
                return "FL";
            case "Georgia":
                return "GA";
            case "Idaho":
                return "ID";
            case "Illinois":
                return "IL";
            case "Iowa":
                return "IA";
            case "Kansas":
                return "KS";
            case "Kentucky":
                return "KY";
            case "Louisiana":
                return "LA";
            case "Maryland":
                return "MD";
            case "Massachusetts":
                return "MA";
            case "Michigan":
                return "MI";
            case "Minnesota":
                return "MN";
            case "Mississippi":
                return "MS";
            case "Missouri":
                return "MO";
            case "Nebraska":
                return "NE";
            case "Nevada":
                return "NV";
            case "New Hampshire":
                return "NH";
            case "New Jersey":
                return "NJ";
            case "New Mexico":
                return "NM";
            case "New York":
                return "NY";
            case "North Carolina":
                return "NC";
            case "North Dakota":
                return "ND";
            case "Ohio":
                return "OH";
            case "Oklahoma":
                return "OK";
            case "Oregon":
                return "OR";
            case "Pennsylvania":
                return "PA";
            case "Puerto Rico":
                return "PR";
            case "South Carolina":
                return "SC";
            case "Tennessee":
                return "TN";
            case "Texas":
                return "TX";
            case "U.S. Virgin Islands":
                return "VI";
            case "Utah":
                return "UT";
            case "Virginia":
                return "VA";
            case "Washington":
                return "WA";
            case "West Virginia":
                return "WV";
            case "Wisconsin":
                return "WI";
            default:
                //two items may return null
                return null;
        }
    }

    reRender(year) {
        //Natural Disaters
        //from FEMA
        d3.csv("data/DisasterDeclarationsSummaries.csv")
        .then((data) => {
            this.map.render(data, year)
        })
        //Terrorism data
        //trimmed from source to have only US data from 2000-2017
        var terrorData = [];
        d3.csv("data/globalterrorismdb_0718dist.csv", d => {
            d.stateCode = this.whatIsStateCode(d.provstate);
            d.date = new Date(+d.iyear, +d.imonth, +d.iday);
            if(!terrorData[d.iyear]) {
                terrorData[d.iyear] = [];
            }
            terrorData[d.iyear].push(d);
        })
        .then((data) => {
            //send terrorData to the methods if you want it grouped by year
        })
        //Stock data
        d3.csv("data/SPY_Historical_Data.csv")
        .then((data) => {
            
        })
        //Flight data
        d3.csv("data/USCarrier_Traffic_20201106204344.csv", d => {

        })
        .then((data) => {
            
        })

        //National Debt 2000-2017
        //data saved to two decimals places
        //https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/debt-to-the-penny
        d3.csv("data/DebtPenny_2000_2017.csv")
        .then((data) => {
            
        })

        // d3.csv("assets/beer.csv")
        // .then((data) => {   
        //     this.cartogram.render(data, year)
        //     this.timeline.render(data, year);
        //     this.bar.render(data, year);
        // });
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