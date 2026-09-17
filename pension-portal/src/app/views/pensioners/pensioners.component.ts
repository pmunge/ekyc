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
  ModalBodyComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  RowComponent,
  SpinnerComponent,
  TableDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { Pensioner } from '../../core/models/pensioners';
import { Advance } from '../../core/models/transactions';
import { PensionsService } from '../../core/services/pensions.service';
import { TransactionsService } from '../../core/services/transactions.service';
import { ExportService } from '../../core/services/export.service';
import { PensionerFormComponent } from './form/form.component';

@Component({
  selector: 'app-pensioners',
  styleUrl: './pensioners.component.scss',
  templateUrl: './pensioners.component.html',
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
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalBodyComponent,
    PensionerFormComponent,
  ],
})
export class PensionersComponent implements OnInit {
  private readonly pensionsService = inject(PensionsService);
  private readonly transactionsService = inject(TransactionsService);
  private readonly exportService = inject(ExportService);
  private readonly fb = inject(FormBuilder);

  readonly pageSizeOptions = [5, 10, 25];

  readonly searchForm = this.fb.nonNullable.group({
    search: [''],
  });

  private readonly pensioners = signal<Pensioner[]>([]);
  private readonly searchTerm = signal('');
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly createVisible = signal(false);
  readonly detailsVisible = signal(false);
  readonly detailsLoading = signal(false);
  readonly detailsError = signal('');
  readonly selectedPensioner = signal<Pensioner | null>(null);
  readonly lastTransactionVisible = signal(false);
  readonly lastTransactionLoading = signal(false);
  readonly lastTransactionError = signal('');
  readonly lastTransaction = signal<Advance | null>(null);
  readonly lastTransactionPensioner = signal<Pensioner | null>(null);

  readonly filteredPensioners = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const all = this.pensioners();

    if (!term) {
      return all;
    }

    return all.filter((pensioner) =>
      [
        pensioner.fullName,
        pensioner.nationalId,
        pensioner.kraPin,
        pensioner.pensionNumber,
        pensioner.phoneNumber,
        pensioner.emailAddress,
      ].some((field) => field?.toLowerCase().includes(term))
    );
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredPensioners().length / this.pageSize())));

  readonly pagedPensioners = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredPensioners().slice(start, start + this.pageSize());
  });

  readonly totalItems = computed(() => this.filteredPensioners().length);

  readonly rangeStart = computed(() => (this.totalItems() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1));

  readonly rangeEnd = computed(() => Math.min(this.currentPage() * this.pageSize(), this.totalItems()));

  ngOnInit(): void {
    this.loadPensioners();

    this.searchForm.controls.search.valueChanges.subscribe((value) => {
      this.searchTerm.set(value ?? '');
      this.currentPage.set(1);
    });
  }

  loadPensioners(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.pensionsService.getPensioners().subscribe({
      next: (pensioners) => {
        this.pensioners.set(pensioners);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load Pensioners', error);
        this.errorMessage.set('Failed to load pensioners. Please try again.');
        this.loading.set(false);
      },
    });
  }

  clearSearch(): void {
    this.searchForm.reset({ search: '' });
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

  onPensionerCreated(): void {
    this.createVisible.set(false);
    this.loadPensioners();
  }

  viewDetails(pensioner: Pensioner): void {
    this.selectedPensioner.set(pensioner);
    this.detailsError.set('');
    this.detailsLoading.set(true);
    this.detailsVisible.set(true);

    this.pensionsService.getPensionerByNationalId(pensioner.nationalId).subscribe({
      next: (details) => {
        this.selectedPensioner.set(details);
        this.detailsLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load pensioner details', error);
        this.detailsError.set('Failed to load pensioner details. Please try again.');
        this.detailsLoading.set(false);
      },
    });
  }

  viewLastTransaction(pensioner: Pensioner): void {
    this.lastTransactionPensioner.set(pensioner);
    this.lastTransaction.set(null);
    this.lastTransactionError.set('');
    this.lastTransactionLoading.set(true);
    this.lastTransactionVisible.set(true);

    this.transactionsService.getLastTransactionForEnrollment(pensioner.id).subscribe({
      next: (transaction) => {
        this.lastTransaction.set(transaction);
        this.lastTransactionLoading.set(false);
      },
      error: (error) => {
        this.lastTransactionLoading.set(false);
        if (error?.status === 404) {
          this.lastTransaction.set(null);
          return;
        }
        console.error('Failed to load last transaction', error);
        this.lastTransactionError.set('Failed to load the last transaction. Please try again.');
      },
    });
  }

  transactionStatusColor(status: string): string {
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

  exportExcel(): void {
    this.exportService.exportToExcel(this.buildExportRows(), 'pensioners');
  }

  exportPdf(): void {
    this.exportService.exportToPdf(this.buildExportRows(), this.exportColumns, 'pensioners', 'Pensioners');
  }

  private readonly exportColumns = [
    'fullName',
    'nationalId',
    'kraPin',
    'pensionNumber',
    'phoneNumber',
    'status',
    'approvalStatus',
  ];

  private buildExportRows(): Record<string, string | number>[] {
    return this.filteredPensioners().map((pensioner) => ({
      fullName: pensioner.fullName,
      nationalId: pensioner.nationalId,
      kraPin: pensioner.kraPin,
      pensionNumber: pensioner.pensionNumber,
      phoneNumber: pensioner.phoneNumber,
      status: pensioner.status,
      approvalStatus: pensioner.approvalStatus,
    }));
  }
}
