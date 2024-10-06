export interface Loan {
  loanId: number;
  clientName: string;
  clientDNI: string;
  clientAddress: string;
  amount: number;
  duration: number;
  interestRate: number;
  totalAmount: number;
  startDate: Date;
  expireDate: Date;
  status: string;
}
