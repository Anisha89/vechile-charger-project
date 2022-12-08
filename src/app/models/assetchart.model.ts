import { RealtimeParameter } from "./domain.model";

export class ChartInputData {
   
    constructor(assetId, fromDate, toDate, interval, charType) {
        this.assetId = assetId;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.interval =interval;
        this.chartType = charType;
    }

    assetId : string;
    fromDate: string;
    toDate: string;
    interval: number; // 7 - weekly, 30 - monthly, 365 - yearly
    chartType:string; //bar, line, stacked
    parameters:string[]= new Array<string>(); // speed, distance etc.
  
    getAsJson() {
        return JSON.stringify(this);
    }
    static getDays(wmy:string) {
        switch(wmy) {
            case 'Weekly':
                return 7;
            case 'Monthly':
                return 30;
            case 'Quarterly':
                return 3 *30;
            case 'Yearly':
                return 365;
        }
        return 7;//'weekly'
    }
    static intervals=['Weekly','Monthly','Quarterly','Yearly'];
    static chartTypes=['Bar','Line','Stacked'];
      getchartintervals() {
        return ChartInputData.intervals;
    }
      getchartTypes() {
        return ChartInputData.chartTypes;
    }

    addParam(name :string) {
        let index = this.parameters.indexOf(name);
        if (index < 0) {
            this.parameters.push(name);
        }
    }

    removeParam(name :string) {
        let index = this.parameters.indexOf(name);
        if (index >= 0) {
            this.parameters.splice(index, 1);
            //this.parameters = this.parameters.filter(m => m != name);
        }
    }

    updateChartType(ctype : string) {
        this.chartType = ctype;
    }

    updateDateRange(fromdate : string, todate:string, wmy : string) {
        this.fromDate = fromdate;
        this.toDate = todate;
        this.interval = ChartInputData.getDays(wmy);
    }

    updateInterval(wmy : string) {
        this.interval = ChartInputData.getDays(wmy);
    }

    checkSelected(name : string) {
        return this.parameters.indexOf(name) >= 0 ? true: false;
    }

    updateSelection(realtimedataList : Array<RealtimeParameter>) {
        let result = new Array<RealtimeParameter>();
        result = realtimedataList;
        for(let i = 0;i < realtimedataList.length; i++) {
            let selected = this.checkSelected(realtimedataList[i].name);
            result[i].selected = selected;
        }
        return result;
    }

    /*
    if (e.target.checked) {
        console.log(name + 'Checked');
        this.chartInputData.addParam(name);
      }
      else {
        console.log(name + 'unchecked');
        this.chartInputData.removeParam(name);
        this.selectedParams = this.selectedParams.filter(m => m != name);
  
      }
      console.log(this.selectedParams);
      this.chartInputData.parameters = this.selectedParams;*/
}

/*
    {
        "name": "January",
        "series": [
            {
                "name": "Distance",
                "value": 73
            },
            {
                "name": "petrol",
                "value": 89
            }
        ]
    },
*/

class ChartElement {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
    name :string;
    value: number;
}

class ChartItem {
    constructor(name) {
        this.name = name;
    }
    name:string;
    series:ChartElement[] = new Array<ChartElement>();

    add(element : ChartElement) {
        this.series.push(element);
    }

    getAsJsonData() {
        let jsonSeries = new Array<any>();
        for(let i = 0; i < this.series.length; i++ ) {
            jsonSeries.push({
                name: this.series[i].name,
                value: this.series[i].value
            })
        }
        let jsonObject = {
            name : this.name,
            series: jsonSeries
        };
        return jsonObject;
    }

    getSeries() {
        return this.series;
    }
    
    static create(obj: any) {
        let chartItem = new ChartItem(obj.interval); // obj.name
        for(let i = 0; i < obj.params.length; i++) { // series changed to params
            chartItem.add (new ChartElement(obj.params[i].name, obj.params[i].value));
        }
        return chartItem;
    }
}

export class AssetChartMgr {
    chartUIData = new ChartUIData();
    chartItemList = new Array<ChartItem>();
    constructor() {
    }
   
    init(jsons : any) {
        let tList = jsons;
        this.chartItemList = [];
        for(let i = 0; i < tList.length; i++) {
            let chartItem = ChartItem.create(tList[i]); // using only the output parameters
            this.add(chartItem);
        }
    }
  
    add(chartItem:ChartItem) {
        this.chartItemList.push(chartItem);
    }
   
    getAssetChartItemList() {
        let charts = new Array<any>();
        for (let i = 0; i < this.chartItemList.length; i++) {
            charts.push(this.chartItemList[i].getAsJsonData());
        }   
        return charts;
    }

    getChartUIData() {
        return this.chartUIData;
    }

    createTestData() {
        let chartIatem =  ChartItem.create({
            name: "May",
            series: [
                {
                    "name": "Distance",
                    "value": 50
                },
                {
                    "name": "petrol",
                    "value": 60
                }
            ]
        });

        let chartIatem2 =  ChartItem.create({
            name: "June",
            series: [
                {
                    "name": "Distance",
                    "value": 70
                },
                {
                    "name": "petrol",
                    "value": 80
                }
            ]
        });
      
        this.add(chartIatem);
        this.add(chartIatem2);
    }
    // only for testing
}



export class ChartUIData {
   
    showXAxis: boolean = true;
    showYAxis: boolean = true;
    gradient: boolean = false;
    showLegend: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = 'Time';
    showYAxisLabel: boolean = true;
    yAxisLabel: string = 'Value';
    animations: boolean = true;
    timeline: boolean = true;
    colorScheme = {
      //domain: ['#5AA454', '#C7B42C', '#AAAAAA']
      domain:['aqua', 'blue', 'fuchsia', 'gray', 'green', 
      'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red', 
      'silver', 'teal', 'white', 'yellow']
    };
    setXAxisLabel(label) {
        this.xAxisLabel = label;
    }
    setYAxisLabel(label) {
        this.yAxisLabel = label;
    }
} 

// test data for chart;
/*
export var multimonths = [
    {
        "name": "January", // interval
        "series": [ //params
            {
                "name": "Distance",
                "value": 73
            },
            {
                "name": "petrol",
                "value": 89
            }
        ]
    },
    {
        "name": "Feb",
        "series": [
            {
                "name": "Distance",
                "value": 50
            },
            {
                "name": "petrol",
                "value": 25
            }
        ]
    },
];


export var multiweeks = [
    {
        "name": "1Week",
        "series": [
            {
                "name": "Distance",
                "value": 73
            },
            {
                "name": "petrol",
                "value": 89
            }
        ]
    },


    {
        "name": "2Week",
        "series": [
            {
                "name": "Distance",
                "value": 73
            },
            {
                "name": "petrol",
                "value": 89
            }
        ]
    },


    {
        "name": "3Week",
        "series": [
            {
                "name": "Distance",
                "value": 73
            },
            {
                "name": "petrol",
                "value": 89
            }
        ]
    },


    {
        "name": "4Week",
        "series": [
            {
                "name": "Distance",
                "value": 73
            },
            {
                "name": "petrol",
                "value": 89
            }
        ]
    },
]
*/