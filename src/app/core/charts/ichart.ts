export interface SingleChartData {
  name: string,
  value: Number
}

export class SingleChartDataa {
  constructor(

    public value: any,
    public name: any
  ) {

    this.value = value;
    this.name = name;
  }
}

export class MultiChartDataa {
  constructor( public name: string,
  public series: SingleChartDataa[]) {
    this.name = name;
    this.series = series;
  }
}

export interface MultiChartData {
  name: string,
  series: SingleChartData[]
}

export interface BubbleChartData {
  name: string,
  series: BubbleChartSeries[]
}
export interface BubbleChartSeries {
  name: string,
  x: string,
  y: number,
  r: number
}

export interface AreaFilledChartData {
  name: string,
  series: AreaFilledChartSeries[]
}
export interface AreaFilledChartSeries {
  name: string,
  value: number
}

/*export interface ILineChart {
  width: number;
  height: number;
  // options
  showXAxis: boolean;
  showYAxis: boolean;
  gradient: boolean;
  showXAxisLabel: boolean;
  xAxisLabel: string;
  showYAxisLabel: boolean;
  yAxisLabel: string;
  showLegend: boolean;
  colorScheme: any;
  // line area
  autoScale: boolean;
}

export class LineChart implements ILineChart {
  public width: number;
  public height: number;
  // options
  public showXAxis: boolean;
  public showYAxis: boolean;
  public xAxisDataType: any;
  public yAxisDataType: any;
  public seriesNameDataType: any;
  public gradient: boolean;
  public showXAxisLabel: boolean;
  public xAxisLabel: string;
  public showYAxisLabel: boolean;
  public yAxisLabel: string;
  public showLegend: boolean;
  public colorScheme: IColorScheme;
  public autoScale: boolean;
  public roundDomains: boolean;
  public axisTickFormatting: boolean;

  constructor(public data: any) {
    this.width = this.data.width || 100;
    this.height = this.data.height || 300;
    this.showXAxis = this.data.showXAxis === undefined ? true : this.data.showXAxis;
    this.showYAxis = this.data.showYAxis === undefined ? true : this.data.showYAxis;
    this.xAxisDataType = this.data.xAxisDataType == undefined ? 'date' : this.data.xAxisDataType;
    this.yAxisDataType = this.data.yAxisDataType == undefined ? 'number' : this.data.yAxisDataType;
    this.seriesNameDataType = this.seriesNameDataType == undefined ? 'string' : this.seriesNameDataType;
    this.gradient = this.data.gradient === undefined ? true : this.data.gradient;
    this.showXAxisLabel = this.data.showXAxisLabel === undefined ? false : this.data.showXAxisLabel;
    this.xAxisLabel = this.data.xAxisLabel || 'x';
    this.showYAxisLabel = this.data.showYAxisLabel === undefined ? false : this.data.showYAxisLabel;
    this.yAxisLabel = this.data.yAxisLabel || 'y';
    this.showLegend = this.data.showLegend === undefined ? false : this.data.showLegend;
    this.roundDomains = this.data.roundDomains === undefined ? true : this.data.roundDomains;
    this.colorScheme = this.data.colorScheme === undefined ?
        { domain: ['#52ba9b', '#f48b37', '#ef4846', '#348ea9', '#f3af2f', '#cf4385', '#a6d9fd', '#935bcd', '#4da338'
      , '#aaaaaa', '#f17cb0', '#b2912f', '#b276b2', '#decf3f'] } : this.data.colorScheme ;
    this.autoScale = this.data.autoScale === undefined ? false : this.data.autoScale;
    this.axisTickFormatting = this.data.axisTickFormatting === undefined ? true : this.data.axisTickFormatting;
  }
}*/
export class LineChartConfig {
  public width: number;
  public height: number;
  public showXAxis: boolean;
  public showYAxis: boolean;
  public xAxisDataType: string;
  public yAxisDataType: string;
  public seriesNameDataType: string;
  public gradient: boolean;
  public showXAxisLabel: boolean;
  public xAxisLabel: string;
  public showYAxisLabel: boolean;
  public yAxisLabel: string;
  public showLegend: boolean;
  public colorScheme: IColorScheme;
  public autoScale: boolean;
  public roundDomains: boolean;
  public axisTickFormatting: boolean;
  constructor(
    width: number,
    height: number,
    showXAxis: boolean,
    showYAxis: boolean,
    xAxisDataType: string,
    yAxisDataType: string,
    seriesNameDataType: string,
    gradient: boolean,
    showXAxisLabel: boolean,
    xAxisLabel: string,
    showYAxisLabel: boolean,
    yAxisLabel: string,
    showLegend: boolean,
    colorScheme: IColorScheme,
    autoScale: boolean,
    roundDomains: boolean,
    axisTickFormatting: boolean
  ) {
    this.width = width;
    this.height = height;
    this.showXAxis = showXAxis;
    this.showYAxis = showYAxis;
    this.xAxisDataType = xAxisDataType;
    this.yAxisDataType = yAxisDataType;
    this.seriesNameDataType = seriesNameDataType;
    this.gradient = gradient;
    this.showXAxisLabel = showXAxisLabel;
    this.xAxisLabel = xAxisLabel;
    this.showYAxisLabel = showYAxisLabel;
    this.yAxisLabel = yAxisLabel;
    this.showLegend = showLegend;
    this.colorScheme = colorScheme;
    this.autoScale = autoScale;
    this.roundDomains = roundDomains;
    this.axisTickFormatting = axisTickFormatting;
  }
}

export interface IColorScheme {
  domain: string[]
}

/*export interface IPieChart {
  view: any[];
  // options
  showLegend: boolean;
  colorScheme: IColorScheme;
  // pie
  showLabels: boolean;
  explodeSlices: boolean;
  doughnut: boolean;
}

export class PieChart implements IPieChart {
  public view: any[];
  // options
  public showLegend: boolean;
  public colorScheme: IColorScheme;
  // pie
  public showLabels: boolean;
  public explodeSlices: boolean;
  public doughnut: boolean;
  constructor(public data: any= {}) {
    this.view = this.data.view || [200, 200];
    this.showLegend = this.data.showLegend === undefined ? true : this.data.showLegend;
    this.colorScheme = this.data.colorScheme ||
    { domain: ['#94d67e', '#ee7f32', '#ef4846', '#6f7588', '#eb3c33', '#5acbf9', '#cf4385',
    '#935bcd', '#f3af2f', '#a6d9fd', '#aaaaaa', '#f17cb0', '#b2912f', '#b276b2', '#decf3f' ] };
    this.showLabels = this.data.showLabels === undefined ? false : this.data.showLabels;
    this.explodeSlices = this.data.explodeSlices === undefined ? false : this.data.explodeSlices;
    this.doughnut = this.data.doughnut === undefined ? false : this.data.doughnut;
  }
}*/

export class PieChatConfig {
  public view: any[];
  public showLegend: boolean;
  public colorScheme: IColorScheme;
  public showLabels: boolean;
  public explodeSlices: boolean;
  public doughnut: boolean;
  public tooltipDisabled: boolean;
  public gradient: boolean;
  public animations: boolean;
  constructor(
      view: any[],
      showLegend: boolean,
      colorScheme: IColorScheme,
      showLabels: boolean,
      explodeSlices: boolean,
      doughnut: boolean,
      tooltipDisabled: boolean,
      gradient: boolean,
      animations: boolean
  ) {
    this.view = view;
    this.showLegend = showLegend;
    this.colorScheme = colorScheme;
    this.showLabels = showLabels;
    this.explodeSlices = explodeSlices;
    this.doughnut = doughnut;
    this.tooltipDisabled = tooltipDisabled;
    this.gradient = gradient;
    this.animations = animations;
  }
}

export interface IBarChart {
  width: number;
  height: number;
  // options
  showXAxis: boolean;
  showYAxis: boolean;
  gradient: boolean;
  showLegend: boolean;
  showXAxisLabel: boolean;
  xAxisLabel: string;
  showYAxisLabel: boolean;
  yAxisLabel: string;
  colorScheme: IColorScheme
}

export class BarChart implements IBarChart {
  public width: number;
  public height: number;
  // options
  public showXAxis: boolean;
  public showYAxis: boolean;
  public xAxisValueDataType: any;
  public yAxisValueDataType: any;
  public gradient: boolean;
  public showLegend: boolean;
  public showXAxisLabel: boolean;
  public xAxisLabel: string;
  public showYAxisLabel: boolean;
  public yAxisLabel: string;
  public colorScheme: IColorScheme;
  public axisTickFormatting: boolean;
  constructor(public data: any) {
    this.width = this.data.width || 100;
    this.height = this.data.height || 300;
    this.showXAxis = this.data.showXAxis === undefined ? true : this.data.showXAxis;
    this.showYAxis = this.data.showYAxis === undefined ? true : this.data.showYAxis;
    this.xAxisValueDataType = this.data.xAxisValueDataType === undefined ? 'date' : this.data.xAxisValueDataType;
    this.yAxisValueDataType = this.data.yAxisValueDataType === undefined ? 'number' : this.data.yAxisValueDataType;
    this.gradient = this.data.gradient === undefined ? false : this.data.gradient;
    this.showXAxisLabel = this.data.showXAxisLabel === undefined ? false : this.data.showXAxisLabel;
    this.xAxisLabel = this.data.xAxisLabel || 'x';
    this.showYAxisLabel = this.data.showYAxisLabel === undefined ? false : this.data.showYAxisLabel;
    this.yAxisLabel = this.data.yAxisLabel || 'y';
    this.showLegend = this.data.showLegend === undefined ? false : this.data.showLegend;
    this.colorScheme = this.data.colorScheme === undefined ? {
      domain: ['#52ba9b', '#f48b37', '#ef4846', '#348ea9', '#f3af2f', '#cf4385', '#a6d9fd', '#935bcd', '#4da338'
      , '#aaaaaa', '#f17cb0', '#b2912f', '#b276b2', '#decf3f']
    } : this.data.colorScheme;
    this.axisTickFormatting = this.data.axisTickFormatting === undefined ? true : this.data.axisTickFormatting;
  }
}

export interface IBubbleChart {
  width: number;
  height: number;
  // options
  showXAxis: boolean;
  showYAxis: boolean;
  showLegend: boolean;
  showXAxisLabel: boolean;
  xAxisLabel: string;
  showYAxisLabel: boolean;
  yAxisLabel: string;
  colorScheme: IColorScheme;
  autoScale: boolean;
}

export class BubbleChart implements IBubbleChart {
  public width: number;
  public height: number;
  // options
  public showXAxis: boolean;
  public showYAxis: boolean;

  public showLegend: boolean;
  public showXAxisLabel: boolean;
  public xAxisLabel: string;
  public showYAxisLabel: boolean;
  public yAxisLabel: string;
  public colorScheme: IColorScheme;
  public autoScale: boolean;
  constructor(public data: any) {
    this.width = this.data.width || 100;
    this.height = this.data.height || 300;
    this.showXAxis = this.data.showXAxis === undefined ? true : this.data.showXAxis;
    this.showYAxis = this.data.showYAxis === undefined ? true : this.data.showYAxis;
    this.showXAxisLabel = this.data.showXAxisLabel === undefined ? true : this.data.showXAxisLabel;
    this.xAxisLabel = this.data.xAxisLabel || 'x';
    this.showYAxisLabel = this.data.showYAxisLabel === undefined ? true : this.data.showYAxisLabel;
    this.yAxisLabel = this.data.yAxisLabel || 'y';
    this.showLegend = this.data.showLegend === undefined ? true : this.data.showLegend;
    this.colorScheme = {
      domain: ['#52ba9b', '#f48b37', '#ef4846', '#348ea9', '#f3af2f', '#cf4385', '#a6d9fd', '#935bcd', '#4da338'
      , '#aaaaaa', '#f17cb0', '#b2912f', '#b276b2', '#decf3f']
    };
    this.autoScale = this.data.autoScale === undefined ? true : this.data.autoScale;
  }
}

export interface IAreaFilledChart {
  width: number;
  height: number;
  showXAxis: boolean;
  showYAxis: boolean;
  showLegend: boolean;
  showXAxisLabel: boolean;
  xAxisLabel: string;
  showYAxisLabel: boolean;
  yAxisLabel: string;
  colorScheme: IColorScheme;
  autoScale: boolean;
}

export class AreaFilledChart implements IAreaFilledChart {
  public width: number;
  public height: number;
  // options
  public showXAxis: boolean;
  public showYAxis: boolean;

  public showLegend: boolean;
  public showXAxisLabel: boolean;
  public xAxisLabel: string;
  public showYAxisLabel: boolean;
  public yAxisLabel: string;
  public colorScheme: IColorScheme;
  public autoScale: boolean;
  constructor(public data: any) {
    this.width = this.data.width || 100;
    this.height = this.data.height || 300;
    this.showXAxis = this.data.showXAxis === undefined ? true : this.data.showXAxis;
    this.showYAxis = this.data.showYAxis === undefined ? true : this.data.showYAxis;
    this.showXAxisLabel = this.data.showXAxisLabel === undefined ? true : this.data.showXAxisLabel;
    this.xAxisLabel = this.data.xAxisLabel || 'x';
    this.showYAxisLabel = this.data.showYAxisLabel === undefined ? true : this.data.showYAxisLabel;
    this.yAxisLabel = this.data.yAxisLabel || 'y';
    this.showLegend = this.data.showLegend === undefined ? true : this.data.showLegend;
    this.colorScheme = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
    this.autoScale = this.data.autoScale === undefined ? true : this.data.autoScale;
  }
}

export interface IHeatMapChart {
  width: number;
  height: number;
  // options
  showXAxis: boolean;
  showYAxis: boolean;
  gradient: boolean;
  showLegend: boolean;
  showXAxisLabel: boolean;
  xAxisLabel: string;
  showYAxisLabel: boolean;
  yAxisLabel: string;
  colorScheme: IColorScheme
}

export class HeatMapChart implements IHeatMapChart {
  public width: number;
  public height: number;
  // options
  public showXAxis: boolean;
  public showYAxis: boolean;
  public gradient: boolean;
  public showLegend: boolean;
  public showXAxisLabel: boolean;
  public xAxisLabel: string;
  public showYAxisLabel: boolean;
  public yAxisLabel: string;
  public colorScheme: IColorScheme
  constructor(public data: any) {
    this.width = this.data.width || 100;
    this.height = this.data.height || 300;
    this.showXAxis = this.data.showXAxis === undefined ? true : this.data.showXAxis;
    this.showYAxis = this.data.showYAxis === undefined ? true : this.data.showYAxis;
    this.gradient = this.data.gradient === undefined ? false : this.data.gradient;
    this.showXAxisLabel = this.data.showXAxisLabel === undefined ? true : this.data.showXAxisLabel;
    this.xAxisLabel = this.data.xAxisLabel || 'x';
    this.showYAxisLabel = this.data.showYAxisLabel === undefined ? true : this.data.showYAxisLabel;
    this.yAxisLabel = this.data.yAxisLabel || 'y';
    this.showLegend = this.data.showLegend === undefined ? true : this.data.showLegend;
    this.colorScheme = {
      domain: ['#52ba9b', '#f48b37', '#ef4846', '#348ea9', '#f3af2f', '#cf4385', '#a6d9fd', '#935bcd', '#4da338'
      , '#aaaaaa', '#f17cb0', '#b2912f', '#b276b2', '#decf3f']
    };
  }
}


export class SingleGaugeData {
  constructor(
    public name: string,
    public value: Number) {
    this.name = name;
    this.value = value;
  }
}
