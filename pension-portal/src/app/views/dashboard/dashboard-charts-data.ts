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

export const PRODUCT_COLORS = ['#0C67C8', '#27AAE1', '#D49B35', '#003C7A'];

const countFormatter = new Intl.NumberFormat('en-US');
const compactFormatter = new Intl.NumberFormat('en-US', { notation: 'compact' });

@Injectable({
  providedIn: 'any'
})
export class DashboardChartsData {
  constructor() {
    this.buildChart('Day');
  }

  public mainChart: IChartProps = { type: 'line' };

  buildChart(period: PeriodKey): void {
    const { trend } = dashboardData[period];
    const color = PRODUCT_COLORS[0 % PRODUCT_COLORS.length];

    this.mainChart.type = 'line';
    this.mainChart.data = {
      labels: trend.map((point) => point.period),
      datasets: [
        {
          label: 'Enrollments',
          data: trend.map((point) => point.enrollments),
          borderColor: color,
          backgroundColor: color,
          pointBackgroundColor: color,
          fill: false,
          tension: 0,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5
        }
      ]
    };

    this.mainChart.options = {
      maintainAspectRatio: false,
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            padding: 16,
            font: { size: 11 }
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx: any) => `${countFormatter.format(Number(ctx.parsed.y) || 0)} enrollments`
          }
        }
      },
      scales: this.getScales()
    };
  }

  getScales(): ScaleOptions<any> {
    const colorBody = getStyle('--cui-body-color');

    return {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: colorBody,
          autoSkip: true,
          maxTicksLimit: 8,
          maxRotation: 0,
          minRotation: 0
        }
      },
      y: {
        beginAtZero: true,
        border: {
          color: 'rgba(0, 60, 122, 0.08)'
        },
        grid: {
          color: 'rgba(0, 60, 122, 0.08)'
        },
        ticks: {
          color: colorBody,
          maxTicksLimit: 6,
          callback: (value: string | number) => compactFormatter.format(Number(value))
        }
      }
    };
  }
}
