import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService } from "../../Services/loan.service";
import { LoanDetails, PaymentSchedule } from "../../Sechedule/payment-schedule.model";
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-loan-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-history.component.html',
  styleUrls: ['./loan-history.component.css']
})
export class LoanHistoryComponent implements OnInit {
  loans: LoanDetails[] = []; // Almacenará los préstamos detallados con status "PAID"
  errorMessages: string[] = []; // Para registrar errores individuales

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.loadPaidLoans();
  }

  loadPaidLoans(): void {
    this.loanService.getAllLoans().subscribe({
      next: (allLoans) => {
        const identifiers = allLoans.map(loan => loan.identifier);

        // Crear un array de observables con manejo de errores individuales
        const loanRequests = identifiers.map(identifier =>
          this.loanService.getLoanByUserIdentifier(identifier).pipe(
            catchError(error => {
              this.errorMessages.push(`Error para el identificador ${identifier}: ${error.message}`);
              return of([]); // Devolver un array vacío si hay error
            })
          )
        );

        // Ejecutar todas las consultas en paralelo
        forkJoin(loanRequests).subscribe({
          next: (allLoanDetails) => {
            // Aplanar resultados y filtrar solo los préstamos completamente pagados
            this.loans = allLoanDetails
              .flat()
              .filter((loan: LoanDetails) =>
                loan.paymentScheduleList.every((payment: PaymentSchedule) => payment.status === 'PAID')
              );
          },
          error: (error) => {
            console.error('Error al cargar los detalles de los préstamos:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener identificadores de préstamos:', error);
      }
    });
  }

  goBack(): void {
    window.history.back();
  }
}