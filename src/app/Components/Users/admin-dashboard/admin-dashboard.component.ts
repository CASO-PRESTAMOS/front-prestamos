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
  allLoans: Loan[] = [];

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
        this.allLoans = loans;
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
  
    // Obtener todos los préstamos activos
    this.allLoans.forEach(loan => {
      this.loanService.getLoanByUserIdentifier(loan.identifier).subscribe({
        next: (loanDetailsArray: LoanDetails[]) => {
          if (loanDetailsArray && loanDetailsArray.length > 0) {
            // Procesar todos los préstamos del usuario
            const unpaidOrLatePayments: any[] = [];
  
            loanDetailsArray.forEach(loanDetails => {
              // Filtrar pagos "UNPAID" o "LATE" para este préstamo
              const filteredPayments = loanDetails.paymentScheduleList.filter(
                payment => payment.status === 'UNPAID' || payment.status === 'LATE'
              );
  
              // Añadir pagos pendientes o atrasados a la lista general
              unpaidOrLatePayments.push(...filteredPayments);
            });
  
            // Ordenar todos los pagos pendientes o atrasados por fecha
            unpaidOrLatePayments.sort(
              (a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime()
            );
  
            // Tomar el pago más cercano si existe
            const upcomingPayment = unpaidOrLatePayments[0];
            if (upcomingPayment) {
              // Buscar los detalles del préstamo asociado al pago
              const associatedLoan = loanDetailsArray.find(loan =>
                loan.paymentScheduleList.some(payment => payment.id === upcomingPayment.id)
              );
  
              if (associatedLoan) {
                this.paymentSchedules.push({
                  id: upcomingPayment.id, // ID del pago
                  loan: associatedLoan.user, // Datos del cliente
                  paymentDueDate: upcomingPayment.paymentDate, // Fecha de pago
                  installmentAmount: upcomingPayment.amount, // Monto de la cuota
                  paid: upcomingPayment.status === 'PAID', // Estado del pago
                  status: upcomingPayment.status // Guardar el estado real del pago
                });
              }
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
        }, 100);
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
    this.router.navigate(['/loan/loan-view-list', loan.identifier]);
  }
}
