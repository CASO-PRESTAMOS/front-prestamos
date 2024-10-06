export interface PaymentSchedule {
  id: number;
  paymentDueDate: string;
  paid: boolean;
  installmentAmount: number;
  loan: {
    clientName: string;
  };
}
