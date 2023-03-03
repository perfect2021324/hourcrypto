import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFound } from 'src/app/util/component/page-not-found/page-not-found';
import { HoursComponent } from './hours/hours.component';

const routes: Routes = [
  { path: "wallet", component: HoursComponent },
  { path: "**", component: PageNotFound }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
