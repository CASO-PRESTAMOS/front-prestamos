import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { LoanService} from "../../Services/loan.service";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './pre-registration.component.html',
  styleUrl: './pre-registration.component.css'
})
export class LoanPreRegistrationComponent {
  dniForm: FormGroup;
  dniErrorMessage: string = '';
  errorMessage: string = '';
  successMessage: string = '';  // Añadido para manejar el éxito

  constructor(private fb: FormBuilder, private loanService: LoanService, private router: Router) {
    this.dniForm = this.fb.group({
      identifier: ['', [Validators.required, Validators.pattern(/^\d{8}$|^\d{11}$/)]], // Aceptar 8 o 11 dígitos
    });
  }

  onSubmit() {
    if (this.dniForm.valid) {
      this.loanService.createUser(this.dniForm.value).subscribe({
        next: response => {
          console.log('Respuesta del backend:', response);
          const identifierType = this.getIdentifierType(response.identifier);
          this.successMessage = `El ${identifierType} se ha registrado exitosamente.`;
          setTimeout(() => {
            this.router.navigate(['loan/create'], {
              state: { identifier: response.identifier, fullName: response.fullName }
            });
          }, 1500);
        },
        error: err => {
          if (err.status === 400 && err.error === 'DNI/RUC no válido') {
            this.dniErrorMessage = 'El DNI/RUC proporcionado no es válido.';
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

  private getIdentifierType(identifier: string): string {
    return identifier.length === 8 ? 'DNI' : 'RUC';
  }
}
