import { Component, OnInit, inject, signal } from '@angular/core';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, TableDirective } from '@coreui/angular';
import { Permissions } from '../../../core/models/permissions';
import { PermissionsService } from '../../../core/services/permissions.service';
@Component({ selector: 'app-permissions-list', templateUrl: './list.component.html', styleUrl: './list.component.scss', imports: [RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective] })
export class PermissionsListComponent implements OnInit { private readonly permissionsService = inject(PermissionsService); readonly permissions = signal<Permissions[]>([]); readonly errorMessage = signal(''); ngOnInit(): void { this.permissionsService.getPermissions().subscribe({ next: permissions => this.permissions.set(permissions), error: () => this.errorMessage.set('Permissions could not be loaded.') }); } }
export { PermissionsListComponent as ListComponent };
