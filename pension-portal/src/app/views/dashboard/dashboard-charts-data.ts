import { Injectable } from '@angular/core';
import { ChartData, ChartOptions, ChartType, ScaleOptions } from 'chart.js';
import { getStyle } from '@coreui/utils';
import { dashboardData, PeriodKey } from '../../core/data/dashboard';

export interface IChartProps {
  data?: ChartData;
  options?: ChartOptions;
  type: ChartType;

  [propName: string]: any;
}

@Injectable({
  providedIn: 'any'
})
export class DashboardChartsData {
  constructor() {
    this.buildChart('Day');
  }

  public mainChart: IChartProps = { type: 'bar' };

  buildChart(period: PeriodKey): void {
    const brandPrimary = getStyle('--cui-primary') ?? '#30497D';
    const brandPrimaryBg = `rgba(${getStyle('--cui-primary-rgb')}, .2)`;

    const { trend } = dashboardData[period];

    this.mainChart.type = 'bar';
    this.mainChart.data = {
      labels: trend.map((point) => point.period),
      datasets: [
        {
          label: 'Enrollments',
          data: trend.map((point) => point.enrollments),
          backgroundColor: brandPrimaryBg,
          borderColor: brandPrimary,
          borderWidth: 2,
          borderRadius: 4
        }
      ]
    };

    this.mainChart.options = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: this.getScales()
    };
  }

  getScales(): ScaleOptions<any> {
    const colorBorderTranslucent = getStyle('--cui-border-color-translucent');
    const colorBody = getStyle('--cui-body-color');

    return {
      x: {
        grid: {
          color: colorBorderTranslucent,
          drawOnChartArea: false
        },
        ticks: {
          color: colorBody
        }
      },
      y: {
        border: {
          color: colorBorderTranslucent
        },
        grid: {
          color: colorBorderTranslucent
        },
        beginAtZero: true,
        ticks: {
          color: colorBody,
          maxTicksLimit: 6
        }
      }
    };
  }
}
