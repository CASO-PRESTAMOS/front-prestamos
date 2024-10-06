import { Routes } from '@angular/router';
import {LoginComponent} from "./Components/Auth/login/login.component";
import {LoanRegistrationComponent} from "./Components/loan/registration/registration.component";
import {AdminDashboardComponent} from "./Components/Users/admin-dashboard/admin-dashboard.component";
import {LoanHistoryComponent} from "./Components/loan/loan-history/loan-history.component";

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'loan/create', component: LoanRegistrationComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'loan/history', component: LoanHistoryComponent },



];
