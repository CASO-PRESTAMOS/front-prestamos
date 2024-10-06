import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { LoanService} from "../../Services/loan.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class LoanRegistrationComponent {
  loanForm: FormGroup;

  constructor(private fb: FormBuilder, private loanService: LoanService, private router: Router) {
    this.loanForm = this.fb.group({
      clientName: ['', Validators.required],
      clientDNI: ['', Validators.required],
      clientAddress: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      duration: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loanForm.valid) {
      this.loanService.createLoan(this.loanForm.value).subscribe(response => {
        alert('Préstamo registrado con éxito');
        this.router.navigate(['/loan/history']);
      });
    }
  }
}
