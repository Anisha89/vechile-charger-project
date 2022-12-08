import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import * as d3 from 'd3';
export * from 'd3-scale';

@Component({
  selector: 'app-thermo-chart',
  templateUrl: './thermo-chart.component.html',
  styleUrls: ['./thermo-chart.component.scss']
})
export class ThermoChartComponent implements OnInit {

  @ViewChild('genThermo') gennThermo;
  public width = 80;
  public height = 180;
  public maxTemp: number = 20.2;
  public minTemp: number = 15.4;
  public currentTemp: number = 19.2;
  public  bottomY = this.height - 5;
  public  topY = 5;
  public  bulbRadius = 20;
  public  tubeWidth = 21.5;
  public  tubeBorderWidth = 1;
  public  mercuryColor = "rgb(230,0,0)";
  public  innerBulbColor = "rgb(230, 200, 200)";
  public  tubeBorderColor = "#999999";
  public isMax;
  public  bulb_cy = this.bottomY - this.bulbRadius;
  public bulb_cx = this.width/2;
  public top_cy = this.topY + this.tubeWidth/2;
  public step;
  public domain;
  public svgAxis;
  public scale;
  public tickValues;
  public tubeFill_bottom;
  public axis;
  public tubeFill_top;
  public minMax:any[]=[];
  public label;
  public textCol;
  public textOffset;
  public svg;
  public defs;
  public bulbGradient;
  constructor() {

  }

  ngAfterViewInit() {
    this.svg = d3.select(this.gennThermo.nativeElement)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    this.defs=this.svg.append("defs");
    this.bulbGradient= this.defs.append("radialGradient")
      .attr("id", "bulbGradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%")
      .attr("fx", "50%")
      .attr("fy", "50%");
     this.afterSvgCreate();

  }
  ngOnInit() {

  }

  afterSvgCreate(){
    this.bulbGradient.append("stop")
      .attr("offset", "0%")
      .style("stop-color", this.innerBulbColor);

    this.bulbGradient.append("stop")
      .attr("offset", "90%")
      .style("stop-color", this.mercuryColor);

    this.svg.append("circle")
      .attr("r", this.tubeWidth/2)
      .attr("cx", this.width/2)
      .attr("cy", this.top_cy)
      .style("fill", "#FFFFFF")
      .style("stroke", this.tubeBorderColor)
      .style("stroke-width", this.tubeBorderWidth + "px");



    this.svg.append("rect")
      .attr("x", this.width/2 - this.tubeWidth/2)
      .attr("y", this.top_cy)
      .attr("height", this.bulb_cy - this.top_cy)
      .attr("width", this.tubeWidth)
      .style("shape-rendering", "crispEdges")
      .style("fill", "#FFFFFF")
      .style("stroke", this.tubeBorderColor)
      .style("stroke-width", this.tubeBorderWidth + "px");



    this.svg.append("circle")
      .attr("r", this.tubeWidth/2 - this.tubeBorderWidth/2)
      .attr("cx", this.width/2)
      .attr("cy", this.top_cy)
      .style("fill", "#FFFFFF")
      .style("stroke", "none")




    this.svg.append("circle")
      .attr("r", this.bulbRadius)
      .attr("cx", this.bulb_cx)
      .attr("cy", this.bulb_cy)
      .style("fill", "#FFFFFF")
      .style("stroke", this.tubeBorderColor)
      .style("stroke-width", this.tubeBorderWidth + "px");



    this.svg.append("rect")
      .attr("x", this.width/2 - (this.tubeWidth - this.tubeBorderWidth)/2)
      .attr("y", this.top_cy)
      .attr("height", this.bulb_cy - this.top_cy)
      .attr("width", this.tubeWidth - this.tubeBorderWidth)
      .style("shape-rendering", "crispEdges")
      .style("fill", "#FFFFFF")
      .style("stroke", "none");



    this.step = 5;


    this.domain = [
      this.step * Math.floor(this.minTemp / this.step),
      this.step * Math.ceil(this.maxTemp / this.step)
    ];



    if (this.minTemp - this.domain[0] < 0.66 * this.step)
      this.domain[0] -= this.step;

    if (this.domain[1] - this.maxTemp < 0.66 * this.step)
      this.domain[1] += this.step;



    this.scale = d3.scaleLinear()
      .range([this.bulb_cy - this.bulbRadius/2 - 8.5, this.top_cy])
      .domain(this.domain);


    this.minMax=[this.minTemp, this.maxTemp];
    this.minMax.forEach((t) => {

      this.isMax = (t == this.maxTemp),
        this.label = (this.isMax ? "max" : "min"),
        this.textCol = (this.isMax ? "rgb(230, 0, 0)" : "rgb(0, 0, 230)"),
        this.textOffset = (this.isMax ? -4 : 4);

      this.svg.append("line")
        .attr("id", this.label + "Line")
        .attr("x1", this.width/2 - this.tubeWidth/2)
        .attr("x2", this.width/2 + this.tubeWidth/2 + 22)
        .attr("y1", this.scale(t))
        .attr("y2", this.scale(t))
        .style("stroke", this.tubeBorderColor)
        .style("stroke-width", "1px")
        .style("shape-rendering", "crispEdges");

      this.svg.append("text")
        .attr("x", this.width/2 + this.tubeWidth/2 + 2)
        .attr("y", this.scale(t) + this.textOffset)
        .attr("dy", this.isMax ? null : "0.75em")
        .text(this.label)
        .style("fill", this.textCol)
        .style("font-size", "11px")

    });


    this.tubeFill_bottom = this.bulb_cy;
    this.tubeFill_top = this.scale(this.currentTemp);


    this.svg.append("rect")
      .attr("x", this.width/2 - (this.tubeWidth - 10)/2)
      .attr("y", this.tubeFill_top)
      .attr("width", this.tubeWidth - 10)
      .attr("height", this.tubeFill_bottom - this.tubeFill_top)
      .style("shape-rendering", "crispEdges")
      .style("fill", this.mercuryColor)



    this.svg.append("circle")
      .attr("r", this.bulbRadius - 6)
      .attr("cx", this.bulb_cx)
      .attr("cy", this.bulb_cy)
      .style("fill", "url(#bulbGradient)")
      .style("stroke", this.mercuryColor)
      .style("stroke-width", "2px");



    this.tickValues = d3.range((this.domain[1] - this.domain[0])/this.step + 1).map((v) => { return this.domain[0] + v * this.step; });



    this.axis = d3.axisLeft(this.scale)
      .tickValues(this.tickValues);


    this.svgAxis = this.svg.append("g")
      .attr("id", "tempScale")
      .attr("transform", "translate(" + (this.width/2 - this.tubeWidth/2) + ",0)")
      .call(this.axis);


    this.svgAxis.selectAll(".tick text")
      .style("fill", "#777777")
      .style("font-size", "10px");


    this.svgAxis.select("path")
      .style("stroke", "none")
      .style("fill", "none")


    this.svgAxis.selectAll(".tick line")
      .style("stroke", this.tubeBorderColor)
      .style("shape-rendering", "crispEdges")
      .style("stroke-width", "1px");
  }

}
