import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  BadgeComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  FormControlDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  PageItemComponent,
  PageLinkDirective,
  PaginationComponent,
  RowComponent,
  SpinnerComponent,
  TableDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { Pensioner } from '../../core/models/pensioners';
import { PensionsService } from '../../core/services/pensions.service';

@Component({
  selector: 'app-pensioners',
  styleUrl: './pensioners.component.scss',
  templateUrl: './pensioners.component.html',
  imports: [
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
    ButtonDirective,
    PaginationComponent,
    PageItemComponent,
    PageLinkDirective,
    BadgeComponent,
    SpinnerComponent,
    IconDirective,
  ],
})
export class PensionersComponent implements OnInit {
  private readonly pensionsService = inject(PensionsService);
  private readonly fb = inject(FormBuilder);

  readonly pageSize = 10;

  readonly searchForm = this.fb.nonNullable.group({
    search: [''],
  });

  private readonly pensioners = signal<Pensioner[]>([]);
  private readonly searchTerm = signal('');
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly currentPage = signal(1);

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

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredPensioners().length / this.pageSize)));

  readonly pagedPensioners = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredPensioners().slice(start, start + this.pageSize);
  });

  readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

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
}
