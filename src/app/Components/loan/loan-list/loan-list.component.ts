import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { Router } from '@angular/router';
import { LoanService } from '../../Services/loan.service';
import { Loan } from '../../loan/loan.model';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf, FormsModule], // Agrega FormsModule aquí
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.css']
})
export class LoanListComponent implements OnInit {
  loans: Loan[] = []; // Almacena todos los préstamos
  searchQuery: string = ''; // Texto del buscador
  errorMessage: string = ''; // Manejo de errores

  constructor(
    private loanService: LoanService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllLoans();
  }

  loadAllLoans(): void {
    this.loanService.getAllLoans().subscribe(
      (loans: Loan[]) => {
        this.loans = loans; // Carga todos los préstamos
      },
      (error) => {
        this.errorMessage = 'Error al cargar los préstamos.';
        console.error('Error al cargar los préstamos:', error);
      }
    );
  }

  getIdentifierType(identifier: string): string {
    if (identifier.length === 8) {
      return 'DNI';
    } else if (identifier.length === 11) {
      return 'RUC';
    } else {
      return 'ID'; // Un valor por defecto en caso de que no sea ni DNI ni RUC
    }
  }

  get filteredLoans(): Loan[] {
    if (!this.searchQuery.trim()) {
      return this.loans; // Sin filtro, retorna todos los préstamos
    }

    const query = this.searchQuery.toLowerCase();
    return this.loans.filter(
      loan =>
        loan.fullName.toLowerCase().includes(query) || // Filtra por nombre
        loan.identifier.toLowerCase().includes(query) // Filtra por DNI/RUC
    );
  }

  goBack(): void {
    window.history.back();
  }

  viewLoanDetails(loan: Loan): void {
    this.router.navigate(['/loan/loan-view-list', loan.identifier]);
  }
}