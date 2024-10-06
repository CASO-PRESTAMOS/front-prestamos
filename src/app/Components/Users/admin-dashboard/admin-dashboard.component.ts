import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { LoanService } from '../../Services/loan.service';
import { Loan } from '../../loan/loan.model';
import { PaymentScheduleService } from '../../Services/payment-schedule.service';
import {PaymentSchedule } from "../../Sechedule/payment-schedule.model";  // Asegúrate de importar PaymentSchedule

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  recentLoans: Loan[] = [];
  paymentSchedules: any[] = [];  // Simulación de cronogramas basados en los préstamos
  successMessage: string | null = null;
  errorMessage: string = '';

  constructor(
    private loanService: LoanService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRecentLoans();
    this.simulatePaymentSchedules();  // Simulación de cronogramas
  }

  loadRecentLoans(): void {
    this.loanService.getAllLoans().subscribe(
      (loans: Loan[]) => {
        this.recentLoans = loans.slice(0, 5);  // Mostrar los últimos 5 préstamos
        this.simulatePaymentSchedules();  // Simular cronogramas basados en los préstamos
      },
      (error: any) => {
        this.errorMessage = 'Error al cargar los préstamos.';
        console.error('Error al cargar los préstamos', error);
      }
    );
  }

  simulatePaymentSchedules(): void {
    // Simulación de cronogramas basados en los préstamos
    this.paymentSchedules = this.recentLoans.map((loan: Loan) => {
      return {
        loan: loan,
        paymentDueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),  // Fecha simulada del próximo pago
        installmentAmount: loan.amount / loan.duration,  // Monto de la cuota
        paid: false  // Estado simulado
      };
    });
  }

  markAsCompleted(schedule: any): void {
    schedule.paid = true;  // Simular marcar el pago como completado
    this.successMessage = 'Pago marcado como completado exitosamente.';
    this.errorMessage = '';  // Limpiar el mensaje de error
  }

  // Funciones de navegación
  navigateToLoanRegistration(): void {
    this.router.navigate(['/loan/create']);
  }

  navigateToLoanHistory(): void {
    this.router.navigate(['/loan/history']);
  }
}
