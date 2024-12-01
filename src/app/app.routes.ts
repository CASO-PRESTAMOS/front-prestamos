import { Routes } from '@angular/router';
import {LoginComponent} from "./Components/Auth/login/login.component";
import {RegistrationComponent} from "./Components/loan/registration/registration.component";
import {LoanPreRegistrationComponent} from "./Components/loan/pre-registration/pre-registration.component";
import {AdminDashboardComponent} from "./Components/Users/admin-dashboard/admin-dashboard.component";
import {LoanHistoryComponent} from "./Components/loan/loan-history/loan-history.component";
import {LoanDetailsComponent} from "./Components/loan/loan-details/loan-details.component";
import {LoanListComponent} from "./Components/loan/loan-list/loan-list.component";

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'loan/precreate', component: LoanPreRegistrationComponent },
  { path: 'loan/create', component: RegistrationComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'loan/history', component: LoanHistoryComponent },
  { path: 'loan/loan-details/:identifier', component: LoanDetailsComponent },
  { path: 'loan/loan-list', component: LoanListComponent },



];
