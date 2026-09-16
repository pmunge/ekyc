import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import Swal from 'sweetalert2';
import {
  BadgeComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  FormSelectDirective,
  RowComponent,
  SpinnerComponent,
  TableDirective,
} from '@coreui/angular';
import { Advance } from '../../../core/models/transactions';
import { TransactionsService } from '../../../core/services/transactions.service';
import { WorkflowService } from '../../../core/services/workflow.service';

@Component({
  selector: 'app-approve-transactions',
  styleUrl: './approve-transactions.component.scss',
  templateUrl: './approve-transactions.component.html',
  imports: [
    DatePipe,
    DecimalPipe,
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    TableDirective,
    ButtonDirective,
    FormSelectDirective,
    BadgeComponent,
    SpinnerComponent,
  ],
})
export class ApproveTransactionsComponent implements OnInit {
  private readonly transactionsService = inject(TransactionsService);
  private readonly workflowService = inject(WorkflowService);

  readonly pageSizeOptions = [5, 10, 25];

  private readonly transactions = signal<Advance[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly approvingId = signal<number | null>(null);
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);

  readonly pendingTransactions = computed(() =>
    this.transactions().filter((transaction) => transaction.status.toUpperCase() === 'PENDING')
  );

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.pendingTransactions().length / this.pageSize())));

  readonly pagedTransactions = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.pendingTransactions().slice(start, start + this.pageSize());
  });

  readonly totalItems = computed(() => this.pendingTransactions().length);

  readonly rangeStart = computed(() => (this.totalItems() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1));

  readonly rangeEnd = computed(() => Math.min(this.currentPage() * this.pageSize(), this.totalItems()));

  ngOnInit(): void {
    this.loadPendingTransactions();
  }

  loadPendingTransactions(): void {
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

  async approve(transaction: Advance): Promise<void> {
    const result = await Swal.fire({
      title: 'Approve transaction?',
      text: `Are you sure you want to approve ${transaction.reference} for ${transaction.pensionerName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2eb85c',
    });

    if (!result.isConfirmed) {
      return;
    }

    this.approvingId.set(transaction.id);

    this.workflowService.approveTransactionRequest(transaction.id).subscribe({
      next: () => {
        this.approvingId.set(null);
        this.transactions.update((transactions) => transactions.filter((t) => t.id !== transaction.id));
        Swal.fire('Approved!', `Transaction ${transaction.reference} has been approved.`, 'success');
      },
      error: (error) => {
        console.error('Failed to approve transaction', error);
        this.approvingId.set(null);
        Swal.fire('Error', 'Failed to approve this transaction. Please try again.', 'error');
      },
    });
  }
}
