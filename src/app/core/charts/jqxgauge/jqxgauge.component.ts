/// <reference path="jqwidgets.d.ts" />
import '../../../../assets/js/jqxgauge.js';
import { Component, Input, Output, EventEmitter, ElementRef, forwardRef, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
declare let JQXLite: any;


@Component({
  selector: 'jqxGauge',
  templateUrl: './jqxgauge.component.html',
  styleUrls: ['./jqxgauge.component.scss']
})

export class jqxGaugeComponent implements OnChanges
{
  @Input('animationDuration') attrAnimationDuration: String | Number;
  @Input('border') attrBorder: jqwidgets.GaugeBorder;
  @Input('caption') attrCaption: jqwidgets.GaugeCaption;
  @Input('cap') attrCap: jqwidgets.GaugeCap;
  @Input('colorScheme') attrColorScheme: String;
  @Input('disabled') attrDisabled: Boolean;
  @Input('easing') attrEasing: any;
  @Input('endAngle') attrEndAngle: String | Number;
  @Input('int64') attrInt64: Boolean;
  @Input('labels') attrLabels: jqwidgets.GaugeLabels;
  @Input('min') attrMin: Number;
  @Input('max') attrMax: String | Number;
  @Input('pointer') attrPointer: jqwidgets.GaugePointer;
  @Input('radius') attrRadius: String | Number;
  @Input('ranges') attrRanges: Array<jqwidgets.GaugeRanges>;
  @Input('startAngle') attrStartAngle: String | Number;
  @Input('showRanges') attrShowRanges: Boolean;
  @Input('style') attrStyle: jqwidgets.GaugeStyle;
  @Input('ticksMajor') attrTicksMajor: jqwidgets.GaugeTicks;
  @Input('ticksMinor') attrTicksMinor: jqwidgets.GaugeTicks;
  @Input('ticksDistance') attrTicksDistance: String;
  @Input('value') attrValue: Number;
  @Input('width') attrWidth: String | Number;
  @Input('height') attrHeight: String | Number;

  @Input('auto-create') autoCreate: boolean = true;

  properties: string[] = ['animationDuration','border','caption','cap','colorScheme','disabled','easing','endAngle','height','int64','labels','min','max','pointer','radius','ranges','startAngle','showRanges','style','ticksMajor','ticksMinor','ticksDistance','value','width'];
  host: any;
  elementRef: ElementRef;
  widgetObject:  jqwidgets.jqxGauge;

  constructor(containerElement: ElementRef) {
    this.elementRef = containerElement;
  }

  ngOnInit() {
    if (this.autoCreate) {
      this.createComponent();
    }
  };

  ngOnChanges(changes: SimpleChanges) {
    if (this.host) {
      for (let i = 0; i < this.properties.length; i++) {
        let attrName = 'attr' + this.properties[i].substring(0, 1).toUpperCase() + this.properties[i].substring(1);
        let areEqual: boolean;

        if (this[attrName] !== undefined) {
          if (typeof this[attrName] === 'object') {
            if (this[attrName] instanceof Array) {
              areEqual = this.arraysEqual(this[attrName], this.host.jqxGauge(this.properties[i]));
            }
            if (areEqual) {
              return false;
            }

            this.host.jqxGauge(this.properties[i], this[attrName]);
            continue;
          }

          if (this[attrName] !== this.host.jqxGauge(this.properties[i])) {
            this.host.jqxGauge(this.properties[i], this[attrName]);
          }
        }
      }
    }
  }

  arraysEqual(attrValue: any, hostValue: any): boolean {
    if (attrValue.length != hostValue.length) {
      return false;
    }
    for (let i = 0; i < attrValue.length; i++) {
      if (attrValue[i] !== hostValue[i]) {
        return false;
      }
    }
    return true;
  }

  manageAttributes(): any {
    let options = {};
    for (let i = 0; i < this.properties.length; i++) {
      let attrName = 'attr' + this.properties[i].substring(0, 1).toUpperCase() + this.properties[i].substring(1);
      if (this[attrName] !== undefined) {
        options[this.properties[i]] = this[attrName];
      }
    }
    return options;
  }

  moveClasses(parentEl: HTMLElement, childEl: HTMLElement): void {
    let classes: any = parentEl.classList;
    if (classes.length > 0) {
      childEl.classList.add(...classes);
    }
    parentEl.className = '';
  }

  moveStyles(parentEl: HTMLElement, childEl: HTMLElement): void {
    let style = parentEl.style.cssText;
    childEl.style.cssText = style
    parentEl.style.cssText = '';
  }

  createComponent(options?: any): void {
    if (options) {
      JQXLite.extend(options, this.manageAttributes());
    }
    else {
      options = this.manageAttributes();
    }
    this.host = JQXLite(this.elementRef.nativeElement.firstChild);

    this.moveClasses(this.elementRef.nativeElement, this.host[0]);
    this.moveStyles(this.elementRef.nativeElement, this.host[0]);

    this.__wireEvents__();
    this.widgetObject = jqwidgets.createInstance(this.host, 'jqxGauge', options);

    this.__updateRect__();
  }

  createWidget(options?: any): void {
    this.createComponent(options);
  }

  __updateRect__() : void {
    this.host.css({ width: this.attrWidth, height: this.attrHeight });
  }

  setOptions(options: any) : void {
    this.host.jqxGauge('setOptions', options);
  }

  // jqxGaugeComponent properties
  animationDuration(arg?: String | Number) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('animationDuration', arg);
    } else {
      return this.host.jqxGauge('animationDuration');
    }
  }

  border(arg?: jqwidgets.GaugeBorder) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('border', arg);
    } else {
      return this.host.jqxGauge('border');
    }
  }

  caption(arg?: jqwidgets.GaugeCaption) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('caption', arg);
    } else {
      return this.host.jqxGauge('caption');
    }
  }

  cap(arg?: jqwidgets.GaugeCap) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('cap', arg);
    } else {
      return this.host.jqxGauge('cap');
    }
  }

  colorScheme(arg?: string) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('colorScheme', arg);
    } else {
      return this.host.jqxGauge('colorScheme');
    }
  }

  disabled(arg?: boolean) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('disabled', arg);
    } else {
      return this.host.jqxGauge('disabled');
    }
  }

  easing(arg?: string) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('easing', arg);
    } else {
      return this.host.jqxGauge('easing');
    }
  }

  endAngle(arg?: String | Number) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('endAngle', arg);
    } else {
      return this.host.jqxGauge('endAngle');
    }
  }

  height(arg?: String | Number) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('height', arg);
    } else {
      return this.host.jqxGauge('height');
    }
  }

  int64(arg?: boolean) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('int64', arg);
    } else {
      return this.host.jqxGauge('int64');
    }
  }

  labels(arg?: jqwidgets.GaugeLabels) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('labels', arg);
    } else {
      return this.host.jqxGauge('labels');
    }
  }

  min(arg?: number) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('min', arg);
    } else {
      return this.host.jqxGauge('min');
    }
  }

  max(arg?: String | Number) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('max', arg);
    } else {
      return this.host.jqxGauge('max');
    }
  }

  pointer(arg?: jqwidgets.GaugePointer) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('pointer', arg);
    } else {
      return this.host.jqxGauge('pointer');
    }
  }

  radius(arg?: String | Number) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('radius', arg);
    } else {
      return this.host.jqxGauge('radius');
    }
  }

  ranges(arg?: Array<jqwidgets.GaugeRanges>) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('ranges', arg);
    } else {
      return this.host.jqxGauge('ranges');
    }
  }

  startAngle(arg?: String | Number) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('startAngle', arg);
    } else {
      return this.host.jqxGauge('startAngle');
    }
  }

  showRanges(arg?: boolean) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('showRanges', arg);
    } else {
      return this.host.jqxGauge('showRanges');
    }
  }

  style(arg?: jqwidgets.GaugeStyle) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('style', arg);
    } else {
      return this.host.jqxGauge('style');
    }
  }

  ticksMajor(arg?: jqwidgets.GaugeTicks) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('ticksMajor', arg);
    } else {
      return this.host.jqxGauge('ticksMajor');
    }
  }

  ticksMinor(arg?: jqwidgets.GaugeTicks) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('ticksMinor', arg);
    } else {
      return this.host.jqxGauge('ticksMinor');
    }
  }

  ticksDistance(arg?: string) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('ticksDistance', arg);
    } else {
      return this.host.jqxGauge('ticksDistance');
    }
  }

  value(arg?: number) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('value', arg);
    } else {
      return this.host.jqxGauge('value');
    }
  }

  width(arg?: String | Number) : any {
    if (arg !== undefined) {
      this.host.jqxGauge('width', arg);
    } else {
      return this.host.jqxGauge('width');
    }
  }


  // jqxGaugeComponent functions
  disable(): void {
    this.host.jqxGauge('disable');
  }

  enable(): void {
    this.host.jqxGauge('enable');
  }

  val(value?: number): any {
    if (value !== undefined) {
      return this.host.jqxGauge("val", value);
    } else {
      return this.host.jqxGauge("val");
    }
  };


  @Output() onValueChanging = new EventEmitter();
  @Output() onValueChanged = new EventEmitter();

  __wireEvents__(): void {
    this.host.on('valueChanging', (eventData: any) => { this.onValueChanging.emit(eventData); });
    this.host.on('valueChanged', (eventData: any) => { this.onValueChanged.emit(eventData); });
  }

}


