import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { LoanService} from "../../Services/loan.service";


@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class LoanRegistrationComponent {
  loanForm: FormGroup;

  constructor(private fb: FormBuilder, private loanService: LoanService) {
    this.loanForm = this.fb.group({
      clientName: ['', Validators.required],
      clientDNI: ['', Validators.required],
      clientAddress: ['', Validators.required],
      amount: [0, Validators.required],
      duration: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loanForm.valid) {
      this.loanService.createLoan(this.loanForm.value).subscribe(response => {
        alert('Préstamo creado con éxito');
      });
    }
  }
}
