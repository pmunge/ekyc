import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  BadgeComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  FormControlDirective,
  FormSelectDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent,
  SpinnerComponent,
  TableDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { Advance } from '../../core/models/transactions';
import { TransactionsService } from '../../core/services/transactions.service';

type Period = 'all' | 'hourly' | 'daily' | 'weekly';

const PERIOD_WINDOW_MS: Record<Exclude<Period, 'all'>, number> = {
  hourly: 60 * 60 * 1000,
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
};

@Component({
  selector: 'app-transactions',
  styleUrl: './transactions.component.scss',
  templateUrl: './transactions.component.html',
  imports: [
    DatePipe,
    DecimalPipe,
    ReactiveFormsModule,
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    TableDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    FormControlDirective,
    FormSelectDirective,
    ButtonDirective,
    BadgeComponent,
    SpinnerComponent,
    IconDirective,
  ],
})
export class TransactionsComponent implements OnInit {
  private readonly transactionsService = inject(TransactionsService);
  private readonly fb = inject(FormBuilder);

  readonly periodOptions: { value: Period; label: string }[] = [
    { value: 'all', label: 'All time' },
    { value: 'hourly', label: 'Hourly (last 1 hour)' },
    { value: 'daily', label: 'Daily (last 24 hours)' },
    { value: 'weekly', label: 'Weekly (last 7 days)' },
  ];

  readonly filterForm = this.fb.nonNullable.group({
    search: [''],
    period: ['all' as Period],
  });

  private readonly transactions = signal<Advance[]>([]);
  private readonly searchTerm = signal('');
  private readonly period = signal<Period>('all');
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly filteredTransactions = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const period = this.period();

    return this.transactions().filter((transaction) => {
      if (!this.isWithinPeriod(transaction.createdAt, period)) {
        return false;
      }

      if (!term) {
        return true;
      }

      return [
        transaction.reference,
        transaction.pensionNumber,
        transaction.pensionerName,
        transaction.requestedByName,
        transaction.approvedByName,
        transaction.status,
      ].some((field) => field?.toLowerCase().includes(term));
    });
  });

  ngOnInit(): void {
    this.loadTransactions();

    this.filterForm.controls.search.valueChanges.subscribe((value) => {
      this.searchTerm.set(value ?? '');
    });

    this.filterForm.controls.period.valueChanges.subscribe((value) => {
      this.period.set(value ?? 'all');
    });
  }

  loadTransactions(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.transactionsService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactions.set(transactions);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load transactions', error);
        this.errorMessage.set('Failed to load transactions. Please try again.');
        this.loading.set(false);
      },
    });
  }

  clearFilters(): void {
    this.filterForm.reset({ search: '', period: 'all' });
  }

  statusColor(status: string): string {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'danger';
      case 'PENDING':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  private isWithinPeriod(createdAt: string, period: Period): boolean {
    if (period === 'all') {
      return true;
    }

    const elapsed = Date.now() - new Date(createdAt).getTime();
    return elapsed <= PERIOD_WINDOW_MS[period];
  }
}
