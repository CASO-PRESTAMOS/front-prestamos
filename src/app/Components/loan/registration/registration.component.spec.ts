import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanRegistrationComponent } from './registration.component';

describe('RegistrationComponent', () => {
  let component: LoanRegistrationComponent;
  let fixture: ComponentFixture<LoanRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanRegistrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoanRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
