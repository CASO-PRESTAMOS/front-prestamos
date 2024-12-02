import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders , HttpParams} from "@angular/common/http";
import { environment } from '../../enviroment';
import { Loan } from "../loan/loan.model";
import { LoanDetails } from '../Sechedule/payment-schedule.model';
import { AuthService } from "./auth.service";  // Asegúrate de importar AuthService o donde se gestione el token

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();  // Obtén el token desde AuthService
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  createLoan(loanData: Loan): Observable<Loan> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams()
      .set('identifier', loanData.identifier.toString())
      .set('amount', loanData.amount)
      .set('months', loanData.months);
  
    return this.http.post<Loan>(`${this.apiUrl}/loans/create`, null, { headers, params });
  }

  getLoanById(loanId: number): Observable<Loan> {
    const headers = this.getAuthHeaders();
    return this.http.get<Loan>(`${this.apiUrl}/${loanId}`, { headers });
  }

  getAllLoans(): Observable<Loan[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Loan[]>(`${this.apiUrl}/users/`, { headers });
  }

  getLoanByUserIdentifier(identifier: string): Observable<LoanDetails[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<LoanDetails[]>(`${this.apiUrl}/loans/user/${identifier}`, { headers });
  }

  createUser(loanData: Loan): Observable<Loan>{
    const headers = this.getAuthHeaders();
    const params = new HttpParams()
    .set('identifier', loanData.identifier.toString());

    return this.http.post<Loan>(`${this.apiUrl}/users/create`, null, { headers, params });
  }

  changeState(paymentId: number): Observable<void> {
    const headers = this.getAuthHeaders(); 
    const url = `${this.apiUrl}/loans/payment/${paymentId}/markPaid`; 
    return this.http.patch<void>(url, null, { headers });
  }

  markAllPaymentsAsPaid(loanId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.patch<void>(`${this.apiUrl}/payments/loan/${loanId}/markAsPaid`, null, { headers });
  }

  getLoanDetailsById(id: number): Observable<LoanDetails> {
    const headers = this.getAuthHeaders();
    return this.http.get<LoanDetails>(`${this.apiUrl}/loans/loan/${id}`, { headers });
  }

}
