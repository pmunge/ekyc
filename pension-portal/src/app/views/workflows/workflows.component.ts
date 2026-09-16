import { Component, OnInit, inject, signal } from '@angular/core';
import Swal from 'sweetalert2';
import {
  BadgeComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent,
  SpinnerComponent,
  TableDirective,
} from '@coreui/angular';
import { PendingApproval } from '../../core/models/approvals';
import { WorkflowService } from '../../core/services/workflow.service';

@Component({
  selector: 'app-workflows',
  styleUrl: './workflows.component.scss',
  templateUrl: './workflows.component.html',
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    TableDirective,
    ButtonDirective,
    BadgeComponent,
    SpinnerComponent,
  ],
})
export class WorkflowsComponent implements OnInit {
  private readonly workflowService = inject(WorkflowService);

  readonly pendingApprovals = signal<PendingApproval[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly approvingId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadPendingApprovals();
  }

  loadPendingApprovals(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.workflowService.getPendingApprovals().subscribe({
      next: (pendingApprovals) => {
        this.pendingApprovals.set(pendingApprovals);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load pending approvals', error);
        this.errorMessage.set('Failed to load pending approvals. Please try again.');
        this.loading.set(false);
      },
    });
  }

  async approve(member: PendingApproval): Promise<void> {
    const result = await Swal.fire({
      title: 'Approve member?',
      text: `Are you sure you want to approve ${member.fullName} (${member.pensionNumber})?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2eb85c',
    });

    if (!result.isConfirmed) {
      return;
    }

    this.approvingId.set(member.id);

    this.workflowService.approveMember(member.id).subscribe({
      next: () => {
        this.approvingId.set(null);
        this.pendingApprovals.update((approvals) => approvals.filter((approval) => approval.id !== member.id));
        Swal.fire('Approved!', `${member.fullName} has been approved.`, 'success');
      },
      error: (error) => {
        console.error('Failed to approve member', error);
        this.approvingId.set(null);
        Swal.fire('Error', 'Failed to approve this member. Please try again.', 'error');
      },
    });
  }
}
