import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from '../auth/auth.component';
import { PageNotFound } from '../util/component/page-not-found/page-not-found';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DonateComponent } from './donate/donate.component';
import { JobComponent } from './job/job.component';

const routes: Routes = [
  { path: "auth", component: AuthComponent, loadChildren: () => import("../auth/auth-routing.module").then(m => m.AuthRoutingModule).catch(e => console.error(e)) },
  { path: "job", component: JobComponent, loadChildren: () => import("./job/job-routing.module").then(m => m.JobRoutingModule).catch(e => console.error(e)) },
  { path: "transaction", loadChildren: () => import("./transaction/transaction-routing.module").then(m => m.TransactionRoutingModule).catch(e => console.error(e)) },
  { path: "donate", component: DonateComponent },
  { path: "payment", loadChildren: () => import("./payment/payment-routing.module").then(m => m.PaymentRoutingModule).catch(e => console.error(e)) },
  { path: "changePassword", component: ChangePasswordComponent },
  { path: "", pathMatch: "full", redirectTo: "job" },
  { path: "**", component: PageNotFound },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
