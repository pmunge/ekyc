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
import { ExportService } from '../../core/services/export.service';

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
  private readonly exportService = inject(ExportService);
  private readonly fb = inject(FormBuilder);

  readonly pageSizeOptions = [5, 10, 25];

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
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);

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

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredTransactions().length / this.pageSize())));

  readonly pagedTransactions = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredTransactions().slice(start, start + this.pageSize());
  });

  readonly totalItems = computed(() => this.filteredTransactions().length);

  readonly rangeStart = computed(() => (this.totalItems() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1));

  readonly rangeEnd = computed(() => Math.min(this.currentPage() * this.pageSize(), this.totalItems()));

  ngOnInit(): void {
    this.loadTransactions();

    this.filterForm.controls.search.valueChanges.subscribe((value) => {
      this.searchTerm.set(value ?? '');
      this.currentPage.set(1);
    });

    this.filterForm.controls.period.valueChanges.subscribe((value) => {
      this.period.set(value ?? 'all');
      this.currentPage.set(1);
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
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    this.currentPage.set(page);
  }

  onPageSizeChange(size: string): void {
    this.pageSize.set(Number(size));
    this.currentPage.set(1);
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

  exportExcel(): void {
    this.exportService.exportToExcel(this.buildExportRows(), 'transactions');
  }

  exportPdf(): void {
    this.exportService.exportToPdf(this.buildExportRows(), this.exportColumns, 'transactions', 'Transactions');
  }

  private readonly exportColumns = [
    'date',
    'time',
    'reference',
    'pensioner',
    'pensionNumber',
    'amount',
    'reason',
    'status',
    'requestedBy',
  ];

  private buildExportRows(): Record<string, string | number>[] {
    return this.filteredTransactions().map((transaction) => {
      const createdAt = new Date(transaction.createdAt);

      return {
        date: createdAt.toLocaleDateString(),
        time: createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reference: transaction.reference,
        pensioner: transaction.pensionerName,
        pensionNumber: transaction.pensionNumber,
        amount: transaction.amount,
        reason: transaction.reason,
        status: transaction.status,
        requestedBy: transaction.requestedByName,
      };
    });
  }
}
