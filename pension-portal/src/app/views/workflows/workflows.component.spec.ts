import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkflowsComponent } from './workflows.component';

describe('WorkflowsComponent', () => {
  let component: WorkflowsComponent;
  let fixture: ComponentFixture<WorkflowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WorkflowsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
