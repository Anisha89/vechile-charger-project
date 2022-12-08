import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { CarouselComponent } from './carousel/carousel.component';
import { SlideComponent } from './slide/slide.component';
import { SearchComponent } from './search/search.component';
import { PopupComponent } from './popup/popup.component';
import { SearchService } from './search/search.service';
import { SidenavMenuDirective } from './sidenav/sidenav-menu.directive';
import { SidenavContentDirective } from './sidenav/sidenav-content.directive';
import { SidenavComponent } from './sidenav/sidenav.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { TabsComponent } from './tabs/tabs.component';
import { TableSorterComponent } from './table-sorter/table-sorter.component';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { TimeSliderComponent } from './slider/time-slider/time-slider.component';
import { NouisliderComponent, NouisliderModule } from 'ng2-nouislider';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { DateSliderComponent } from './slider/date-slider/date-slider.component';
import { IconHoverDirective } from './icon-hover';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { BubbleChartComponent } from './charts/bubble-chart/bubble-chart.component';
import { FullscreenComponent } from './fullscreen/fullscreen.component';
import { FullScreenIconDirective } from './fullscreen/full-screen-icon.directive';
import { HeatMapChartComponent } from './charts/heat-map-chart/heat-map-chart.component';
import { GeneratorDescComponent } from './generator-desc/generator-desc.component';
import { HalfGaugeComponent } from './charts/half-gauge/half-gauge.component';
import { TimeseriesChartComponent } from './charts/timeseries-chart/timeseries-chart.component';
import { ThermoChartComponent } from './charts/thermo-chart/thermo-chart.component';
import { AreaFilledChartComponent } from './charts/area-filled-chart/area-filled-chart.component';
import {jqxGaugeComponent} from "./charts/jqxgauge/jqxgauge.component";

@NgModule({
  imports: [
    CommonModule,
    NgxChartsModule,
    // NouisliderModule,
    FormsModule
  ],
  declarations: [
    CarouselComponent,
    SlideComponent,
    SearchComponent,
    PopupComponent,
    SidenavMenuDirective,
    SidenavContentDirective,
    SidenavComponent,
    FileUploadComponent,
    TabsComponent,
    TableSorterComponent,
    PieChartComponent,
    TimeSliderComponent,
    LineChartComponent,
    DateSliderComponent,
    IconHoverDirective,
    BarChartComponent,
    BubbleChartComponent,
    FullscreenComponent,
    FullScreenIconDirective,
    NouisliderComponent,
    HeatMapChartComponent,
    GeneratorDescComponent,
    HalfGaugeComponent,
    TimeseriesChartComponent,
    ThermoChartComponent,
    AreaFilledChartComponent,
    jqxGaugeComponent

  ],
  exports: [
    CarouselComponent,
    SlideComponent,
    SearchComponent,
    PopupComponent,
    SidenavMenuDirective,
    SidenavContentDirective,
    SidenavComponent,
    FileUploadComponent,
    TabsComponent,
    TableSorterComponent,
    PieChartComponent,
    TimeSliderComponent,
    LineChartComponent,
    DateSliderComponent,
    IconHoverDirective,
    BarChartComponent,
    BubbleChartComponent,
    FullscreenComponent,
    FullScreenIconDirective,
    HeatMapChartComponent,
    GeneratorDescComponent,
    HalfGaugeComponent,
    ThermoChartComponent,
    AreaFilledChartComponent,
    jqxGaugeComponent
  ],
  providers: [
    SearchService
  ]
})
export class CoreModule { }
