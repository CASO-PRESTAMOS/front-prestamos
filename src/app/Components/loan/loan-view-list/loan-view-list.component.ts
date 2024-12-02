import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService } from "../../Services/loan.service";
import { LoanDetails } from "../../Schedule/payment-schedule.model";

@Component({
  selector: 'app-loan-view-list',
  standalone: true,
  imports: [CommonModule, NgForOf],
  templateUrl: './loan-view-list.component.html',
  styleUrls: ['./loan-view-list.component.css']
})
export class LoanViewListComponent implements OnInit {
  loans: LoanDetails[] = []; // Lista de préstamos obtenidos del backend
  userFullName: string = ''; // Nombre del cliente
  userIdentifier: string = ''; // DNI del cliente

  constructor(
    private loanService: LoanService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtiene el "identifier" desde la URL
    const identifier = this.route.snapshot.paramMap.get('identifier');
    if (identifier) {
      this.loadLoans(identifier);
    } else {
      console.error('No se proporcionó un identifier en la ruta.');
    }
  }

  loadLoans(identifier: string): void {
    this.loanService.getLoanByUserIdentifier(identifier).subscribe({
      next: (loanDetails: LoanDetails[]) => {
        if (loanDetails.length > 0) {
          this.loans = loanDetails; // Asigna los préstamos al array
          // Establece información del cliente desde el primer préstamo
          this.userFullName = loanDetails[0].user.fullName;
          this.userIdentifier = loanDetails[0].user.identifier;
        } else {
          console.warn('No se encontraron préstamos para este cliente.');
        }
      },
      error: (error) => {
        console.error('Error al cargar los préstamos:', error);
      }
    });
  }

  viewLoanDetails(loanId: number): void {
    // Navegar a la vista de detalles de un préstamo específico
    this.router.navigate(['loan/loan-details', loanId]);
  }

  viewLoanChronogram():void{
    
  }

  goBack(): void {
    window.history.back(); // Regresa a la página anterior
  }
}