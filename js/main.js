/*
 Map Lat and long data should be formatted like this
 [  
    {
     "0": number,
     "1": number
    },
    {
     "0": number,
     "1": number
    }
]
*/

class Main {
    constructor() {
        this.classSelector = new ClassSelector();
        // this.tooltip = new Tooltip(this.classSelector);
        // this.info = new Info(this.classSelector);
        // this.cartogram = new Cartogram(this.tooltip, this.classSelector);
        this.infoPanel = new InfoPanel(this.classSelector);
        this.stocks = new Stocks(this.classSelector);
        this.debt = new Debt(this.classSelector);
        this.flights = new Flights(this.classSelector);
        this.map = new Map(this.classSelector);
        this.timeline = new Timeline(this.classSelector, this.info);
        this.femaData = {};
        this.terrorData = {};
        this.stockData = {};
        this.flightData = {};
        this.debtData = {};
        //adjust this with out dropdown
        this.selectedData = "FEMA";
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

    arrHelper(arr, year, data) {
        if(!arr[year]) {
            arr[year] = [];
        }
        arr[year].push(data);
    }

    getCoords(state, area) {
        //the FEMA data has some US territories in it and they're not part of the coords I found
        if(!!this.counties[state]) {
            var t = this.counties[state].findIndex(x => area.includes(x.county));
            //if we find a viable index we return the coords
            if(t != -1) {
                return {"0": this.counties[state][t].longitude, "1": this.counties[state][t].latitude};
            }
        }
        //else we return null so we can check for it
        return null;
    }

    //Load data from csv files.
    //Should only be run once.
    async loadData() {
        await d3.json("data/counties.json").then(data => {
            this.counties = data;
        })

        //Natural Disaters
        //from FEMA
        await d3.csv("data/DisasterDeclarationsSummaries.csv", d => {
            d.date = new Date(d.incidentBeginDate);
            let year = d.date.getFullYear();
            d.coords = this.getCoords(d.state, d.designatedArea);
            this.arrHelper(this.femaData, year, d);
            
        })
        .then((data) => {
            for(let e in this.femaData) {
                let events = [];
                this.femaData[e].forEach(d => {
                    if(!events.includes(d.declarationTitle)) {
                        events.push(d.declarationTitle);
                    }  
                })
                this.femaData[e].push(events);
            };
            // console.log("femaData: ", this.femaData);
        })
        //Terrorism data
        //trimmed from source to have only US data from 2000-2017
        await d3.csv("data/globalterrorismdb_0718dist.csv", d => {
            d.stateCode = this.whatIsStateCode(d.provstate);
            d.date = new Date(+d.iyear, +d.imonth, +d.iday);
            d.coords = {"0": d.longitude, "1": d.latitude};
            this.arrHelper(this.terrorData, +d.iyear, d);
        })
        .then((data) => {
            for(let e in this.terrorData) {
                let events = [];
                this.terrorData[e].forEach(d => {
                    if(!events.includes(d.targtype1_txt)) {
                        events.push(d.targtype1_txt);
                    }  
                })
                this.terrorData[e].push(events);
            };
            // console.log("terrorData: ", this.terrorData,);
        })
        //Stock data
        await d3.csv("data/SPY_Historical_Data.csv", d => {
            d.Date = new Date(d.Date);
            let year = d.Date.getFullYear();
            // this.arrHelper(this.stockData, year, d);
            d.Low = +d.Low;
            d.High = +d.High;
            if(!this.stockData[year]) {
                this.stockData[year] = [];
            }
            this.stockData[year].unshift(d);
        })
        .then((data) => {
            // console.log("stockData: ", this.stockData);
        })
        //Flight data
        await d3.csv("data/USCarrier_Traffic_20201106204344.csv", d => {
            d.date = new Date(d.Period);
            let year = d.date.getFullYear();
            this.arrHelper(this.flightData, year, d);
        })
        .then((data) => {
            // this.flightData["columns"] = data.columns;
            // console.log("flightData: ", this.flightData);
        })

        //National Debt 2000-2017
        //data saved to two decimals places
        //https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/debt-to-the-penny
        await d3.csv("data/DebtPenny_2000_2017.csv", d => {
            d.date = new Date(d["Record Date"]);
            let year = d.date.getFullYear();
            this.arrHelper(this.debtData, year, d);
        })
        .then((data) => {
            // this.debtData.reverse();
            // this.debtData["columns"] = data.columns;
            // console.log("debtData: ", this.debtData);
        })
    }

    reRender(year) {
        if(this.selectedData == "FEMA") {
            this.infoPanel.render(this.femaData[year], this.selectData);
            this.timeline.render(this.femaData[year],year);
            this.map.render(this.femaData[year]);
        } else {
            this.infoPanel.render(this.terrorData[year], this.selectData);
            this.timeline.render(this.terrorData[year],year);
            this.map.render(this.terrorData[year]);
        }
        this.stocks.render(this.stockData[year]);
        this.debt.render(this.debtData[year]); 
        this.flights.render(this.flightData[year]);
    }
    
    selectBrush(years) {
        this.timeline.selectBrush(years);
    }

    setSelectedData(radio, year) {
        this.selectedData = radio;
        this.reRender(year);
    }
}

const main = new Main();
let yearVar = "2000";

function reRender(year) {
    yearVar = year;
    main.reRender(year);
}

function selectBrush(years) {
    main.selectBrush(years);
}

function setSelectedData(radio) {
    console.log(yearVar);
    main.setSelectedData(radio.value, yearVar);
}

async function init() {
    await main.loadData();
    reRender("2000");
}

init();