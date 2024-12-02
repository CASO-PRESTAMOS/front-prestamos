import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanPreRegistrationComponent } from './pre-registration.component';

describe('RegistrationComponent', () => {
  let component: LoanPreRegistrationComponent;
  let fixture: ComponentFixture<LoanPreRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanPreRegistrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoanPreRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
