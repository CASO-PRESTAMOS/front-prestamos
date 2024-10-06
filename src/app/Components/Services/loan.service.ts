import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from "@angular/common/http";
import { environment } from '../../enviroment';
import {Loan} from "../loan/loan.model";

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private apiUrl = `${environment.apiUrl}/admin/loan`;

  constructor(private http: HttpClient) { }

  createLoan(loanData: Loan): Observable<Loan> {
    return this.http.post<Loan>(`${this.apiUrl}/create`, loanData);
  }

  getLoanById(loanId: number): Observable<Loan> {
    return this.http.get<Loan>(`${this.apiUrl}/${loanId}`);
  }

  getAllLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/all`);
  }
}
