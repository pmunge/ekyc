import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PensionersComponent } from './pensioners.component';

describe('PensionersComponent', () => {
  let component: PensionersComponent;
  let fixture: ComponentFixture<PensionersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PensionersComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PensionersComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
