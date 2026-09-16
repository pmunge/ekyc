export interface PeriodStats {
  totalPensioners: number;
  newEnrollments: number;
  pendingEnrollments: number;
  completedEnrollments: number;
}

export interface TrendPoint {
  period: string;
  enrollments: number;
}

export interface PeriodData {
  stats: PeriodStats;
  trend: TrendPoint[];
}

export type PeriodKey = 'Day' | 'Week' | 'Month';

export const dashboardData: Record<PeriodKey, PeriodData> = {
  Day: {
    stats: {
      totalPensioners: 12458,
      newEnrollments: 32,
      pendingEnrollments: 126,
      completedEnrollments: 11876
    },
    trend: [
      { period: '8 AM', enrollments: 3 },
      { period: '10 AM', enrollments: 5 },
      { period: '12 PM', enrollments: 7 },
      { period: '2 PM', enrollments: 6 },
      { period: '4 PM', enrollments: 8 },
      { period: '6 PM', enrollments: 3 }
    ]
  },
  Week: {
    stats: {
      totalPensioners: 12458,
      newEnrollments: 214,
      pendingEnrollments: 126,
      completedEnrollments: 11876
    },
    trend: [
      { period: 'Mon', enrollments: 24 },
      { period: 'Tue', enrollments: 31 },
      { period: 'Wed', enrollments: 28 },
      { period: 'Thu', enrollments: 35 },
      { period: 'Fri', enrollments: 42 },
      { period: 'Sat', enrollments: 29 },
      { period: 'Sun', enrollments: 25 }
    ]
  },
  Month: {
    stats: {
      totalPensioners: 12458,
      newEnrollments: 842,
      pendingEnrollments: 126,
      completedEnrollments: 11876
    },
    trend: [
      { period: '1 Sep', enrollments: 28 },
      { period: '5 Sep', enrollments: 35 },
      { period: '10 Sep', enrollments: 42 },
      { period: '15 Sep', enrollments: 38 },
      { period: '16 Sep', enrollments: 32 },
      { period: '20 Sep', enrollments: 45 },
      { period: '25 Sep', enrollments: 51 },
      { period: '30 Sep', enrollments: 58 }
    ]
  }
};
