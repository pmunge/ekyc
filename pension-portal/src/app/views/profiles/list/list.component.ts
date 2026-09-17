import { Component, OnInit, inject, signal } from '@angular/core';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, ModalBodyComponent, ModalComponent, ModalHeaderComponent, ModalTitleDirective, RowComponent, TableDirective } from '@coreui/angular';
import { Profile } from '../../../core/models/profile';
import { ProfileService } from '../../../core/services/profiles.service';
import { ProfileFormComponent } from '../form/form.component';
@Component({ selector: 'app-profiles-list', templateUrl: './list.component.html', styleUrl: './list.component.scss', imports: [RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, ButtonDirective, TableDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ModalBodyComponent, ProfileFormComponent] })
export class ProfilesListComponent implements OnInit { private readonly profileService = inject(ProfileService); readonly profiles = signal<Profile[]>([]); readonly createVisible = signal(false); readonly errorMessage = signal(''); ngOnInit(): void { this.loadProfiles(); } loadProfiles(): void { this.profileService.getProfiles().subscribe({ next: profiles => this.profiles.set(profiles), error: () => this.errorMessage.set('Profiles could not be loaded.') }); } onCreated(): void { this.createVisible.set(false); this.loadProfiles(); }

  /** No deactivate endpoint yet — UI-only action. */
  deactivateProfile(profile: Profile): void {
    console.log('Deactivate profile (UI only, no endpoint yet):', profile);
  }
}
export { ProfilesListComponent as ListComponent };
