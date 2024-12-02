import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../Services/loan.service';
import { LoanDetails, PaymentSchedule } from '../../Schedule/payment-schedule.model';

@Component({
  selector: 'app-loan-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css']
})
export class LoanDetailsComponent implements OnInit {
  loan: LoanDetails | null = null; // Almacenará los detalles del préstamo

  constructor(
    private loanService: LoanService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Obtiene el ID del préstamo desde la URL
    if (id) {
      this.loadLoanDetails(parseInt(id, 10)); // Convertir a número y cargar los detalles
    } else {
      console.error('No ID provided in route');
      this.router.navigate(['/admin/dashboard']);
    }
  }

  loadLoanDetails(id: number): void {
    this.loanService.getLoanDetailsById(id).subscribe({
      next: (loanDetails: LoanDetails) => {
        this.loan = loanDetails; // Asigna los detalles del préstamo
      },
      error: (error) => {
        console.error('Error loading loan details:', error);
        this.router.navigate(['/admin/dashboard']); // Navega al dashboard si ocurre un error
      }
    });
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
        payment.status = 'PAID'; // Actualiza el estado del pago localmente
        this.checkLoanCompletion(); // Verifica si el préstamo está completado
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

    this.loanService.markAllPaymentsAsPaid(this.loan.id).subscribe({
      next: () => {
        this.loan!.paymentScheduleList.forEach(payment => payment.status = 'PAID'); // Actualiza localmente
        this.loan!.status = 'PAID'; // Cambia el estado del préstamo
      },
      error: (error) => {
        console.error('Error al marcar todos los pagos como completados:', error);
      }
    });
  }

  allPaymentsArePaid(): boolean {
    return this.loan ? this.loan.paymentScheduleList.every(payment => payment.status === 'PAID') : false;
  }

  goBack(): void {
    window.history.back();
  }

  generatePdf(): void {
    if (this.loan) {
      this.loanService.generateLoanPdf(this.loan.id).subscribe({
        next: (response) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Cronograma-${this.loan?.id}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error al generar el PDF:', error);
        }
      });
    } else {
      console.warn('No se ha cargado el préstamo. No se puede generar el PDF.');
    }
  }

  generateBoleta(payment: PaymentSchedule): void {
    if (!payment) {
      return;
    }

    this.loanService.generateBoleta(this.loan!.id, payment.id).subscribe({
      next: (response: Blob) => {
        // Crea un enlace para descargar el archivo PDF
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        if(this.loan?.user.identifier.length==8){
          link.download = `Comprobante_Boleta.pdf`;
        }
        if(this.loan?.user.identifier.length==11){
          link.download = `Comprobante_Factura.pdf`;
        }
        link.click();
        window.URL.revokeObjectURL(url); // Limpia el objeto URL
      },
      error: (error) => {
        console.error('Error al generar la boleta:', error);
      },
    });
  }
}
