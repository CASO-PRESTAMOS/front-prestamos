import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../Services/loan.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-registration',
  standalone: true, // Marca como standalone
  imports: [CommonModule, ReactiveFormsModule], // Importa ReactiveFormsModule
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  loanForm: FormGroup;
  dniErrorMessage: string | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private loanService: LoanService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { identifier: string; fullName: string };
  
    // Inicializar formulario
    this.loanForm = this.fb.group({
      identifier: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      fullName: ['', Validators.required],
      amount: ['', Validators.required],
      months: ['', [Validators.required, Validators.min(1)]]
    });
  
    // Si los datos del estado están disponibles, actualiza los valores y desactiva campos
    if (state) {
      this.loanForm.patchValue({
        identifier: state.identifier,
        fullName: state.fullName
      });
      this.loanForm.get('identifier')?.disable();
      this.loanForm.get('fullName')?.disable();
    }
  }

  ngOnInit(): void {}

  // Enviar el formulario
  onSubmit(): void {
    if (this.loanForm.valid) {
      const loanData = this.loanForm.getRawValue(); // Obtener todos los valores, incluyendo los deshabilitados
      this.loanService.createLoan(loanData).subscribe(
        (response) => {
          this.successMessage = 'El préstamo se ha creado exitosamente.';
          this.errorMessage = null;
          console.log('Préstamo creado:', response);
  
          // Redirigir después de 3 segundos
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard']);
          }, 2000); // 3000 ms = 3 segundos
        },
        (error) => {
          this.errorMessage = 'Error al crear el préstamo.';
          this.successMessage = null;
          console.error('Error al crear el préstamo:', error);
        }
      );
    }
  }

  cancelRegistration(): void {
    this.loanForm.reset();
    this.dniErrorMessage = null;
    this.errorMessage = null;
    this.successMessage = null;
    this.router.navigate(['/admin/dashboard']);
  }
}