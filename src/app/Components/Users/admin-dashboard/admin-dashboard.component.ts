import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { LoanService } from '../../Services/loan.service';
import { AuthService } from '../../Services/auth.service';
import { Loan } from '../../loan/loan.model';
import { LoanDetails } from '../../Sechedule/payment-schedule.model';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  recentLoans: Loan[] = [];
  paymentSchedules: any[] = [];
  successMessage: string | null = null;
  errorMessage: string = '';
  loan: LoanDetails | null = null;
  allLoans: Loan[] = [];
  showPasswordModal = false; // Controla la visibilidad del modal de cambio de contraseña
  newPassword: string = '';
  selectedStatus: string = '';
  filteredPaymentSchedules: any[] = [];



  private passwordModalShownKey = 'passwordModalShown'; // Clave para rastrear si el modal ya fue mostrado

  constructor(
    private loanService: LoanService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRecentLoans();
    this.simulatePaymentSchedules();

    // Mostrar el modal solo si no ha sido mostrado ya en este inicio de sesión
    const modalShown = localStorage.getItem(this.passwordModalShownKey);
    if (!modalShown) {
      this.showPasswordModal = true;
      localStorage.setItem(this.passwordModalShownKey, 'true'); // Marcar como mostrado
    }
  }

  loadRecentLoans(): void {
    this.loanService.getAllLoans().subscribe(
      (loans: Loan[]) => {
        this.recentLoans = loans.slice(0, 3); // Mostrar solo los últimos 3 préstamos
        this.allLoans = loans;
        this.simulatePaymentSchedules(); // Simular cronogramas basados en los préstamos
      },
      (error: any) => {

        console.error('Error al cargar los préstamos', error);
      }
    );
  }

  simulatePaymentSchedules(): void {
    this.paymentSchedules = []; // Reiniciar los cronogramas

    this.allLoans.forEach((loan) => {
      this.loanService.getLoanByUserIdentifier(loan.identifier).subscribe({
        next: (loanDetailsArray: LoanDetails[]) => {
          if (loanDetailsArray && loanDetailsArray.length > 0) {
            loanDetailsArray.forEach((loanDetails) => {
              const filteredPayments = loanDetails.paymentScheduleList.filter(
                (payment) =>
                  payment.status === 'UNPAID' ||
                  payment.status === 'LATE' ||
                  loanDetails.status === 'JUDICIAL_DEBT'
              );

              filteredPayments.sort(
                (a, b) =>
                  new Date(a.paymentDate).getTime() -
                  new Date(b.paymentDate).getTime()
              );

              const nearestPayment = filteredPayments[0];
              if (nearestPayment) {
                this.paymentSchedules.push({
                  id: nearestPayment.id,
                  loan: loanDetails.user,
                  paymentDueDate: nearestPayment.paymentDate,
                  installmentAmount: nearestPayment.amount,
                  paid: nearestPayment.status === 'PAID',
                  status:
                    loanDetails.status === 'JUDICIAL_DEBT'
                      ? 'JUDICIAL_DEBT'
                      : nearestPayment.status
                });
              }
            });

            this.paymentSchedules.sort(
              (a, b) =>
                new Date(a.paymentDueDate).getTime() -
                new Date(b.paymentDueDate).getTime()
            );
          }
        },
        error: (error) => {
          console.error('Error al cargar cronograma de pagos:', error);
        }
      });
    });
  }

  navigateToAllLoans(): void {
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

  navigateToLoanRegistration(): void {
    this.router.navigate(['/loan/precreate']);
  }

  navigateToLoanHistory(): void {
    this.router.navigate(['/loan/history']);
  }

  viewLoanDetails(loan: Loan): void {
    this.router.navigate(['/loan/loan-view-list', loan.identifier]);
  }

  updatePassword(): void {
    this.authService.updatePassword(this.newPassword).subscribe({
      next: () => {
        this.successMessage = 'Contraseña actualizada con éxito.';
        this.errorMessage = '';
        this.showPasswordModal = false; // Cierra el modal
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar la contraseña.';
        console.error('Error al actualizar la contraseña:', error);
      }
    });
  }

  logout(): void {
    localStorage.removeItem(this.passwordModalShownKey); // Reinicia el estado del modal para el próximo inicio de sesión
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  closeModal(): void {
    this.showPasswordModal = false;
  }

  filterSchedules(): void {
    // Si no se ha seleccionado un estado (valor vacío), mostramos todos los cronogramas
    if (this.selectedStatus === "") {
      this.filteredPaymentSchedules = [...this.paymentSchedules];  // Crear una copia de la lista completa
    } else {
      // Filtramos según el estado seleccionado
      this.filteredPaymentSchedules = this.paymentSchedules.filter(schedule =>
        schedule.status === this.selectedStatus
      );
    }
  }


}
