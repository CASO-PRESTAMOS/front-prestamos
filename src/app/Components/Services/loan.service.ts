import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from "@angular/common/http";
import { environment } from '../../enviroment';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private loanUrl = `${environment.apiUrl}/admin/loan`; // Uso de environment para la URL

  constructor(private http: HttpClient) { }

  createLoan(loanData: any): Observable<any> {
    return this.http.post(`${this.loanUrl}/create`, loanData);
  }

  getLoanById(loanId: number): Observable<any> {
    return this.http.get(`${this.loanUrl}/${loanId}`);
  }
}
