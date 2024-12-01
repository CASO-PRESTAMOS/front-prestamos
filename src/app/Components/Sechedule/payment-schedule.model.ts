export interface User {
  identifier: string;
  fullName: string;
}

export interface PaymentSchedule {
  id: number;
  paymentDate: string; // Usar string para fechas permite mayor flexibilidad con formatos
  amount: number;
  status: string;
  lateSince: string | null; // Puede ser null
}

export interface LoanDetails {
  id: number;
  user: User;
  amount: number;
  months: number;
  interestRate: number;
  startDate: string;
  endDate: string;
  status: string;
  paymentScheduleList: PaymentSchedule[];
}