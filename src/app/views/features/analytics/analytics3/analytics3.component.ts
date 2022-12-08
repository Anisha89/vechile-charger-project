import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppContext } from '../../../../app.context';
declare var  CanvasJS: any;

@Component({
    selector: 'app-analytics3',
    templateUrl: 'analytics3.component.html',
    styleUrls: ['analytics3.component.scss']
})

export class Analytics3Component implements OnInit {

    constructor(private context: AppContext,
        private router: Router,
        private route: ActivatedRoute) {

    }

    ngOnInit() {
        let chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "light2",
            title:{
                text: "Demand charge is fixed and does not change with time"
            },
            axisX:{
                valueFormatString: "DD MMM",
                crosshair: {
                    enabled: true,
                    snapToDataPoint: true
                }
            },
            axisY: {
                title: "Number of Visits",
                crosshair: {
                    enabled: true
                }
            },
            toolTip:{
                shared:true
            },  
            legend:{
                cursor:"pointer",
                verticalAlign: "bottom",
                horizontalAlign: "left",
                dockInsidePlotArea: true,
                itemclick: toogleDataSeries
            },
            data: [{
                type: "line",
                showInLegend: true,
                name: "Total Visit",
                markerType: "square",
                xValueFormatString: "DD MMM, YYYY",
                color: "#F08080",
                dataPoints: [
                    { x: new Date(2017, 0, 3), y: 650 },
                    { x: new Date(2017, 0, 4), y: 700 },
                    { x: new Date(2017, 0, 5), y: 710 },
                    { x: new Date(2017, 0, 6), y: 658 },
                    { x: new Date(2017, 0, 7), y: 734 },
                    { x: new Date(2017, 0, 8), y: 963 },
                    { x: new Date(2017, 0, 9), y: 847 },
                    { x: new Date(2017, 0, 10), y: 853 },
                    { x: new Date(2017, 0, 11), y: 869 },
                    { x: new Date(2017, 0, 12), y: 943 },
                    { x: new Date(2017, 0, 13), y: 970 },
                    { x: new Date(2017, 0, 14), y: 869 },
                    { x: new Date(2017, 0, 15), y: 890 },
                    { x: new Date(2017, 0, 16), y: 930 }
                ]
            },
            {
                type: "line",
                showInLegend: true,
                name: "Unique Visit",
                lineDashType: "dash",
                dataPoints: [
                    { x: new Date(2017, 0, 3), y: 510 },
                    { x: new Date(2017, 0, 4), y: 560 },
                    { x: new Date(2017, 0, 5), y: 540 },
                    { x: new Date(2017, 0, 6), y: 558 },
                    { x: new Date(2017, 0, 7), y: 544 },
                    { x: new Date(2017, 0, 8), y: 693 },
                    { x: new Date(2017, 0, 9), y: 657 },
                    { x: new Date(2017, 0, 10), y: 663 },
                    { x: new Date(2017, 0, 11), y: 639 },
                    { x: new Date(2017, 0, 12), y: 673 },
                    { x: new Date(2017, 0, 13), y: 660 },
                    { x: new Date(2017, 0, 14), y: 562 },
                    { x: new Date(2017, 0, 15), y: 643 },
                    { x: new Date(2017, 0, 16), y: 570 }
                ]
            }]
        });
        chart.render();
        
        function toogleDataSeries(e){
            if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else{
                e.dataSeries.visible = true;
            }
            chart.render();
        }

        // Bar chart 

        var electricityDispatchChart = new CanvasJS.Chart("electricityDispatchChartContainer", {
            animationEnabled: true,
            title:{
                text: "Electricity Dispatch"
            },
            
            axisX: {
                interval: 1,
                intervalType: "year",
                valueFormatString: "YYYY"
            },

            axisY: {
                title: "Kw",
                titleFontColor: "#4F81BC",
                lineColor: "#4F81BC",
                labelFontColor: "#4F81BC",
                tickColor: "#4F81BC"
            },
            axisY2: {
                title: "Millions of Barrels/day",
                titleFontColor: "#C0504E",
                lineColor: "#C0504E",
                labelFontColor: "#C0504E",
                tickColor: "#C0504E"
            },	
            toolTip: {
                shared: true
            },
            legend: {
                reversed: true,
                verticalAlign: "center",
                horizontalAlign: "right"
            },
            data: [{
                type: "stackedColumn100",
                name: "Sold",
                showInLegend: true,
                xValueFormatString: "YYYY",
                yValueFormatString: "#,##0\"%\"",
                dataPoints: [
                    { x: new Date(2010,0), y: 40 },
                    { x: new Date(2011,0), y: 50 },
                    { x: new Date(2012,0), y: 60 },
                    { x: new Date(2013,0), y: 61 },
                    { x: new Date(2014,0), y: 63 },
                    { x: new Date(2015,0), y: 65 },
                    { x: new Date(2016,0), y: 67 }
                ]
            }, 
            {
                type: "stackedColumn100",
                name: "Residual",
                showInLegend: true,
                xValueFormatString: "YYYY",
                yValueFormatString: "#,##0\"%\"",
                dataPoints: [
                    { x: new Date(2010,0), y: 28 },
                    { x: new Date(2011,0), y: 18 },
                    { x: new Date(2012,0), y: 12 },
                    { x: new Date(2013,0), y: 10 },
                    { x: new Date(2014,0), y: 10 },
                    { x: new Date(2015,0), y: 7 },
                    { x: new Date(2016,0), y: 5 }
                ]
            }, 
            {
                type: "stackedColumn100",
                name: "Pending",
                showInLegend: true,
                xValueFormatString: "YYYY",
                yValueFormatString: "#,##0\"%\"",
                dataPoints: [
                    { x: new Date(2010,0), y: 15 },
                    { x: new Date(2011,0), y: 12 },
                    { x: new Date(2012,0), y: 10 },
                    { x: new Date(2013,0), y: 9 },
                    { x: new Date(2014,0), y: 7 },
                    { x: new Date(2015,0), y: 5 },
                    { x: new Date(2016,0), y: 1 }
                ]
            },
            {
                type: "stackedColumn100",
                name: "Total",
                showInLegend: true,
                xValueFormatString: "YYYY",
                yValueFormatString: "#,##0\"%\"",
                dataPoints: [
                    { x: new Date(2010,0), y: 17 },
                    { x: new Date(2011,0), y: 20 },
                    { x: new Date(2012,0), y: 18 },
                    { x: new Date(2013,0), y: 20 },
                    { x: new Date(2014,0), y: 20 },
                    { x: new Date(2015,0), y: 23 },
                    { x: new Date(2016,0), y: 27 }
                ]
            }]
        });
        electricityDispatchChart.render();

        // Reporting charts

        let doughnutChart = new CanvasJS.Chart("doughnutChartContainer", {
            animationEnabled: true,
            title:{
                text: "Station Status",
                horizontalAlign: "left"
            },
            data: [{
                type: "doughnut",
                startAngle: 60,
                innerRadius: 30,
                indexLabelFontSize: 12,
                toolTipContent: "<b>{label}:</b> {y} (#percent%)",
                dataPoints: [
                    { y: 67, label: "In Use" },
                    { y: 28, label: "Available" },
                    { y: 10, label: "Offline" },
                    { y: 7, label: "Watch List"},
                    { y: 15, label: "Needs Service"}
                ]
            }]
        });
        doughnutChart.render();

        // 30 day column chart
        CanvasJS.addColorSet("lightgreenShades",
                [//colorSet Array
                "#0CF250"               
                ]);
        let columnChart = new CanvasJS.Chart("columnChartContainer", {
            animationEnabled: true,
            colorSet: "lightgreenShades",
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title:{
                text: "Station Usage"
            },
            axisY: {
                
            },
            data: [{        
                type: "column",  
                showInLegend: false, 
                legendMarkerColor: "grey",
                legendText: "",
                dataPoints: [      
                    { y: 30, label: "Light" },
                    { y: 5,  label: "Moderate" },
                    { y: 15,  label: "Heavy" },
                ]
            }]
        });
        columnChart.render();
        

// Real time chart
CanvasJS.addColorSet("lightGrey",
[//colorSet Array
"#EFEDEC",
"#BAC2BF"            
]);
var realTimeChart = new CanvasJS.Chart("realTimeChartContainer",
{
    title:{
        text: "Real Time Power", 
    },
    colorSet: "lightGrey",
      //backgroundColor: "black",
  data: [
  {
    type: "doughnut",
    dataPoints: [
    { y: 25 },
    { y: 75}
   
    ]
  }
  ]
});

convertToHalfDoughnut(realTimeChart);
realTimeChart.render();


function convertToHalfDoughnut(realTimeChart){
var sum = 0;
var dataPoints = realTimeChart.options.data[0].dataPoints;

for(var i = 0; i < dataPoints.length; i++){
    sum += dataPoints[i].y;
}

dataPoints.splice(0, 0, {y: sum, color: "transparent", toolTipContent: null, highlightEnabled: false});
}

// Average Session Length

// var horBarChart = new CanvasJS.Chart("horBarChartContainer", {
// 	animationEnabled: true,
// 	theme: "light2", //"light1", "dark1", "dark2"
// 	title:{
// 		text: "Average Session Length"            
// 	},
	
// 	toolTip:{
// 		shared: true
// 	},
// 	data:[{
// 		type: "stackedBar100",
// 		toolTipContent: "{label}<br><b>{name}:</b> {y} (#percent%)",
// 		showInLegend: false, 
// 		//name: "April",
// 		dataPoints: [
// 			{ y: 600, label: "Water Filter" }
			
// 		]
// 		},
// 		{
// 			type: "stackedBar100",
// 			toolTipContent: "<b>{name}:</b> {y} (#percent%)",
// 			showInLegend: false, 
// 			//name: "May",
// 			dataPoints: [
// 				{ y: 400, label: "Water Filter" }
				
// 			]
// 		}
// 		]
// });
// horBarChart.render();


//  Drivers Account
CanvasJS.addColorSet("orangeShades",
[//colorSet Array
"#FFC300"
]);
let driverAcctChart = new CanvasJS.Chart("driverAcctChartContainer", {
    animationEnabled: true,
    colorSet: "orangeShades",
    theme: "light2", // "light1", "light2", "dark1", "dark2"
    title:{
        text: "Driver Account"
    },
    axisY: {
        
    },
    data: [{        
        type: "column",  
        showInLegend: false, 
        legendMarkerColor: "grey",
        legendText: "",
        dataPoints: [      
            { y: 75, label: "Nov" },
            { y: 65,  label: "Dec" },
            { y: 77,  label: "Jan" },
            { y: 80,  label: "Feb" },
            { y: 100,  label: "Mar" },
            { y: 78,  label: "Apr" },
        ]
    }]
});
driverAcctChart.render();

// Financial  Chart

CanvasJS.addColorSet("greyShades",
[//colorSet Array
"#BAC2BF"
]);
let financialChart = new CanvasJS.Chart("financialChartContainer", {
    animationEnabled: true,
    colorSet: "greyShades",
    theme: "light2", // "light1", "light2", "dark1", "dark2"
    title:{
        text: "Financials"
    },
    axisY: {

    },
    data: [{
        type: "column",  
        showInLegend: false, 
        legendMarkerColor: "grey",
        legendText: "",
        dataPoints: [      
            { y: 110, label: "Nov" },
            { y: 70,  label: "Dec" },
            { y: 85,  label: "Jan" },
            { y: 90,  label: "Feb" },
            { y: 130,  label: "Mar" },
            { y: 78,  label: "Apr" },
        ]
    }]
});
financialChart.render();

    }
}
