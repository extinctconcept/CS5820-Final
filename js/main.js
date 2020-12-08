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
        // this.classSelector = new ClassSelector();
        // this.tooltip = new Tooltip(this.classSelector);
        this.map = new Map();
        this.flights = new Flights();
        this.stocks = new Stocks();
        this.debt = new Debt();
        this.infoPanel = new InfoPanel(this.map, this.flights, this.stocks, this.debt);
        this.timeline = new Timeline(this.info);
        this.femaData = {};
        this.terrorData = {};
        this.stockData = {};
        this.flightData = {};
        this.debtData = {};

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
                let long = this.counties[state][t].longitude;
                let lat = this.counties[state][t].latitude;
                return {"0": !!long ? long : 0, "1": !!lat ? lat : 0};
            }
        }
        //else we return null so we can check for it
        return null;
    }

    //Load data from csv files.
    //Should only be run once.
    async loadData() {
        var vm = this;
        await d3.json("data/counties.json").then(data => {
            vm.counties = data;
        })

        //Natural Disaters
        //from FEMA
        await d3.csv("data/DisasterDeclarationsSummaries.csv", d => {
            d.date = new Date(d.incidentBeginDate);
            let year = d.date.getFullYear();
            d.coords = vm.getCoords(d.state, d.designatedArea);
            d.groupingName = d.declarationTitle;
            vm.arrHelper(vm.femaData, year, d);
            
        })
        .then((data) => {
            for(let e in vm.femaData) {
                let events = [];
                vm.femaData[e].forEach(d => {
                    if(!events.includes(d.declarationTitle)) {
                        events.push(d.declarationTitle);
                    }  
                })
                vm.femaData[e].push(events);
            };
            // console.log("femaData: ", vm.femaData);
        })
        //Terrorism data
        //trimmed from source to have only US data from 2000-2017
        await d3.csv("data/globalterrorismdb_0718dist.csv", d => {
            d.stateCode = vm.whatIsStateCode(d.provstate);
            d.date = new Date(+d.iyear, +d.imonth, +d.iday);
            d.groupingName = d.targtype1_txt;
            d.coords = {"0": d.longitude, "1": d.latitude};
            vm.arrHelper(vm.terrorData, +d.iyear, d);
        })
        .then((data) => {
            for(let e in vm.terrorData) {
                let events = [];
                vm.terrorData[e].forEach(d => {
                    if(!events.includes(d.targtype1_txt)) {
                        events.push(d.targtype1_txt);
                    }  
                })
                vm.terrorData[e].push(events);
            };
            // console.log("terrorData: ", vm.terrorData,);
        })
        //Stock data
        await d3.csv("data/SPY_Historical_Data.csv", d => {
            d.Date = new Date(d.Date);
            let year = d.Date.getFullYear();
            // vm.arrHelper(vm.stockData, year, d);
            d.Low = +d.Low;
            d.High = +d.High;
            if(!vm.stockData[year]) {
                vm.stockData[year] = [];
            }
            vm.stockData[year].unshift(d);
        })
        .then((data) => {
            // console.log("stockData: ", vm.stockData);
        })
        //Flight data
        await d3.csv("data/USCarrier_Traffic_20201106204344.csv", d => {
            let year = d.Period.slice(d.Period.length-4, d.Period.length);
            d.Total = +d.Total;
            vm.arrHelper(vm.flightData, year, d);
        })
        .then((data) => {
            // console.log("flightData: ", vm.flightData);
        })

        //National Debt 2000-2017
        //data saved to two decimals places
        //https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/debt-to-the-penny
        await d3.csv("data/DebtPenny_2000_2017.csv", d => {
            d.date = new Date(d["Record Date"]);
            let year = d.date.getFullYear();
            vm.arrHelper(vm.debtData, year, d);
        })
        .then((data) => {
            // console.log("debtData: ", vm.debtData);
        })
        await vm.init();
    }

    async init() {
        await this.map.init();
    }

    reRender(year) {
        var vm = this;
        if(vm.selectedData == "FEMA") {
            vm.infoPanel.render(vm.femaData[year], vm.selectData);
            vm.timeline.render(vm.femaData[year],year);
            vm.map.cleanMap(vm.femaData[year]);
        } else {
            vm.infoPanel.render(vm.terrorData[year], vm.selectData);
            vm.timeline.render(vm.terrorData[year],year);
            vm.map.cleanMap(vm.terrorData[year]);
        }
        vm.stocks.render(vm.stockData[year]);
        vm.debt.render(vm.debtData[year]); 
        vm.flights.render(vm.flightData[year]);
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
    // console.log(yearVar);
    main.setSelectedData(radio.value, yearVar);
}

async function init() {
    await main.loadData();
    reRender("2000");
}

init();