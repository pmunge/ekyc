import { Component, DestroyRef, DOCUMENT, computed, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import {
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressComponent,
  RowComponent,
  TemplateIdDirective,
  WidgetStatAComponent
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';

import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { dashboardData, PeriodKey } from '../../core/data/dashboard';
import { TransactionsComponent } from '../transactions/transactions.component';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  imports: [DecimalPipe, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule, ButtonGroupComponent, FormCheckLabelDirective, ChartjsComponent, CardFooterComponent, GutterDirective, ProgressComponent, WidgetStatAComponent, TemplateIdDirective, TransactionsComponent]
})
export class DashboardComponent implements OnInit {

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #document: Document = inject(DOCUMENT);
  readonly #renderer: Renderer2 = inject(Renderer2);
  readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);

  public mainChart: IChartProps = { type: 'bar' };
  public mainChartRef: WritableSignal<any> = signal(undefined);
  #mainChartRefEffect = effect(() => {
    if (this.mainChartRef()) {
      this.setChartStyles();
    }
  });
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new FormGroup({
    trafficRadio: new FormControl<PeriodKey>('Day')
  });

  readonly selectedPeriod = signal<PeriodKey>('Day');
  readonly stats = computed(() => dashboardData[this.selectedPeriod()].stats);

  ngOnInit(): void {
    this.initCharts();
    this.updateChartOnColorModeChange();
  }

  initCharts(): void {
    this.mainChartRef()?.stop();
    this.mainChart = this.#chartsData.mainChart;
  }

  setTrafficPeriod(value: PeriodKey): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.selectedPeriod.set(value);
    this.#chartsData.buildChart(value);
    this.initCharts();
  }

  handleChartRef($chartRef: any) {
    if ($chartRef) {
      this.mainChartRef.set($chartRef);
    }
  }

  updateChartOnColorModeChange() {
    const unListen = this.#renderer.listen(this.#document.documentElement, 'ColorSchemeChange', () => {
      this.setChartStyles();
    });

    this.#destroyRef.onDestroy(() => {
      unListen();
    });
  }

  setChartStyles() {
    if (this.mainChartRef()) {
      setTimeout(() => {
        const options: ChartOptions = { ...this.mainChart.options };
        const scales = this.#chartsData.getScales();
        this.mainChartRef().options.scales = { ...options.scales, ...scales };
        this.mainChartRef().update();
      });
    }
  }
}
