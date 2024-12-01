import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService } from "../../Services/loan.service";
import { LoanDetails, PaymentSchedule } from "../../Sechedule/payment-schedule.model";
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-loan-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-history.component.html',
  styleUrls: ['./loan-history.component.css']
})
export class LoanHistoryComponent implements OnInit {
  loans: LoanDetails[] = []; // Almacenará los préstamos detallados con status "PAID"

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.loadPaidLoans();
  }

  loadPaidLoans(): void {
    // Supongamos que tienes un método para obtener todos los identificadores de usuarios
    this.loanService.getAllLoans().subscribe({
      next: (allLoans) => {
        const identifiers = allLoans.map(loan => loan.identifier);

        // Hacer llamadas paralelas a getLoanByUserIdentifier para cada identifier
        const loanRequests = identifiers.map(identifier => 
          this.loanService.getLoanByUserIdentifier(identifier)
        );

        forkJoin(loanRequests).subscribe({
          next: (allLoanDetails) => {
            // Combinar resultados y filtrar solo los préstamos completamente pagados
            this.loans = allLoanDetails
              .flat() // Aplanar el array de arrays
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