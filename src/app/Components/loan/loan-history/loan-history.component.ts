import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService } from "../../Services/loan.service";
import { LoanDetails, PaymentSchedule } from "../../Schedule/payment-schedule.model";
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
  loans: LoanDetails[] = [];
  errorMessages: string[] = [];

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.loadLoansHistory();
  }

  loadLoansHistory(): void {
    this.loanService.getAllLoans().subscribe({
      next: (allLoans) => {
        const identifiers = allLoans.map(loan => loan.identifier);

        const loanRequests = identifiers.map(identifier =>
          this.loanService.getLoanByUserIdentifier(identifier).pipe(
            catchError(error => {
              this.errorMessages.push(`Error para el identificador ${identifier}: ${error.message}`);
              return of([]);
            })
          )
        );

        forkJoin(loanRequests).subscribe({
          next: (allLoanDetails) => {
            this.loans = allLoanDetails
              .flat()
              .filter((loan: LoanDetails) =>
                this.isLoanPaidOrJudicial(loan)
              );
            
            this.loans.forEach(loan => {
              loan.status = this.getLoanStatus(loan);
            });
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

  isLoanPaidOrJudicial(loan: LoanDetails): boolean {
    const isPaid = loan.paymentScheduleList.every((payment: PaymentSchedule) => payment.status === 'PAID');
    
    const isJudicialDebt = loan.status === 'JUDICIAL_DEBT';

    return isPaid || isJudicialDebt;
  }

  getLoanStatus(loan: LoanDetails): string {
    if (loan.status === 'JUDICIAL_DEBT') {
      return 'Deuda Judicial';
    } else if (loan.paymentScheduleList.every((payment: PaymentSchedule) => payment.status === 'PAID')) {
      return 'Pagado';
    } else {
      return 'En Proceso';
    }
  }

  goBack(): void {
    window.history.back();
  }
}