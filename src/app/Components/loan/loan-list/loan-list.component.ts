import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { LoanService } from '../../Services/loan.service';
import { Loan } from '../../loan/loan.model';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf],
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.css'] 
})
export class LoanListComponent implements OnInit {
  loans: Loan[] = []; // Cambiado para almacenar todos los préstamos
  errorMessage: string = ''; // Para manejar errores si algo falla

  constructor(
    private loanService: LoanService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllLoans(); // Cambiar a cargar todos los préstamos
  }

  loadAllLoans(): void {
    this.loanService.getAllLoans().subscribe(
      (loans: Loan[]) => {
        this.loans = loans; // Asignar todos los préstamos
      },
      (error) => {
        this.errorMessage = 'Error al cargar los préstamos.';
        console.error('Error al cargar los préstamos:', error);
      }
    );
  }

  goBack(): void {
    window.history.back();
  }

  viewLoanDetails(loan: Loan): void {
    this.router.navigate(['/loan/loan-view-list', loan.identifier]);
  }
}