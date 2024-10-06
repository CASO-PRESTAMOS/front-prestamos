import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { LoanService} from "../../Services/loan.service";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class LoanRegistrationComponent {
  loanForm: FormGroup;
  dniErrorMessage: string = '';
  errorMessage: string = '';
  successMessage: string = '';  // Añadido para manejar el éxito

  constructor(private fb: FormBuilder, private loanService: LoanService, private router: Router) {
    this.loanForm = this.fb.group({
      clientName: ['', [Validators.required]],
      clientDNI: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],  // Solo 8 dígitos numéricos
      clientAddress: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(1)]],
      duration: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loanForm.valid) {
      this.loanService.createLoan(this.loanForm.value).subscribe({
        next: response => {
          this.successMessage = 'Préstamo registrado con éxito.';  // Mensaje de éxito
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard']);
          }, 1500);  // Redirigir después de 1.5 segundos
        },
        error: err => {
          if (err.status === 400 && err.error === 'DNI no válido') {
            this.dniErrorMessage = 'El DNI proporcionado no es válido.';
          } else {
            this.errorMessage = 'Error al registrar el préstamo.';
          }
        }
      });
    }
  }

  cancelRegistration() {
    this.router.navigate(['/admin/dashboard']);
  }
}
