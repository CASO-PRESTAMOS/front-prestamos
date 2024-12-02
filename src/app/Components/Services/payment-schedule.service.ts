import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {PaymentSchedule } from "../Schedule/payment-schedule.model";
import {environment } from "../../enviroment";  // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class PaymentScheduleService {
  private apiUrl: string = `${environment.apiUrl}/admin/payment-schedule`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token: string | null = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  generatePaymentSchedules(): Observable<PaymentSchedule[]> {
    return this.http.get<PaymentSchedule[]>(`${this.apiUrl}/generate`, { headers: this.getAuthHeaders() });
  }

  markPaymentAsCompleted(paymentId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/mark-completed/${paymentId}`, {}, { headers: this.getAuthHeaders() });
  }
}
