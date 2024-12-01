import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../Services/loan.service';
import { LoanDetails } from '../../Sechedule/payment-schedule.model';
import { PaymentSchedule } from '../../Sechedule/payment-schedule.model';

@Component({
  selector: 'app-loan-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css']
})
export class LoanDetailsComponent implements OnInit {
  loan: LoanDetails | null = null;

  constructor(
    private loanService: LoanService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const identifier = this.route.snapshot.paramMap.get('identifier');
    if (identifier) {
      this.loadLoanDetails(identifier);
    } else {
      console.error('No identifier provided in route');
      this.router.navigate(['/admin/dashboard']);
    }
  }

  loadLoanDetails(identifier: string): void {
    this.loanService.getLoanByUserIdentifier(identifier).subscribe(
      (loanDetailsArray: LoanDetails[]) => {
        if (loanDetailsArray && loanDetailsArray.length > 0) {
          this.loan = loanDetailsArray[0]; // Tomamos el primer préstamo del array
        } else {
          console.warn('No loans found for this user');
        }
      },
      (error: any) => {
        console.error('Error loading loan details:', error);
        this.router.navigate(['/admin/dashboard']);
      }
    );
  }

  private checkLoanCompletion(): void {
    if (this.loan) {
      const allPaid = this.loan.paymentScheduleList.every(payment => payment.status === 'PAID');
      this.loan.status = allPaid ? 'PAID' : 'UNPAID';
    }
  }

  markAsPaid(payment: PaymentSchedule): void {
    if (!payment || payment.status === 'PAID') {
      return; // Evita ejecutar si ya está pagado
    }
  
    this.loanService.changeState(payment.id).subscribe({
      next: () => {
        // Actualiza el estado del pago localmente
        payment.status = 'PAID';
        console.log(`Pago con ID ${payment.id} marcado como pagado.`);
  
        // Verifica si todos los pagos están completados
        this.checkLoanCompletion();
      },
      error: (error) => {
        console.error('Error al marcar el pago como pagado:', error);
      }
    });
  }

  markAllAsPaid(): void {
    if (!this.loan) {
      return;
    }
  
    // Bloquear el botón temporalmente
    const loanId = this.loan.id;
  
    this.loanService.markAllPaymentsAsPaid(loanId).subscribe({
      next: () => {
        // Actualizar el estado de todos los pagos a "PAID" en el frontend
        this.loan!.paymentScheduleList.forEach(payment => {
          payment.status = 'PAID';
        });
  
        // Cambiar el estado del préstamo a "PAID"
        this.loan!.status = 'PAID';
  
        console.log(`Todos los pagos del préstamo con ID ${loanId} se marcaron como pagados.`);
      },
      error: (error) => {
        console.error('Error al marcar todos los pagos como completados:', error);
      }
    });
  }

  allPaymentsArePaid(): boolean {
    if (!this.loan) {
      return false;
    }
  
    return this.loan.paymentScheduleList.every(payment => payment.status === 'PAID');
  }

  goBack(): void {
    window.history.back();
  }
}