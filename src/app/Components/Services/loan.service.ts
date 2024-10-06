import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../enviroment';
import { Loan } from "../loan/loan.model";
import { AuthService } from "./auth.service";  // Asegúrate de importar AuthService o donde se gestione el token

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private apiUrl = `${environment.apiUrl}/admin/loan`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();  // Obtén el token desde AuthService
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  createLoan(loanData: Loan): Observable<Loan> {
    const headers = this.getAuthHeaders();
    return this.http.post<Loan>(`${this.apiUrl}/create`, loanData, { headers });
  }

  getLoanById(loanId: number): Observable<Loan> {
    const headers = this.getAuthHeaders();
    return this.http.get<Loan>(`${this.apiUrl}/${loanId}`, { headers });
  }

  getAllLoans(): Observable<Loan[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Loan[]>(`${this.apiUrl}/all`, { headers });
  }

}
