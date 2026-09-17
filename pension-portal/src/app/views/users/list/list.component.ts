import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective, ModalBodyComponent, ModalComponent, ModalHeaderComponent, ModalTitleDirective, RowComponent, SpinnerComponent, TableDirective } from '@coreui/angular';
import { Staff } from '../../../core/models/staff';
import { UsersService } from '../../../core/services/users.service';
import { UserFormComponent } from '../form/form.component';
@Component({ selector: 'app-users-list', templateUrl: './list.component.html', styleUrl: './list.component.scss', imports: [ReactiveFormsModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, FormControlDirective, ButtonDirective, TableDirective, SpinnerComponent, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ModalBodyComponent, UserFormComponent] })
export class UsersListComponent implements OnInit {
  private readonly usersService = inject(UsersService); private readonly fb = inject(FormBuilder);
  readonly users = signal<Staff[]>([]); readonly loading = signal(false); readonly errorMessage = signal(''); readonly createVisible = signal(false); readonly searchForm = this.fb.nonNullable.group({ search: [''] });
  readonly filteredUsers = computed(() => { const term = this.searchForm.controls.search.value.trim().toLowerCase(); return term ? this.users().filter(user => [user.username, user.firstName, user.surName, user.email, user.profile].some(v => v?.toLowerCase().includes(term))) : this.users(); });
  ngOnInit(): void { this.loadUsers(); }
  loadUsers(): void { this.loading.set(true); this.errorMessage.set(''); this.usersService.getStaff().subscribe({ next: users => { this.users.set(users); this.loading.set(false); }, error: () => { this.errorMessage.set('Users could not be loaded.'); this.loading.set(false); } }); }
  onUserCreated(): void { this.createVisible.set(false); this.loadUsers(); }

  /** No deactivate endpoint yet — UI-only action. */
  deactivateUser(user: Staff): void {
    console.log('Deactivate user (UI only, no endpoint yet):', user);
  }

  /** No block endpoint yet — UI-only action. */
  blockUser(user: Staff): void {
    console.log('Block user (UI only, no endpoint yet):', user);
  }
}

export { UsersListComponent as ListComponent };
