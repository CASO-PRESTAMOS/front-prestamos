import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { LoanService } from '../../Services/loan.service';
import { Loan } from '../../loan/loan.model';
import { LoanDetails } from '../../Sechedule/payment-schedule.model';
import { PaymentScheduleService } from '../../Services/payment-schedule.service';
import {PaymentSchedule } from "../../Sechedule/payment-schedule.model";

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
  loan: LoanDetails | null = null;

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
        this.recentLoans = loans.slice(0, 3); // Mostrar solo los últimos 3 préstamos
        this.simulatePaymentSchedules(); // Simular cronogramas basados en los préstamos
      },
      (error: any) => {
        this.errorMessage = 'Error al cargar los préstamos.';
        console.error('Error al cargar los préstamos', error);
      }
    );
  }

  simulatePaymentSchedules(): void {
    this.paymentSchedules = []; // Reiniciar los cronogramas
  
    this.recentLoans.forEach(loan => {
      this.loanService.getLoanByUserIdentifier(loan.identifier).subscribe({
        next: (loanDetailsArray: LoanDetails[]) => {
          if (loanDetailsArray && loanDetailsArray.length > 0) {
            const loanDetails = loanDetailsArray[0]; // Usar el primer préstamo
            const upcomingPayment = loanDetails.paymentScheduleList
              .filter(payment => payment.status !== 'PAID') // Solo pagos pendientes
              .sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime())[0]; // Más cercano
  
            // Si hay un pago pendiente más cercano, agregarlo al cronograma
            if (upcomingPayment) {
              this.paymentSchedules.push({
                id: upcomingPayment.id, // ID del pago
                loan: loanDetails.user, // Datos del cliente
                paymentDueDate: upcomingPayment.paymentDate, // Fecha de pago
                installmentAmount: upcomingPayment.amount, // Monto de la cuota
                paid: upcomingPayment.status === 'PAID' // Estado del pago
              });
            }
          }
        },
        error: (error) => {
          console.error('Error al cargar cronograma de pagos:', error);
        }
      });
    });
  }

  navigateToAllLoans(){
    this.router.navigate(['/loan/loan-list']);
  }

  markAsCompleted(schedule: any): void {
    if (!schedule.id) {
      console.error('Error: El ID del pago no está definido.');
      return;
    }
  
    this.loanService.changeState(schedule.id).subscribe({
      next: () => {
        schedule.paid = true; // Actualiza el estado localmente
        this.successMessage = 'Pago marcado como completado exitosamente.';
        this.errorMessage = ''; // Limpia el mensaje de error
  
        // Esperar 2 segundos y recargar los cronogramas
        setTimeout(() => {
          this.simulatePaymentSchedules(); // Recargar cronogramas
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = 'Error al marcar el pago como completado.';
        console.error('Error al marcar el pago como completado:', error);
      }
    });
  }

  // Funciones de navegación
  navigateToLoanRegistration(): void {
    this.router.navigate(['/loan/precreate']);
  }

  navigateToLoanHistory(): void {
    this.router.navigate(['/loan/history']);
  }

  viewLoanDetails(loan: Loan): void {
    this.router.navigate(['/loan/loan-details', loan.identifier]);
  }
}
