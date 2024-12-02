import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService } from "../../Services/auth.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  loginMessage: string = '';
  loginSuccess: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.loginSuccess = true;
          this.loginMessage = 'Inicio de sesión exitoso';
          localStorage.setItem('token', response.token);
          // Esperar un poco antes de redirigir para que el usuario pueda ver el mensaje
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard']);
          }, 2000);
        },
        error: (error) => {
          this.loginSuccess = false;
          this.loginMessage = 'Credenciales incorrectas';
          console.error('Error de inicio de sesión', error);
        }
      });
    }
  }
}
